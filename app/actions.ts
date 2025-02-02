"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { request } from "@arcjet/next"

import { companySchema, jobSchema, jobSeekerSchema } from "@/app/utils/zodSchemas"
import { requireUser } from "@/app/utils/hooks"
import { prisma } from "@/app/utils/database"
import arcjet, { detectBot, shield } from "@/app/utils/arcjet"
import { stripe } from "@/app/utils/stripe"
import { jobListingDurationPricing } from "./utils/pricingTiers"
import { inngest } from "@/app/utils/innjest"

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