"use client"

import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

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
