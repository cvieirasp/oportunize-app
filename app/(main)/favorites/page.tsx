import { EmptyState } from "@/components/common/EmptyState"
import { JobCard } from "@/components/common/JobCard"
import { prisma } from "@/app/utils/database"
import { requireUser } from "@/app/utils/hooks"

async function getFavorites(userId: string) {
  const data = await prisma.savedJobPost.findMany({
    where: {
      userId: userId,
    },
    select: {
      job: {
        select: {
          id: true,
          jobTitle: true,
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
      },
    },
  })

  return data
}

export default async function FavoritesPage () {
  const session = await requireUser()
  const favorites = await getFavorites(session.id as string)

  if (favorites.length === 0) {
    return (
      <EmptyState title="Nenhum favorito encontrado"
        description="Você ainda não tem nenhum favorito."
        buttonText="Encontre uma vaga"
        href="/jobs"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 mt-5 gap-4">
      {favorites.map((favorite) => (
        <JobCard job={favorite.job} key={favorite.job.id} />
      ))}
    </div>
  )
};
