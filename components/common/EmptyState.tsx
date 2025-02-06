import Link from "next/link"
import { Ban, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import React from "react"

interface EmptyStateProps {
  title: string
  description: string
  buttonText?: string
  href?: string
  Icon?: React.ElementType
}

export function EmptyState({ buttonText, description, href, title, Icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        {
          Icon ? <Icon className="size-10 text-primary" /> : <Ban className="size-10 text-primary" />
        }
      </div>
      <h2 className="mt-6 text-xl font-semibold">
        {title}
      </h2>
      <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>

      {
        buttonText && href && (
          <Button asChild>
            <Link href={href}>
              <PlusCircle className="size-4" /> {buttonText}
            </Link>
          </Button>
        )
      }
      
    </div>
  )
}
