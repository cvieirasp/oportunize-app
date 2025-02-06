import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Github from "next-auth/providers/github"

import { verifyPassword } from "@/app/utils/hash"
import { LoginSchema } from "@/app/utils/zodSchemas"
import { getUserByEmail } from "@/data/user"

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials)

        if (validatedData.success) {
          const { email, password } = validatedData.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) {
            return null
          }

          const passwordMatch = await verifyPassword(password, user.password)
          if (passwordMatch) {
            return user
          }
        }

        return null
      }
    })
  ],
} satisfies NextAuthConfig
