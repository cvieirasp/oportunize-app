"use client"

import { signIn } from "next-auth/react"
import { FaGithub } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"


export const Social = () => {
  const handleGitHubSignIn = () => {
    signIn("github", {
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size="lg" variant="outline" className="w-full" onClick={handleGitHubSignIn}>
        GitHub
        <FaGithub className="w-6 h-6" />
      </Button>
    </div>
  )
}