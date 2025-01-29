import Link from "next/link"
import Image from "next/image"

import { auth, signOut } from "@/app/utils/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import Logo from "@/public/logo.png"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/">
        <Image src={Logo} alt="Oportunize" width={200} height={100} />
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {
          session?.user ? (
            <form action={async () => {
              "use server"

              await signOut({
                redirectTo: "/"
              })
            }}>
              <Button>Sair</Button>
            </form>
          ) : (
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Login
            </Link>
          )
        }
      </div>
    </nav>
  )
}
