"use client"

import { toast } from "sonner"
import { Link2 } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface CopyLinkMenuItemProps {
  jobUrl: string;
}

export default function CopyLinkMenuItem({ jobUrl }: CopyLinkMenuItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl)
      toast.success("URL copiada para a área de transferência")
    } catch (err) {
      console.error("Não foi possível copiar o texto: ", err)
      toast.error("Falha ao copiar a URL")
    }
  }

  return (
    <DropdownMenuItem onSelect={handleCopy}>
      <Link2 className=" h-4 w-4" />
      <span>Copiar URL da Vaga</span>
    </DropdownMenuItem>
  )
}
