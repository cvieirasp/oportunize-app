import { JobPostStatus } from "@prisma/client"

import { prisma } from "@/app/utils/database"
import { EmptyState } from "@/components/common/EmptyState"
import { PaginationComponent } from "@/components/common/PaginationComponent"
import { JobCard } from "@/components/common/JobCard"

interface JobListingsProps {
  currentPage: number
  jobTypes: string[]
  location: string
}

async function getJobs(page: number = 1, pageSize: number = 10, jobTypes: string[] = [], location: string = "") {
  const skip = (page - 1) * pageSize

  const where = {
    status: JobPostStatus.ACTIVE,
    ...(jobTypes.length > 0 && {
      employmentType: {
        in: jobTypes,
      },
    }),
    ...(location &&
      location !== "worldwide" && {
        location: location,
      }),
  }

  const [data, totalCount] = await Promise.all([
    prisma.jobPost.findMany({
      skip,
      take: pageSize,
      where,
      select: {
        jobTitle: true,
        id: true,
        salaryFrom: true,
        salaryTo: true,
        employmentType: true,
        location: true,
        createdAt: true,
        company: {
          select: {
            name: true,
            logo: true,
            location: true,
            about: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.jobPost.count({ where }),
  ])

  return {
    jobs: data,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  }
}

export default async function JobListings({ currentPage, jobTypes, location }: JobListingsProps) {
  const { jobs, totalPages, currentPage: page } = await getJobs(currentPage, 7, jobTypes, location)

  return (
    <>
      {
        jobs.length > 0 ? (
          <div className="flex flex-col gap-6">
            {
              jobs.map((job, index) => (
                <JobCard job={job} key={index} />
              ))
            }
          </div>
        ) : (
          <EmptyState
            title="Nenhuma vaga encontrada"
            description="Tente pesquisar por um título de vaga ou localização diferente."
            buttonText="Limpar filtros"
            href="/"
          />
        )
      }

      <div className="flex justify-center mt-6">
        <PaginationComponent totalPages={totalPages} currentPage={page} />
      </div>
    </>
  )
}
