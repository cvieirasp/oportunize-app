import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PaymentSucessPage() {
  return (
    <div className="w-full h-screen flex flex-1 justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="size-12 p-2 rounded-full bg-green-500/30 text-green-500" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl font-semibold">
              Pagamento realizado com sucesso
            </h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight">
              Parabéns, seu pagamento foi realizado com sucesso. Sua vaga postada está ativa.
            </p>

            <Button asChild className="w-full mt-5">
              <Link href="/">Voltar para a página inicial</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}