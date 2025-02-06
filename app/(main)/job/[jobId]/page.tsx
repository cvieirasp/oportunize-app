import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { request } from "@arcjet/next"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { saveJobPost, unsaveJobPost } from "@/app/actions"
import { GeneralSubmitButton, SaveJobButton } from "@/components/common/SubmitButtons"
import { auth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/database"
import { benefits } from "@/app/utils/listOfBenefits"
import { getFlagEmoji } from "@/app/utils/countriesList"
import arcjet, { detectBot, fixedWindow, tokenBucket } from "@/app/utils/arcjet"
import { JsonToHtml } from "@/components/common/JsonToHtml"

const ajMode = process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE"

const aj = arcjet.withRule(
  detectBot({
    mode: ajMode,
    allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
  })
).withRule(
  fixedWindow({
    mode: ajMode,
    max: 10,
    window: "60s",
  })
)

function getClient(session: boolean) {
  if (session) {
    return aj.withRule(
      tokenBucket({
        mode: ajMode,
        capacity: 100,
        interval: 60,
        refillRate: 30,
      })
    )
  }
  return aj.withRule(
    tokenBucket({
      mode: ajMode,
      capacity: 100,
      interval: 60,
      refillRate: 10,
    })
  )
}

async function getJob(jobId: string, userId?: string) {
  const [jobData, savedJob] = await Promise.all([
    prisma.jobPost.findUnique({
      where: {
        id: jobId,
        status: "ACTIVE",
      },
      select: {
        jobTitle: true,
        jobDescription: true,

        location: true,

        employmentType: true,
        benefits: true,

        createdAt: true,
        listingDuration: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
    }),
    userId
      ? prisma.savedJobPost.findUnique({
          where: {
            userId_jobId: {
              userId,
              jobId,
            },
          },
          select: {
            id: true,
          },
        })
      : null,
  ])

  if (!jobData) {
    return notFound()
  }

  return {
    jobData,
    savedJob,
  }
}

type JobPageParams = Promise<{ jobId: string }>;

export default async function JobPage({ params }: { params: JobPageParams }) {
  const { jobId } = await params

  const session = await auth()
  
  const req = await request()
  const decision = await getClient(!!session)
    .protect(req, { requested: 10 })

  if (decision.isDenied()) {
    throw new Error("forbidden")
  }

  const { jobData, savedJob } = await getJob(jobId, session?.user?.id)
  const locationFlag = getFlagEmoji(jobData.location)

  return (
    <div className="grid lg:grid-cols-3 gap-8 my-5">
      <div className="space-y-8 col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {jobData.jobTitle}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-medium">
                {jobData.company.name}
              </span>
              <span className="hidden md:inline text-muted-foreground">
                •
              </span>
              <Badge className="rounded-full" variant="secondary">
                {jobData.employmentType}
              </Badge>
              <span className="hidden md:inline text-muted-foreground">
                •
              </span>
              <Badge className="rounded-full">
                {locationFlag && <span className="mr-1">{locationFlag}</span>}
                {jobData.location}  
              </Badge>
            </div>
          </div>

          {
            session?.user ? (
              <form action={
                  savedJob
                    ? unsaveJobPost.bind(null, savedJob.id)
                    : saveJobPost.bind(null, jobId)
                }
              >
                <SaveJobButton savedJob={!!savedJob} />
              </form>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login">
                  <Heart className="size-4 mr-2" />
                  Salvar vaga
                </Link>
              </Button>
            )
          }
        </div>

        <section>
          <JsonToHtml json={JSON.parse(jobData.jobDescription)} />
        </section>

        <section>
          <h3 className="font-semibold mb-4">
            Benefícios{" "}
          </h3>
          <div className="flex flex-wrap gap-3">
            {
              benefits.map((benefit) => {
                const isOffered = jobData.benefits.includes(benefit.id)
                { 
                  return (
                    isOffered && (
                      <Badge key={benefit.id}
                        variant="default"
                        className="text-sm px-4 py-1.5 rounded-full"
                      >
                        <span className="flex items-center gap-2">
                          {benefit.icon}
                          {benefit.label}
                        </span>
                      </Badge>
                    )
                  )
                }
              })
            }
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Apply Now Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Inscreva-se agora</h3>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Por favor, informe à empresa {jobData.company.name} que você encontrou esta vaga na Oportunize.
                Isso nos ajuda a crescer!
              </p>
            </div>
            <form>
              <input type="hidden" name="jobId" value={jobId} />
              <GeneralSubmitButton text="Inscreva-se agora" />
            </form>
          </div>
        </Card>

        {/* Job Details Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Sobre a vaga</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Inscreva-se até
                </span>
                <span className="text-sm">
                  {
                    new Date(
                      jobData.createdAt.getTime() + jobData.listingDuration * 24 * 60 * 60 * 1000)
                        .toLocaleDateString("pt-BR", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Publicado em
                </span>
                <span className="text-sm">
                  {
                    jobData.createdAt.toLocaleDateString("pt-BR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Tipo de vaga
                </span>
                <span className="text-sm">
                  {jobData.employmentType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                Localização
                </span>
                <Badge variant="secondary">
                  {jobData.location}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Company Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image src={
                  jobData.company.logo ??
                  `https://avatar.vercel.sh/${jobData.company.name}`
                }
                alt={jobData.company.name}
                width={48}
                height={48}
                className="rounded-full size-12"
              />
              <div>
                <h3 className="font-semibold">
                  {jobData.company.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {jobData.company.about}
                </p>
              </div>
            </div>
            {/*  <Button variant="outline" className="w-full">
              View company profile
            </Button> */}
          </div>
        </Card>
      </div>
    </div>
  )
}
