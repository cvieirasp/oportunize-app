import { inngest } from "@/app/utils/innjest"
import { prisma } from "@/app/utils/database"

export const handleJobExpiration = inngest.createFunction(
  { id: "job-expiration" },
  { event: "job/created" },
  async ({ event, step }) => {
    const { jobId, expirationDays } = event.data

    // Aguarda a duração especificada.
    await step.sleep("wait-for-expiration", `${expirationDays}d`)

    // Atualiza o status da vaga para "EXPIRADO".
    await step.run("update-job-status", async () => {
      await prisma.jobPost.update({
        where: { 
          id: jobId
        },
        data: {
          status: "EXPIRED"
        },
      })
    })

    return { jobId, message: "Job marked as expired" }
  }
)
