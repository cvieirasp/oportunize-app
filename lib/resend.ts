import { Resend } from "resend"

export const sendVerificationEmail = async (email: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY as string)
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`

  await resend.emails.send({
    from: "Oportunize <onboarding@resend.dev>",
    to: email,
    subject: "Confirme seu e-mail",
    html: `<p>Clique <a href="${confirmLink}">aqui</a> para confirmar seu e-mail.</p>`,
  })
}
