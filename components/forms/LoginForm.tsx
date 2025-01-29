import { redirect } from "next/navigation"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { auth, signIn } from "@/app/utils/auth"
import { GeneralSubmitButton } from "@/components/common/SubmitButtons"
import GitHubIcon from "@/components/Icons/GitHubIcon"

export default async function LoginForm() {
  const session = await auth()

  if (session?.user) {
    return redirect("/")
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem-vindo de Volta</CardTitle>
          <CardDescription>
            Faça login com sua conta GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <form action={async () => {
              "use server"

              await signIn("github", {
                redirectTo: "/"
              })
            }}>
              <GeneralSubmitButton text="Login com GitHub" variant="outline" width="w-full" icon={<GitHubIcon />} />
            </form>
            <Link href="/" className={buttonVariants()}>
              Voltar
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground text-balance">
        Clicando em continuar, você concorda com nossos <a href="#" className="text-blue-500">Termos de Serviço</a> e <a href="#" className="text-blue-500">Política de Privacidade</a>.
      </div>
    </div>
  )
}
