import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import Logo from "@/public/logo.png";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/">
        <Image src={Logo} alt="Oportunize" width={200} height={100} />
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button>Login</Button>
      </div>
    </nav>
  );
}
