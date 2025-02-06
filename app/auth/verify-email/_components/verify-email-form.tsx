"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BeatLoader } from "react-spinners"
import { toast } from "sonner"

import LoginWrapper from "@/components/common/LoginWrapper"
import { verifyEmail } from "@/app/actions"

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [error, setError] = useState<string | undefined>()

  const handlerSubmit = useCallback(() => {
    if (!token) {
      setError("Token não encontrado.")
      return
    }
    verifyEmail(token).then((data) => {
      if (data && data.error) {
        setError(data.error)
        return
      }
      toast.success("E-mail confirmado com sucesso!")
    }).catch(() => {
      setError("Erro ao confirmar e-mail.")
    })
  }, [token])

  useEffect(() => {
    handlerSubmit()
  }, [handlerSubmit])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <LoginWrapper title="Confirmação do e-mail"
        description={ error ? error : "Seu Email foi confirmado com sucesso!" }
        backButtonLabel="Voltar para o login"
        backButtonHref="/login"
      >
        <div className="flex items-center w-full justify-center">
          {
            !error ? <BeatLoader color="green"/> : null
          }
        </div>
      </LoginWrapper>
    </div>
  )
}
