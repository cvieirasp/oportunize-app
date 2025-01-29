import { Building2, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserType } from "@/app/types/UserType"

interface UserTypeFormProps {
  onSelect: (type: UserType) => void
}

export default function UserTypeForm({ onSelect }: UserTypeFormProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Bem-vindo! Vamos começar...</h2>
        <p className="text-muted-foreground">Selecione como você gostaria de utilizar nossa plataforma!</p>
      </div>

      <div className="grid gap-4">
        <Button variant="outline" 
          className="w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
          onClick={() => onSelect("company")}
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="size-6 text-primary" />
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-lg">
              Empresa / Organização
            </h3>
            <p>Publique vagas e encontre talentos excepcionais.</p>
          </div>
        </Button>

        <Button variant="outline"
          className="w-full h-auto p-6 items-center gap-4 border-2 transition-all duration-200 hover:border-primary hover:bg-primary/5"
          onClick={() => onSelect("jobSeeker")}
        >
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserRound className="size-6 text-primary" />
          </div>

          <div className="text-left">
            <h3 className="font-semibold text-lg">
              Candidato a Emprego
            </h3>
            <p>Encontre a oportunidade de trabalho dos seus sonhos.</p>
          </div>
        </Button>
      </div>
    </div>
  )
}
