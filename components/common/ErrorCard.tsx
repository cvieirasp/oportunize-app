import { FaExclamationTriangle } from "react-icons/fa"

import LoginWrapper from "@/components/common/LoginWrapper"

export const ErrorCard = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <LoginWrapper title="Erro na Autenticação"
        description="Ocorreu um erro ao tentar fazer login."
        backButtonLabel="Voltar para Login"
        backButtonHref="/login"
      >
        <div className="w-full flex justify-center items-center">
          <FaExclamationTriangle className="text-destructive" />
        </div>
      </LoginWrapper>
    </div>
  )
}
