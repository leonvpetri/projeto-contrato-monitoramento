import nodemailer from "nodemailer";

// UOL Host: smtps.uhserver.com:465 (SSL), autenticação com a caixa completa.

export async function enviarContratoPorEmail(opts: {
  contratante: string;
  pdf: Buffer;
}): Promise<{ ok: true } | { ok: false; erro: string }> {
  const host = process.env.SMTP_HOST;
  const porta = Number(process.env.SMTP_PORT || 465);
  const usuario = process.env.SMTP_USER;
  const senha = process.env.SMTP_PASS;
  const de = process.env.EMAIL_FROM || usuario;
  const para = process.env.ADMIN_EMAIL;

  if (!host || !usuario || !senha || !para) {
    return {
      ok: false,
      erro: "E-mail não configurado (SMTP_HOST / SMTP_USER / SMTP_PASS / ADMIN_EMAIL).",
    };
  }

  // Antivírus locais (ex.: Avast Mail Shield) interceptam o TLS do SMTP com
  // certificado próprio. SMTP_TLS_INSECURE=1 relaxa a validação SOMENTE fora
  // da Vercel (em produção a flag é ignorada e o certificado é sempre validado).
  const tlsInseguroLocal =
    process.env.SMTP_TLS_INSECURE === "1" && !process.env.VERCEL;

  const transporter = nodemailer.createTransport({
    host,
    port: porta,
    secure: porta === 465, // 465 = SSL; 587 = STARTTLS
    auth: { user: usuario, pass: senha },
    tls: tlsInseguroLocal ? { rejectUnauthorized: false } : undefined,
  });

  try {
    await transporter.sendMail({
      from: `CRM Contratos <${de}>`,
      to: para,
      subject: `Contrato de Monitoramento — ${opts.contratante}`,
      text: `Segue em anexo o contrato de prestação de serviços de monitoramento gerado para ${opts.contratante}.`,
      attachments: [
        {
          filename: `CONTRATO MONITORAMENTO - ${opts.contratante}.pdf`,
          content: opts.pdf,
          contentType: "application/pdf",
        },
      ],
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : String(e) };
  }
}
