import { redirect } from "next/navigation"

import { prisma } from "@/app/utils/database"
import { requireUser } from "@/app/utils/hooks"
import OnboardingForm from "./_components/OnboardingForm"

async function checkIfUserHasFinishedOnboarding(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      onboardingCompleted: true,
    },
  })

  if (user?.onboardingCompleted === true) {
    return redirect("/")
  }
}

export default async function OnboardingPage() {
  const session = await requireUser()
  await checkIfUserHasFinishedOnboarding(session.id as string)

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center py-10">
      <OnboardingForm />
    </div>
  )
}
