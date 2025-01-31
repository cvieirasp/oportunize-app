"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { companySchema, jobSeekerSchema } from "@/app/utils/zodSchemas"
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

  const validateData = companySchema.parse(data)

  await prisma.user.update({
    where: {
      id: session.id,
    },
    data: {
      onboardingCompleted: true,
      userType: "COMPANY",
      Company: {
        create: {
          name: validateData.name,
          location: validateData.location,
          about: validateData.about,
          logo: validateData.logo,
          website: validateData.website,
          xAccount: validateData.xAccount,
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
