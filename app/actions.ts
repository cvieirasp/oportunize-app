"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { companySchema } from "@/app/utils/zodSchemas"
import { requireUser } from "@/app/utils/hooks"
import { prisma } from "@/app/utils/database"

export async function createComapny (data: z.infer<typeof companySchema>) {
  const session = await requireUser()

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
