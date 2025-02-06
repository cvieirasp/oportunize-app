import { UserType } from "@prisma/client"
import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
  userType: UserType
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser
  }
}

import { type DefaultJWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userType: UserType?
  }
}
