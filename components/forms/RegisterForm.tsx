"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RegisterSchema } from "@/app/utils/zodSchemas"
import LoginWrapper from "@/components/common/LoginWrapper"
import { register } from "@/app/actions"
import { toast } from "sonner"

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const [isPendig, startTransition] = useTransition()

  const handleSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      register(data).then((response) => {
        if (response && response.error) {
          toast.error(response.error)
        }
      })
    })
  }

  return (
    <LoginWrapper title="Criar Conta"
      description="Faça login com sua conta GitHub"
      backButtonLabel="Já possui uma conta?"
      backButtonHref="/login"
      showSocialLogin
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="space-y-4">
          <FormField control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field}
                      disabled={isPendig}
                      placeholder="Digite o nome completo..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field}
                      disabled={isPendig}
                      placeholder="john.doe@mail.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPendig}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  
          </div>
          <Button type="submit" className="w-full" disabled={isPendig}>
            {
              isPendig ? <Loader2Icon /> : "Criar Conta"
            }
          </Button>
        </form>
      </Form>

      {/*
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
                    redirectTo: "/onboarding",
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
      */}
    </LoginWrapper>
  )
}
