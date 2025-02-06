import "server-only"
import { redirect } from "next/navigation"
import { auth } from "@/app/utils/auth"

export async function requireUser() {
  const session = await auth()

  console.log("session", session)

  if (!session?.user) {
    redirect("/login")
  }

  return session.user
}
