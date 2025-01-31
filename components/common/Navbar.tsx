import Link from "next/link"
import Image from "next/image"

import { auth } from "@/app/utils/auth"
import { buttonVariants } from "@/components/ui/button"
import UserDropdown from "@/components/common/UserDropdown"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import Logo from "@/public/logo.png"

export async function Navbar() {
  const session = await auth()

  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/">
        <Image src={Logo} alt="Oportunize" width={200} height={100} />
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
          Anunciar Vaga
        </Link>
        {
          session?.user ? (
            <UserDropdown email={session.user.email as string} name={session.user.name as string} image={session.user.image as string} />
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
