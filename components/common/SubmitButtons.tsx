"use client"

import { useFormStatus } from "react-dom"
import { Heart, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface GeneralSubmitButtonProps {
  text: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined
  width?: "w-full" | "w-auto" | undefined
  icon?: React.ReactNode
}

export function GeneralSubmitButton({ text, variant, width, icon }: GeneralSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button className={width} variant={variant} disabled={pending}>
    {
      pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Aguarde...</span>
        </>
      ) : (
        <>
          {icon && <div>{icon}</div>}
          <span>{text}</span>
        </>
      )
    }
    </Button>
  )
}

export function SaveJobButton({ savedJob }: { savedJob: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button variant="outline"
      disabled={pending}
      type="submit"
      className="flex items-center gap-2"
    >
      {
        pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Salvando...</span>
          </>
        ) : (
          <>
            <Heart className={`size-4 transition-colors ${ savedJob ? "fill-current text-red-500" : "" }`} />
            {savedJob ? "Salvo" : "Salvar Vaga"}
          </>
        )
      }
    </Button>
  )
}
