import { Resend } from "resend"

import { inngest } from "@/app/utils/innjest"
import { prisma } from "@/app/utils/database"
import formatCurrency from "@/app/utils/formatCurrency"

const resend = new Resend(process.env.RESEND_API_KEY!)

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

export const sendPeriodicJobListings = inngest.createFunction(
  { id: "send-job-listings" },
  { event: "jobseeker/created" },
  async ({ event, step }) => {
    const { userId, email } = event.data

    const totalDays = 30
    const intervalDays = 3
    let currentDay = 0

    while(currentDay < totalDays) {
      await step.sleep("wait-for-interval", `${intervalDays}d`)
      currentDay += intervalDays

      const recentJobs = await step.run("fetch-recent-jobs", async () => {
        return await prisma.jobPost.findMany({
          where: {
            status: "ACTIVE",
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10,
          include: {
            company: {
              select: {
                name: true
              }
            }
          }
        })
      })

      if (recentJobs.length > 0) {
        await step.run("send-email", async () => {
          const jobListingsHtml = recentJobs.map((job) => `
            <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
              <h3 style="margin: 0;">${job.jobTitle}</h3>
              <p style="margin: 5px 0;">${job.company.name} • ${job.location}</p>
              <p style="margin: 5px 0;">${formatCurrency(job.salaryFrom, 2)} - ${formatCurrency(job.salaryTo, 2)}</p>
            </div>
          `).join("")

          await resend.emails.send({
            from: "Oportunize <onboarding@resend.dev>",
            to: ["cvieirasp@gmail.com"],
            subject: "Vagas recentes",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Vagas recentes</h2>
                ${jobListingsHtml}
                <div style="margin-top: 30px; text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/"
                    style="background-color: #007bff; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">
                    Ver todas as vagas
                  </a>
                </div>
              </div>
            `
          })
        })
      }
    }

    return { userId, email, message: "Completed 30 days job listing notifications" }
  }
)
