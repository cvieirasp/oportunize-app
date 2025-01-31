import Link from "next/link"
import { ChevronDown, Heart, Layers2, LogOut } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/utils/auth"

interface UserDropdownProps {
  email: string
  name: string
  image: string
}

export default function UserDropdown({ email, name, image }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus:ring-transparent focus-visible:ring-transparent">
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Imagem de Perfil" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <ChevronDown size={16} strokeWidth={2} className="ml-2 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {name}
          </span>
          <span className="text-xs text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/favorites">
              <Heart size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Vagas Favoritas</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-jobs">
              <Layers2 size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Minhas Vagas</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={async () => {
            "use server"

            await signOut({
              redirectTo: "/"
            })
          }}>
            <button className="flex w-full items-center gap-2">
              <LogOut size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
