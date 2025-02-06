import { v4 } from "uuid"

import { getVerificationTokenByEmail } from "@/data/verification-token"
import { prisma } from "@/app/utils/database"

export const genereateVerificationToken = async (email: string) => {
  const token = v4()
  const hourInMs = 3_600_000
  const expires = new Date(new Date().getTime() + hourInMs)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}
