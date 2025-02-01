"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FormControl } from "../ui/form"
import { ControllerRenderProps } from "react-hook-form"
import { jobListingDurationPricing } from "@/app/utils/pricingTiers"
import formatCurrency from "@/app/utils/formatCurrency"

interface JobListingDurationSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: ControllerRenderProps<any, "listingDuration">;
}

export default function JobListingDurationSelector({
  field,
}: JobListingDurationSelectorProps) {
  return (
    <FormControl>
      <RadioGroup value={field.value?.toString()}
        onValueChange={(value) => field.onChange(parseInt(value))}
      >
        <div className="grid gap-4">
          {
            jobListingDurationPricing.map((duration) => (
              <div key={duration.days} className="relative">
                <RadioGroupItem value={duration.days.toString()}
                  id={duration.days.toString()}
                  className="peer sr-only"
                />
                <Label htmlFor={duration.days.toString()}
                  className="flex flex-col cursor-pointer"
                >
                  <Card className={`p-4 border-2 transition-all ${
                      field.value === duration.days
                        ? "border-primary bg-primary/10"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">
                          {duration.days} Dias
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {duration.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl">
                          {formatCurrency(duration.price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency((duration.price / duration.days), 2)}/dia
                        </p>
                      </div>
                    </div>
                  </Card>
                </Label>
              </div>
            ))
          }
        </div>
      </RadioGroup>
    </FormControl>
  )
}
