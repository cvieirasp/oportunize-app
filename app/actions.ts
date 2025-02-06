"use server"

import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { request } from "@arcjet/next"

import { companySchema, jobSchema, jobSeekerSchema, LoginSchema, RegisterSchema } from "@/app/utils/zodSchemas"
import { requireUser } from "@/app/utils/hooks"
import { prisma } from "@/app/utils/database"
import arcjet, { detectBot, shield } from "@/app/utils/arcjet"
import { stripe } from "@/app/utils/stripe"
import { jobListingDurationPricing } from "./utils/pricingTiers"
import { inngest } from "@/app/utils/innjest"
import { getUserByEmail } from "@/data/user"
import { hashPassword } from "@/app/utils/hash"
import { signIn } from "@/app/utils/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { error } from "console"
import { genereateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/resend"
import { getVerificationTokenByToken } from "@/data/verification-token"

const aj = arcjet.withRule(
  shield({
    mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE"
  })
).withRule(
  detectBot({
    mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
    allow: [],
  })
)

export const login = async(data: z.infer<typeof LoginSchema>) => {
  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return { error: "Invalid fields" }
  }

  const { email, password } = validatedData.data

  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await genereateVerificationToken(email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
    return { success: "Email de confirmação enviado!" }
  }

  let redirectUrl = DEFAULT_LOGIN_REDIRECT

  try {
    redirectUrl = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin": {
          return { error: "Invalid credentials" }
        }
        default: {
          return { error: "Something went wrong" }
        }
      }
    }

    throw error
  }

  redirect(redirectUrl)
}

export const register = async(data: z.infer<typeof RegisterSchema>) => {
  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }
  
  const validatedData = RegisterSchema.safeParse(data)

  if (!validatedData.success) {
    return { error: "Invalid fields" }
  }

  const { email, password, name } = validatedData.data
  const hashedPassword = await hashPassword(password)

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: "User already exists" }
  }

  await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword,
      name: name,
    },
  })

  const verificationToken = await genereateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: "Email de confirmação enviado!" }
}

export const verifyEmail = async(token: string) => {
  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) {
    return { error: "Token does not exist" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()
  if (hasExpired) {
    return { error: "Token has expired" }
  }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) {
    return { error: "Email does not exist" }
  }

  await prisma.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  })

  await prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  return { success: "Email confirmed" }
}

export async function createCompany (data: z.infer<typeof companySchema>) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const validatedData = companySchema.parse(data)

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          name: validatedData.name,
          location: validatedData.location,
          about: validatedData.about,
          logo: validatedData.logo,
          website: validatedData.website,
          xAccount: validatedData.xAccount,
        }
      }
    },
  })

  return redirect("/")
}

export async function createJobSeeker(data: z.infer<typeof jobSeekerSchema>) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const validatedData = jobSeekerSchema.parse(data)

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "JOB_SEEKER",
      JobSeeker: {
        create: {
          name: validatedData.name,
          bio: validatedData.bio,
          resume: validatedData.resume
        },
      },
    },
  })

  return redirect("/")
}

export async function createJob (data: z.infer<typeof jobSchema>) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const validatedData = jobSchema.parse(data)

  const company = await prisma.company.findUnique({
    where: {
      userId: session.id,
    },
    select: {
      id: true,
      user: {
        select:{
          stripeCustomerId: true
        }
      }
    },
  })

  if (!company?.id) {
    return redirect("/")
  }

  let stripeCustomerId = company.user.stripeCustomerId

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.email as string,
      name: session.name as string,
    })

    stripeCustomerId = customer.id

    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        stripeCustomerId: stripeCustomerId,
      }
    })
  }

  const jobPost = await prisma.jobPost.create({
    data: {
      companyId: company.id,
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
    select: {
      id: true,
    },
  })

  const pricingTier = jobListingDurationPricing.find(
    (tier) => tier.days === validatedData.listingDuration
  )

  if (!pricingTier) {
    throw new Error("Invalid listing duration")
  }

  await inngest.send({
    name: "job/created",
    data: {
      jobId: jobPost.id,
      expirationDays: validatedData.listingDuration,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: [{
      price_data: {
        product_data: {
          name: `Postagem de Vagas - ${pricingTier.days} Dias`,
          description: pricingTier.description,
          images: [
            "https://via.placeholder.com/150",
          ],
        },
        currency: "BRL",
        unit_amount: pricingTier.price * 100,
      },
      quantity: 1,
    }],
    metadata: {
      jobId: jobPost.id,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
  })

  return redirect(stripeSession.url as string)
}

export async function updateJobPost(data: z.infer<typeof jobSchema>, jobId: string) {
  const session = await requireUser()

  const validatedData = jobSchema.parse(data)

  await prisma.jobPost.update({
    where: {
      id: jobId,
      company: {
        userId: session.id,
      },
    },
    data: {
      jobDescription: validatedData.jobDescription,
      jobTitle: validatedData.jobTitle,
      employmentType: validatedData.employmentType,
      location: validatedData.location,
      salaryFrom: validatedData.salaryFrom,
      salaryTo: validatedData.salaryTo,
      listingDuration: validatedData.listingDuration,
      benefits: validatedData.benefits,
    },
  })

  return redirect("/my-jobs")
}

export async function deleteJobPost(jobId: string) {
  const session = await requireUser()

  await prisma.jobPost.delete({
    where: {
      id: jobId,
      company: {
        userId: session.id,
      },
    },
  })

  return redirect("/my-jobs")
}

export async function saveJobPost(jobId: string) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  await prisma.savedJobPost.create({
    data: {
      jobId: jobId,
      userId: session.id as string,
    },
  })

  revalidatePath(`/job/${jobId}`)
}

export async function unsaveJobPost(savedJobPostId: string) {
  const session = await requireUser()

  const req = await request()
  const decision = await aj.protect(req)
  if (decision.isDenied()) {
    throw new Error("Forbidden")
  }

  const data = await prisma.savedJobPost.delete({
    where: {
      id: savedJobPostId,
      userId: session.id as string,
    },
    select: {
      jobId: true,
    },
  })

  revalidatePath(`/job/${data.jobId}`)
}
