import { prisma } from "@/app/utils/database"
import { stripe } from "@/app/utils/stripe"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("Stripe-Signature")

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err) {
    console.error(err)
    return new Response("Webhook error", { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const customerId = session.customer
    const jobId = session.metadata?.jobId

    if (!jobId) {
      return new Response("No Job ID found", { status: 400 })
    }

    const company = await prisma.user.findUnique({
      where: {
        stripeCustomerId: customerId as string,
      },
      select: {
        Company: {
          select: {
            id: true,
          },
        }
      },
    })

    if (!company) {
      return new Response("No Company found for user", { status: 400 })
    }

    await prisma.jobPost.update({
      where: {
        id: jobId,
        companyId: company?.Company?.id as string,
      },
      data: {
        status: "ACTIVE",
      },
    })
  }

  return new Response("Webhook received", { status: 200 })
}
