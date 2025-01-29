import { z } from "zod"

export const companySchema = z.object({
  name: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  location: z.string().min(2, "Localização da empresa deve ser selecionada"),
  about: z.string().min(10, "Informações sobre a empresa deve ter no mínimo 10 caracteres"),
  logo: z.string().nonempty("Logo da empresa é obrigatório"),
  website: z.string().url("Website da empresa deve ser uma URL válida"),
  xAccount: z.string().optional(),
})

export const jobSeekerSchema = z.object({
  name: z.string().min(2, "Nome do candidato deve ter no mínimo 2 caracteres"),
  location: z.string().min(2, "Localização do candidato deve ser selecionada"),
  bio: z.string().min(10, "Informações sobre o candidato deve ter no mínimo 10 caracteres"),
  resume: z.string().nonempty("Currículo do candidato é obrigatório"),
})
