"use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, XIcon } from "lucide-react"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createComapny } from "@/app/actions"
import { UploadDropzone } from "@/components/common/UploadThingFile"
import { companySchema } from "@/app/utils/zodSchemas"
import { countryList } from "@/app/utils/countriesList"
import { Button } from "@/components/ui/button"

export default function CompanyForm() {
  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      location: "",
      about: "",
      logo: "",
      website: "",
      xAccount: "",
    },
  })

  const [pending, setPending] = useState(false)

  async function handleSubmit(data: z.infer<typeof companySchema>) {
    try {
      setPending(true)
      await createComapny(data)
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
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Nome da empresa..." { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Localização da Empresa</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a localização" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Global</SelectLabel>
                      <SelectItem value="worldwide">
                        <span>🌐</span> <span>Global / Remoto</span>
                      </SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                    <SelectLabel>Localização</SelectLabel>
                    {
                      countryList.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <span>{country.flagEmoji}</span>
                          <span className="pl-2">{country.name}</span>
                        </SelectItem>
                      ))
                    }
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />  
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site da Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="https://minhaempresa.com.br" { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conta do X</FormLabel>
                <FormControl>
                  <Input placeholder="@yourcompany" { ...field } />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre a Empresa</FormLabel>
              <FormControl>
                <Textarea placeholder="Conte-nos sobre a sua empresa..." { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control}
          name="logo"
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

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : "Continuar" }
        </Button>
      </form>
    </Form>
  )
}
