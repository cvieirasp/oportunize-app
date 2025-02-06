import Link from "next/link"
import Image from "next/image"

import Logo from "@/public/logo.png"
import RegisterForm from "@/components/forms/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center self-center">
          <Image src={Logo} alt="logo" width={200} height={100} />
        </Link>

        <RegisterForm />
      </div>
    </div>
  )
}