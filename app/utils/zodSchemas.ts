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

export const jobSchema = z.object({
  jobTitle: z.string().min(2, "O título da vaga deve ter pelo menos 2 caracteres"),
  employmentType: z.string().min(1, "Por favor, selecione o tipo da vaga"),
  location: z.string().min(1, "Por favor, selecione uma localização"),
  salaryFrom: z.number().min(1, "O salário inicial é obrigatório"),
  salaryTo: z.number().min(1, "O salário final é obrigatório"),
  jobDescription: z.string().min(1, "A descrição da vaga é obrigatória"),
  benefits: z.array(z.string()).min(1, "Por favor, selecione pelo menos um benefício"),
  companyName: z.string().min(1, "O nome da empresa é obrigatório"),
  companyLocation: z.string().min(1, "A localização da empresa é obrigatória"),
  companyLogo: z.string().min(1, "O logotipo da empresa é obrigatório"),
  companyWebsite: z.string().min(1, "O site da empresa é obrigatório"),
  companyXAccount: z.string().optional(),
  companyDescription: z.string().min(1, "A descrição da empresa é obrigatória"),
  listingDuration: z.number().min(1, "A duração da publicação é obrigatória"),
})
