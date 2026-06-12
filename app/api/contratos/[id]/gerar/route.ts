import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { renderContratoHtml, type ContratoDados } from "@/lib/contrato/template";
import { htmlParaPdf } from "@/lib/contrato/pdf";
import { enviarContratoPorEmail } from "@/lib/email";

export const maxDuration = 60; // Puppeteer pode demorar no cold start

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const { data: c, error } = await supabase
    .from("contratos")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !c) {
    return NextResponse.json({ erro: "Contrato não encontrado" }, { status: 404 });
  }

  const dados: ContratoDados = {
    contratante: c.contratante,
    cidade: c.cidade,
    endereco: c.endereco,
    numero: c.numero,
    bairro: c.bairro,
    cep: c.cep,
    fone: c.fone,
    email: c.email,
    cnpj: c.cnpj,
    cpf: c.cpf,
    contatos: c.contatos ?? [],
    enderecoServico: c.endereco_servico,
    numeroServico: c.numero_servico,
    bairroServico: c.bairro_servico,
    cepServico: c.cep_servico,
    cidadeServico: c.cidade_servico,
    dataInicio: c.data_inicio,
    valorContrato: Number(c.valor_contrato),
    valorChip: Number(c.valor_chip),
    diaVencimento: c.dia_vencimento,
    dataAssinatura: c.data_assinatura,
  };

  let pdf: Buffer;
  try {
    pdf = await htmlParaPdf(renderContratoHtml(dados));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await supabase
      .from("contratos")
      .update({ status_envio: "erro", erro_envio: `Falha ao gerar PDF: ${msg}` })
      .eq("id", id);
    return NextResponse.json({ erro: `Falha ao gerar PDF: ${msg}` }, { status: 500 });
  }

  const pdfPath = `${id}/CONTRATO MONITORAMENTO - ${c.contratante.replaceAll("/", "-")}.pdf`;
  const { error: upError } = await supabase.storage
    .from("contratos-pdf")
    .upload(pdfPath, pdf, { contentType: "application/pdf", upsert: true });
  if (upError) {
    await supabase
      .from("contratos")
      .update({ status_envio: "erro", erro_envio: `Falha ao salvar PDF: ${upError.message}` })
      .eq("id", id);
    return NextResponse.json(
      { erro: `Falha ao salvar PDF: ${upError.message}` },
      { status: 500 }
    );
  }

  const envio = await enviarContratoPorEmail({ contratante: c.contratante, pdf });

  await supabase
    .from("contratos")
    .update({
      pdf_path: pdfPath,
      status_envio: envio.ok ? "enviado" : "gerado",
      erro_envio: envio.ok ? null : envio.erro,
    })
    .eq("id", id);

  return NextResponse.json({
    ok: true,
    pdf: pdfPath,
    email: envio.ok ? "enviado" : `não enviado: ${envio.erro}`,
  });
}
