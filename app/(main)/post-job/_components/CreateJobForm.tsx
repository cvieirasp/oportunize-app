"use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, XIcon } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { jobSchema } from "@/app/utils/zodSchemas"
import { countryList } from "@/app/utils/countriesList"
import SalaryRangeSelector from "@/components/common/SalaryRangeSelector"
import JobDescriptionEditor from "@/components/common/richTextEditor/JobDescriptionEditor"
import BenefitsSelector from "@/components/common/BenefitsSelector"
import { UploadDropzone } from "@/components/common/UploadThingFile"
import JobListingDurationSelector from "@/components/common/JobListingDurationSelector"
import { createJob } from "@/app/actions"

interface CreateJobFormProps {
  companyName: string;
  companyLocation: string;
  companyAbout: string;
  companyLogo: string;
  companyXAccount: string | null;
  companyWebsite: string;
}

export function CreateJobForm({
  companyAbout,
  companyLocation,
  companyLogo,
  companyXAccount,
  companyName,
  companyWebsite,
}: CreateJobFormProps) {
  const form = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      benefits: [],
      companyDescription: companyAbout,
      companyLocation: companyLocation,
      companyName: companyName,
      companyLogo: companyLogo,
      companyWebsite: companyWebsite,
      companyXAccount: companyXAccount || "",
      employmentType: "",
      jobDescription: "",
      jobTitle: "",
      listingDuration: 30,
      location: "",
      salaryFrom: 0,
      salaryTo: 0,
    },
  })

  const [pending, setPending] = useState(false)

  async function handleSubmit(data: z.infer<typeof jobSchema>) {
    try {
      setPending(true)
      await createJob(data)
    } catch (err) {
      if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
        console.error(err)
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form className="col-span-1 lg:col-span-2 flex flex-col gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações da Vaga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control}
                name="jobTitle" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título da Vaga</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Desenvolvedor Frontend" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField control={form.control}
                name="employmentType" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Vaga</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de vaga" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo de Vaga</SelectLabel>
                          <SelectItem value="full-time">Tempo Integral</SelectItem>
                          <SelectItem value="part-time">Meio Período</SelectItem>
                          <SelectItem value="contract">Contrato</SelectItem>
                          <SelectItem value="internship">Estágio</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a localização" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Salary Range</FormLabel>
                <FormControl>
                  <SalaryRangeSelector
                    control={form.control}
                    minSalary={1000}
                    maxSalary={100000}
                  />
                </FormControl>
                <FormMessage>
                  { form.formState.errors.salaryFrom?.message || form.formState.errors.salaryTo?.message }
                </FormMessage>
              </FormItem>
            </div>

            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Vaga</FormLabel>
                  <FormControl>
                    <JobDescriptionEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefícios</FormLabel>
                  <FormControl>
                    <BenefitsSelector field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
        <CardHeader>
            <CardTitle>Informação da Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a localização" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Global</SelectLabel>
                          <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-2">Global</span>
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Localização</SelectLabel>
                          {countryList.map((country) => (
                            <SelectItem value={country.name} key={country.name}>
                              <span>{country.flagEmoji}</span>
                              <span className="pl-2">{country.name}</span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="companyWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site da Empresa</FormLabel>
                    <FormControl>
                      <div className="flex ">
                        <span className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                          https://
                        </span>
                        <Input {...field} placeholder="minhaempresa.com" className="rounded-l-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyXAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta do X da Empresa</FormLabel>
                    <FormControl>
                      <div className="flex ">
                        <span className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md bg-muted text-muted-foreground text-sm">
                          @
                        </span>
                        <Input {...field} placeholder="minhaempresa" className="rounded-l-none" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="companyDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da Empresa</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descrição da empresa..." className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo da Empresa</FormLabel>
                  <FormControl>
                    {
                      field.value ? (
                        <div className="relative w-fit">
                          <Image src={field.value}
                            alt="Logo da Empresa"
                            width={128}
                            height={128}
                            className="rounded-lg"
                          />
                          <Button type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 rounded-full"
                            onClick={() => field.onChange("")}
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                      <UploadDropzone endpoint="imageUploader"
                        className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground cursor-pointer border-primary"
                        onClientUploadComplete = {(response) => {
                          field.onChange(response[0].url)
                        }}
                        onUploadError={(err) => {
                          console.error(err)
                        }}
                        content={{
                          allowedContent({ ready, isUploading }) {
                            if (!ready) return "Verificando arquivo..."
                            if (isUploading) return "Carregando..."
                            return "Imagem (2MB)"
                          },
                          button({ ready, isUploading, files }) {
                            if (files.length > 0) return "Enviar Imagem"
                            if (ready) return "Carregar Imagem"
                            if (isUploading) return <Loader2 className="size-4 animate-spin" />  
                            return "Aguarde..."
                          },
                          label({ ready, isUploading, files }) {
                            if (ready) {
                              if (files.length > 0) {
                                const objectUrl = URL.createObjectURL(files[0])
                                return (
                                  <div className="flex flex-col items-center">
                                    <span className="text-sm text-muted-foreground">{files[0].name}</span>
                                    <Image src={objectUrl}
                                      alt="Logo da Empresa"
                                      width={128}
                                      height={128}
                                      className="mt-2 object-cover rounded-md"
                                    />
                                    
                                  </div>
                                )
                              }
                              return "Selecione uma imagem ou arraste-a e solte-a aqui"
                            }
                            if (isUploading) return "Aguarde enquanto a imagem é carregada..."  
                            return "Aguarde..."
                          },
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Duração da Listagem da Vaga</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="listingDuration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <JobListingDurationSelector field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Registrar Vaga" }
        </Button>
      </form>
    </Form>
  )
}
