"use client"

import { useState } from "react"
import Image from "next/image"

import Logo from "@/public/logo.png"
import UserTypeForm from "./UserTypeForm"
import { UserType } from "@/app/types/UserType"
import { Card, CardContent } from "@/components/ui/card"
import CompanyForm from "./CompanyForm"

export default function OnboardingForm() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserType>(null)

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type)
    setStep(2)
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return <UserTypeForm onSelect={handleUserTypeSelection} />
      case 2:
        return userType === "company" ? <CompanyForm /> : <p>Job seeker form</p>
      default:
        return null
    }
  }

  return(
    <>
      <div className="flex items-center mb-10">
        <Image src={Logo} alt="Logo" width={200} height={100} />
      </div>

      <Card className="max-w-xl w-full">
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </>
  )
}
