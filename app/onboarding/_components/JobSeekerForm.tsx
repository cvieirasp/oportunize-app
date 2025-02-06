"use client"

import { useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createJobSeeker } from "@/app/actions"
import { UploadDropzone } from "@/components/common/UploadThingFile"
import { jobSeekerSchema } from "@/app/utils/zodSchemas"
import PdfImage from "@/public/pdf.png"

export default function JobSeekerForm() {
  const form = useForm<z.infer<typeof jobSeekerSchema>>({
      resolver: zodResolver(jobSeekerSchema),
      defaultValues: {
        name: "",
        bio: "",
        resume: "",
      },
    })

  const [pending, setPending] = useState(false)
  
  async function handleSubmit(data: z.infer<typeof jobSeekerSchema>) {
    try {
      setPending(true)
      await createJobSeeker(data)
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
        <FormField control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo..." { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobre</FormLabel>
              <FormControl>
                <Textarea placeholder="Conte-nos sobre você..." { ...field } />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currículo</FormLabel>
              <FormControl>
                {
                  field.value ? (
                    <div className="relative w-fit">
                      <Image src={PdfImage}
                        alt="Currículo"
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
                  <UploadDropzone endpoint="resumeUploader"
                    className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground cursor-pointer border-primary"
                    onClientUploadComplete = {(response) => {
                      field.onChange(response[0].url)
                      console.log(response)
                    }}
                    onUploadError={(err) => {
                      console.error(err)
                    }}
                    content={{
                      allowedContent({ ready, isUploading }) {
                        if (!ready) return "Verificando arquivo..."
                        if (isUploading) return "Carregando..."
                        return "PDF (2MB)"
                      },
                      button({ ready, isUploading, files }) {
                        if (files.length > 0) return "Enviar PDF"
                        if (ready) return "Carregar PDF"
                        if (isUploading) return <Loader2 className="size-4 animate-spin" />  
                        return "Aguarde..."
                      },
                      label({ ready, isUploading, files }) {
                        if (ready) {
                          if (files.length > 0) {
                            return (
                              <div className="flex flex-col items-center">
                                <span className="text-sm text-muted-foreground">{files[0].name}</span>
                                <Image src={PdfImage}
                                  alt="Currículo"
                                  width={128}
                                  height={128}
                                  className="mt-2 object-cover rounded-md"
                                />
                              </div>
                            )
                          }
                          return "Selecione um PDF ou arraste-o e solte-o aqui"
                        }
                        if (isUploading) return "Aguarde enquanto o arquivo é carregado..."  
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