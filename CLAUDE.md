@AGENTS.md

# CRM Contratos — Arte Final

- **Idioma:** sempre responda em Português do Brasil (pt-BR).

## O que é

Sistema web que substituiu a automação n8n (Google Forms → Sheets → Word → PDF → e-mail) dos contratos de monitoramento via GPRS. Fluxo: cadastro do contratante → geração do contrato em PDF → Storage → e-mail ao administrativo. Detalhes em `README.md`.

## Stack e pontos-chave

- **Next.js 16** (App Router, Turbopack). Atenção: `proxy.ts` substitui o antigo `middleware.ts`; route handlers recebem `params` como Promise. Docs em `node_modules/next/dist/docs/`.
- **Supabase**: projeto `crm-contratos-gprs` (`gszcuwwytikokigezlpw`, org artefinal, sa-east-1). Tabela `contratos` (RLS para autenticados), bucket `contratos-pdf`, Auth com usuário `leonvpetri@gmail.com`. Sem página de signup — usuários são criados pelo dashboard.
- **PDF**: `lib/contrato/template.ts` é o template HTML recriado do .docx original (na pasta pai). Puppeteer gera o PDF (`puppeteer` em dev, `@sparticuz/chromium` na Vercel — detecta `process.env.VERCEL`).
- **E-mail**: SMTP da UOL Host via Nodemailer (`smtps.uhserver.com:465`, caixa `suporte@alarmesartefinal.com.br`). MX do domínio: `mx.uhserver.com`. Testado e funcionando em 12/06/2026.
- **Extensos**: valores e dia por extenso são calculados (pacote `extenso`), nunca digitados nem persistidos.

## Ambiente local (esta máquina)

- Prefixe npm/node com `NODE_OPTIONS=--use-system-ca` — a rede intercepta TLS (HTTPS).
- O **Avast Mail Shield** intercepta o TLS do SMTP (porta 465/587). Por isso `.env.local` tem `SMTP_TLS_INSECURE=1`; a flag só tem efeito fora da Vercel (`lib/email.ts`).
- Variáveis de ambiente: ver tabela no `README.md`; `.env.local` não vai para o git.

## Estado / pendências

- Código no GitHub: https://github.com/leonvpetri/projeto-contrato-monitoramento
- **Pendente: deploy na Vercel** — importar o repo e cadastrar as variáveis do `.env.local` (exceto `SMTP_TLS_INSECURE`). Depois do deploy, validar a geração de PDF em produção (Chromium serverless é o ponto sensível).
