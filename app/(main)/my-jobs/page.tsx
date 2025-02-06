import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, PenBoxIcon, Trash, User2 } from "lucide-react"
import { FaChartBar, FaChartPie } from "react-icons/fa"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/common/EmptyState"
import { prisma } from "@/app/utils/database"
import { requireUser } from "@/app/utils/hooks"
import CopyLinkMenuItem from "@/components/common/CopyLink"
import DeleteJobDialog from "./_components/DeleteJobDialog"
import { ChartBar, ChartPie } from "./_components/Charts"

async function getJobs(userId: string) {
  const [data, jobsByStatus] = await Promise.all([
    await prisma.jobPost.findMany({
      where: {
        company: {
          userId: userId,
        },
      },
      select: {
        id: true,
        jobTitle: true,
        status: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    await prisma.jobPost.groupBy({
      by: ["status"],
      _count:{
        status: true,     
      },
      where: {
        company: {
          userId: userId,
        },
      },
      orderBy: {
        status: "desc",
      },
    }),
  ])

  return {
    data,
    metrics: {
      jobsByStatus,
    }
  }
}

export default async function MyJobsPage () {
  const session = await requireUser()
  const { data, metrics } = await getJobs(session.id as string)

  const jobsByStatus = metrics.jobsByStatus.map((status) => ({
    name: status.status,
    value: status._count.status,
  }))

  const jobsByMonthRecord = data.reduce((acc: Record<string, number>, job) => {
    const month = job.createdAt.toLocaleString("pt-BR", { month: "long" })
    acc[month] = acc[month] ? acc[month] + 1 : 1
    return acc
  }, {})

  const jobsByMonth = Object.entries(jobsByMonthRecord).map(([key, value]) => ({
    name: key,
    value: value
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        { 
          jobsByMonth.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Vagas 2025</CardTitle>
                <CardDescription>
                  Vagas postadas por mês.
                </CardDescription>
              </CardHeader>
              <CardContent>
              <ChartBar data={jobsByMonth} />
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="Nenhuma vaga anunciada"
              description="Você ainda não tem nenhuma vaga anunciada esse ano."
              Icon={FaChartBar}
            />
          )
        }

        {
          jobsByStatus.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Vagas 2025</CardTitle>
                <CardDescription>
                  Vagas postadas por Status.
                </CardDescription>
              </CardHeader>
              <CardContent>
              <ChartPie data={jobsByStatus} />
              </CardContent>
            </Card>
          ) : (
            <EmptyState title="Nenhuma vaga anunciada"
              description="Você ainda não tem nenhuma vaga anunciada esse ano."
              Icon={FaChartPie}
            />
          )
        }
      </div>

      {
        data.length === 0 ? (
          <EmptyState
            title="Nenhuma vaga anunciada"
            description="Você ainda não tem vaga anunciada."
            buttonText="Postar Vaga"
            href="/post-job"
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Minhas Vagas</CardTitle>
              <CardDescription>
                Gerencie suas listagens de vagas e candidaturas aqui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Logo</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Título da Vaga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Candidatos</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    data.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          {
                            listing.company.logo ? (
                              <Image src={listing.company.logo}
                                alt={`Logo da empresa ${listing.company.name}`}
                                width={40}
                                height={40}
                                className="rounded-md size-10"
                              />
                            ) : (
                              <div className="bg-red-500 size-10 rounded-lg flex items-center justify-center">
                                <User2 className="size-6 text-white" />
                              </div>
                            )
                          }
                        </TableCell>
                        <TableCell className="font-medium">
                          {listing.company.name}
                        </TableCell>
                        <TableCell>
                          {listing.jobTitle}
                        </TableCell>
                        <TableCell>
                          { listing.status.charAt(0).toUpperCase() + listing.status.slice(1).toLowerCase() }
                        </TableCell>
                        <TableCell>5</TableCell>
                        <TableCell>
                          {
                            listing.createdAt.toLocaleDateString("pt-BR", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem asChild>
                                  <Link href={`/my-jobs/${listing.id}/edit`}>
                                    <PenBoxIcon className="size-4" />
                                    Editar Vaga
                                  </Link>
                                </DropdownMenuItem>
                                <CopyLinkMenuItem jobUrl={`${process.env.NEXT_PUBLIC_URL}/job/${listing.id}`} />
                                <DropdownMenuSeparator />
                                <DialogTrigger asChild>
                                  <DropdownMenuItem>
                                    <Trash className="size-4" />
                                    Remover Vaga
                                  </DropdownMenuItem>
                                </DialogTrigger>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteJobDialog jobId={listing.id} />
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      }
    </div>
  )
};
