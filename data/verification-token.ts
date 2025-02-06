import { prisma } from "@/app/utils/database"

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
      },
    })

    return verificationToken
  } catch (err) {
    console.error(err)
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    })

    return verificationToken
  } catch (err) {
    console.error(err)
    return null
  }
}
