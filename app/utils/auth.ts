import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { prisma } from "@/app/utils/database"
import authConfig from "@/auth.config"
import { getUserById } from "@/data/user"

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      console.log("linkAccount", user)
      await prisma.user.update({
        where: { 
          id: user.id 
        },
        data: {
          emailVerified: new Date(),
        },
      })
    }
  },
  callbacks: {
    async signIn({ account, user }) {
      // Permite OAuth sem verificação de email
      if (account?.provider !== "credentials") return true

      // Previne autenticação sem verificação do e-mail
      const existingUser = await getUserById(user.id as string)
      if (!existingUser?.emailVerified) return false

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.userType && session.user) {
        session.user.userType = token.userType
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token
      token.userType = existingUser.userType
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
})
