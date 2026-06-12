import { Resend } from "resend";

export async function enviarContratoPorEmail(opts: {
  contratante: string;
  pdf: Buffer;
}): Promise<{ ok: true } | { ok: false; erro: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const para = process.env.ADMIN_EMAIL;
  const de = process.env.EMAIL_FROM;

  if (!apiKey || !para || !de) {
    return {
      ok: false,
      erro: "E-mail não configurado (RESEND_API_KEY / ADMIN_EMAIL / EMAIL_FROM).",
    };
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `CRM Contratos <${de}>`,
    to: [para],
    subject: `Contrato de Monitoramento — ${opts.contratante}`,
    text: `Segue em anexo o contrato de prestação de serviços de monitoramento gerado para ${opts.contratante}.`,
    attachments: [
      {
        filename: `CONTRATO MONITORAMENTO - ${opts.contratante}.pdf`,
        content: opts.pdf,
      },
    ],
  });

  if (error) return { ok: false, erro: error.message };
  return { ok: true };
}
