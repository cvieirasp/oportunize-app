"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { companySchema, jobSchema, jobSeekerSchema } from "@/app/utils/zodSchemas"
import { requireUser } from "@/app/utils/hooks"
import { prisma } from "@/app/utils/database"
import arcjet, { detectBot, shield } from "@/app/utils/arcjet"
import { request } from "@arcjet/next"

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
    },
  })

  if (!company?.id) {
    return redirect("/")
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
  })

  return redirect("/")
}