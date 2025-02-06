"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { countryList } from "@/app/utils/countriesList"

export function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const jobTypes = ["full-time", "part-time", "contract", "internship"]

  // Get current filters from URL
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || []
  const currentLocation = searchParams.get("location") || ""
  const currentMinSalary = searchParams.get("minSalary") || ""
  const currentMaxSalary = searchParams.get("maxSalary") || ""

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }

      return params.toString()
    },
    [searchParams]
  )

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const current = new Set(currentJobTypes)
    if (checked) {
      current.add(type)
    } else {
      current.delete(type)
    }

    const newValue = Array.from(current).join(",")
    router.push(`?${createQueryString("jobTypes", newValue)}`)
  }

  const handleLocationChange = (location: string) => {
    router.push(`?${createQueryString("location", location)}`)
  }

  const handleMinSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`?${createQueryString("minSalary", e.target.value)}`)
  }

  const handleMaxSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`?${createQueryString("maxSalary", e.target.value)}`)
  }

  const clearFilters = () => {
    router.push("/")
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-semibold">Filtros</CardTitle>
          <Button variant="destructive"
            size="sm"
            className="h-8"
            onClick={clearFilters}
          >
            <span className="mr-2">Limpar Filtros</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <Separator className="mb-4" />

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Tipo de vaga</Label>
          <div className="grid grid-cols-2 gap-4">
            {
              jobTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={type.toLowerCase()}
                    checked={currentJobTypes.includes(type)}
                    onCheckedChange={(checked) =>
                      handleJobTypeChange(type, checked as boolean)
                    }
                  />
                  <Label className="text-sm font-medium" htmlFor={type.toLowerCase()}>
                    {type}
                  </Label>
                </div>
              ))
            }
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Localização</Label>
          <Select value={currentLocation} onValueChange={handleLocationChange}>
            <SelectTrigger>
              <SelectValue>Selecione uma Localização</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Global</SelectLabel>
                <SelectItem value="worldwide">
                  <span>🌐</span>
                  <span className="pl-2">Global / Remoto</span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Localização</SelectLabel>
                {countryList.map((country) => (
                  <SelectItem value={country.name} key={country.code}>
                    <span>{country.flagEmoji}</span>
                    <span className="pl-2">{country.name}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-4">
          <Label className="text-lg font-semibold">Salário</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary" className="text-sm">
                Mínimo
              </Label>
              <Input id="minSalary"
                type="number"
                placeholder="0"
                value={currentMinSalary}
                onChange={handleMinSalaryChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary" className="text-sm">
                Máximo
              </Label>
              <Input id="maxSalary"
                type="number"
                placeholder="500,000"
                value={currentMaxSalary}
                onChange={handleMaxSalaryChange}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
