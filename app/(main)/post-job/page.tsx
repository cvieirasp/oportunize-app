import { redirect } from "next/navigation"
import Image from "next/image"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateJobForm } from "./_components/CreateJobForm"
import { prisma } from "@/app/utils/database"
import { requireUser } from "@/app/utils/hooks"

const companies = [
  {
    id: 1,
    name: "Google",
    image: "https://cdn.worldvectorlogo.com/logos/google-g-2015.svg",
  },
  {
    id: 2,
    name: "Facebook",
    image: "https://cdn.worldvectorlogo.com/logos/facebook-3-2.svg",
  },
  {
    id: 3,
    name: "Amazon",
    image: "https://cdn.worldvectorlogo.com/logos/logo-amazon.svg",
  },
  {
    id: 4,
    name: "Microsoft",
    image: "https://cdn.worldvectorlogo.com/logos/microsoft-5.svg",
  },
  {
    id: 5,
    name: "Apple",
    image: "https://cdn.worldvectorlogo.com/logos/apple1.svg",
  },
  {
    id: 6,
    name: "Netflix",
    image: "https://cdn.worldvectorlogo.com/logos/netflix-3.svg",
  },
  {
    id: 7,
    name: "Spotify",
    image: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg",
  },
  {
    id: 8,
    name: "Uber",
    image: "https://cdn.worldvectorlogo.com/logos/uber-2.svg",
  },
  {
    id: 9,
    name: "Airbnb",
    image: "https://cdn.worldvectorlogo.com/logos/airbnb-1.svg",
  },
]

const testimonials = [
  {
    quote: "Encontramos nosso candidato ideal em 48 horas após a publicação. A qualidade dos candidatos foi excepcional!",
    author: "Sarah Chen",
    company: "TechCorp",
  },
  {
    quote: "A plataforma tornou a contratação de talentos remotos incrivelmente simples. Altamente recomendada!",
    author: "Mark Johnson",
    company: "StartupX",
  },
  {
    quote: "Sempre encontramos candidatos de alta qualidade aqui. É nossa plataforma de referência para todas as nossas necessidades de contratação.",
    author: "Emily Rodriguez",
    company: "InnovateNow",
  },
]

const stats = [
  { value: "10k+", label: "Monthly active job seekers" },
  { value: "48h", label: "Average time to hire" },
  { value: "95%", label: "Employer satisfaction rate" },
  { value: "500+", label: "Companies hiring monthly" },
]

async function getCompany(userId: string) {
  const data = await prisma.company.findUnique({
    where: {
      userId,
    },
    select: {
      name: true,
      location: true,
      about: true,
      logo: true,
      xAccount: true,
      website: true,
    },
  })

  if (!data) {
    return redirect("/")
  }

  return data
}

export default async function PostJobPage() {
  const session = await requireUser()
  const { name, about, location, logo, website, xAccount } = await getCompany(session.id as string)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-5">
      <CreateJobForm companyName={name}
        companyAbout={about}
        companyLocation={location}
        companyLogo={logo}
        companyWebsite={website}
        companyXAccount={xAccount}
      />

      <div className="col-span-1">
        <Card className="lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-xl">
              Confiável por Líderes da Indústria
            </CardTitle>
            <CardDescription>
              Junte-se a milhares de empresas que contratam os melhores talentos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {
                companies.map((company) => (
                  <div key={company.id} className="flex items-center justify-center dark:bg-primary-foreground rounded-lg p-2">
                    <Image src={company.image} alt={company.name} width={80} height={80} className="opacity-75 transition-opacity hover:opacity-100" />
                  </div>
                ))
              }
            </div>

            {/* Depoimentos */}
            <div className="space-y-4">
              {
                testimonials.map((testimonial, index) => (
                  <blockquote key={index} className="border-l-2 border-primary pl-4">
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <footer className="mt-2 text-sm font-medium">
                      - {testimonial.author}, {testimonial.company}
                    </footer>
                  </blockquote>
                ))
              }
            </div>

             {/* Estatísticas */}
             <div className="grid grid-cols-2 gap-4">
              {
                stats.map((stat, index) => (
                  <div key={index} className="rounded-lg bg-muted p-4">
                    <div className="text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
