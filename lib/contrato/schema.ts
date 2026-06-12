import { z } from "zod";

export const contatoSchema = z.object({
  nome: z.string().trim(),
  numero: z.string().trim(),
});

export const contratoSchema = z.object({
  contratante: z.string().trim().min(2, "Informe o nome do contratante"),
  cidade: z.string().trim().min(2, "Informe a cidade/UF"),
  endereco: z.string().trim().min(2, "Informe o endereço"),
  numero: z.string().trim().min(1, "Informe o número"),
  bairro: z.string().trim().min(1, "Informe o bairro"),
  cep: z.string().trim().min(8, "CEP incompleto"),
  fone: z.string().trim().min(8, "Fone incompleto"),
  email: z.string().trim().email("E-mail inválido").or(z.literal("")),
  cnpj: z.string().trim(),
  cpf: z.string().trim(),
  contatos: z
    .array(contatoSchema)
    .max(5)
    .transform((cs) => cs.filter((c) => c.nome || c.numero)),
  enderecoServico: z.string().trim().min(2, "Informe o endereço do serviço"),
  numeroServico: z.string().trim().min(1, "Informe o número"),
  bairroServico: z.string().trim().min(1, "Informe o bairro"),
  cepServico: z.string().trim().min(8, "CEP incompleto"),
  cidadeServico: z.string().trim().min(2, "Informe a cidade/UF"),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  valorContrato: z.coerce.number().positive("Informe o valor do contrato"),
  valorChip: z.coerce.number().min(0, "Valor inválido"),
  diaVencimento: z.coerce
    .number()
    .int()
    .min(1, "Dia entre 1 e 31")
    .max(31, "Dia entre 1 e 31"),
  dataAssinatura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
}).refine((d) => d.cnpj || d.cpf, {
  message: "Informe CNPJ ou CPF",
  path: ["cnpj"],
});

export type ContratoFormData = z.infer<typeof contratoSchema>;
