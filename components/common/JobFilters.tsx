"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { X, XIcon } from "lucide-react"

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
  const jobTypes = ["full-time", "part-time", "contract", "internship"]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-semibold">
          Filtros
        </CardTitle>
        <Button variant="destructive" size="sm" className="h-8">
          <XIcon className="size-4" />
          <span>Limpar filtros</span>
        </Button>
      </CardHeader>

      <Separator className="mb-4" />

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Tipo de vaga</Label>
          <div className="grid grid-cols-2 gap-4">
            {
              jobTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={type} />
                  <Label className="text-sm font-medium" htmlFor={type}>
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
          <Select>
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
      </CardContent>
    </Card>
  )
}
