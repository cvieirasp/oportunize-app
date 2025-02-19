"use client"

import { useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginSchema } from "@/app/utils/zodSchemas"
import LoginWrapper from "@/components/common/LoginWrapper"
import { login } from "@/app/actions"

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const searchParams = useSearchParams()
  if (searchParams.get("error") === "OAuthAccountNotLinked") {
    toast.error("Seu email já está vinculado a outro provedor.")
  }

  const [isPendig, startTransition] = useTransition()

  const handleSubmit = async (data: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(data).then((response) => {
        if (response && response.error) {
          toast.error(response.error)
        }
      })
    })
  }

  return (
    <LoginWrapper title="Bem-vindo de Volta"
      description="Faça login com sua conta GitHub"
      backButtonLabel="Não possui uma conta?"
      backButtonHref="/register"
      showSocialLogin
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="space-y-4">
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
              isPendig ? <Loader2Icon /> : "Login"
            }
          </Button>
        </form>
      </Form>

      {/*
          <div className="text-center text-xs text-muted-foreground text-balance">
            Clicando em continuar, você concorda com nossos <a href="#" className="text-blue-500">Termos de Serviço</a> e <a href="#" className="text-blue-500">Política de Privacidade</a>.
          </div>
      */}
    </LoginWrapper>
  )
}
