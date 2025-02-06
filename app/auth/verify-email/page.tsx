import { Suspense } from "react"
import { VerifyEmailForm } from "./_components/verify-email-form"

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  )
}

export default VerifyEmailPage
