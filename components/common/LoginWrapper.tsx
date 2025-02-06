"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Social } from "@/components/common/Social"
import { BackButton } from "@/components/common/BackButton"

interface LoginWrapperProps {
  children: React.ReactNode
  title: string
  description?: string
  backButtonLabel: string
  backButtonHref: string
  showSocialLogin?: boolean
}

export default function LoginWrapper({ children, title, description, backButtonLabel, backButtonHref, showSocialLogin }: LoginWrapperProps) {
  return (
    <div className="flex flex-col gap-6 min-w-[400px]">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {children}
        </CardContent>
        {
          showSocialLogin && (
            <CardFooter>
              <Social />
            </CardFooter>
          )
        }
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      </Card>
    </div>
  )
}
