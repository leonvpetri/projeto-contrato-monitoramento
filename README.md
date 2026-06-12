# CRM Contratos — Arte Final

Sistema web que substitui a automação n8n (Google Forms → Sheets → Word → PDF → e-mail) para contratos de monitoramento via GPRS.

**Fluxo:** cadastrar contratante no formulário → o sistema gera o contrato em PDF (template fiel ao .docx original) → salva no Supabase Storage → envia por e-mail ao administrativo.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind) — hospedagem na Vercel
- **Supabase** — Postgres (`contratos`), Auth (login) e Storage (`contratos-pdf`)
  - Projeto: `crm-contratos-gprs` (`gszcuwwytikokigezlpw`, região São Paulo)
- **Puppeteer** (`puppeteer-core` + `@sparticuz/chromium` em produção; `puppeteer` em dev) — HTML → PDF
- **Nodemailer (SMTP UOL Host)** — envio de e-mail com anexo pela caixa do próprio domínio
- **extenso** — valores e dia por extenso em pt-BR (antes digitados à mão)

## Rodando localmente

```bash
npm install
npm run dev
```

> **Importante (esta máquina):** a rede intercepta TLS; o Node precisa dos certificados do Windows.
> Use `NODE_OPTIONS=--use-system-ca` antes de `npm install` / `npm run dev`, ou defina essa variável de ambiente de forma permanente.

Acesse http://localhost:3000 — login: `leonvpetri@gmail.com` (senha inicial criada no setup; troque no Supabase Dashboard → Authentication).

## Variáveis de ambiente (`.env.local`)

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave publishable do Supabase |
| `SMTP_HOST` | Servidor SMTP (UOL Host: `smtps.uhserver.com`) |
| `SMTP_PORT` | Porta SMTP (`465` SSL ou `587` STARTTLS) |
| `SMTP_USER` | Caixa de e-mail completa (ex.: `suporte@alarmesartefinal.com.br`) |
| `SMTP_PASS` | Senha da caixa de e-mail |
| `EMAIL_FROM` | Remetente (normalmente igual a `SMTP_USER`) |
| `ADMIN_EMAIL` | E-mail do administrativo que recebe os contratos |

Sem as variáveis SMTP, o contrato é gerado e salvo normalmente, mas fica com status **"PDF gerado"** (não enviado). Configure e use **Reenviar** na lista.

## Estrutura

- `lib/contrato/template.ts` — template HTML do contrato (recriado do .docx)
- `lib/contrato/formatadores.ts` — moeda, datas e por extenso
- `lib/contrato/pdf.ts` — HTML → PDF (Puppeteer)
- `lib/email.ts` — envio via Resend
- `app/contratos/` — lista e formulário de cadastro
- `app/api/contratos/[id]/gerar` — gera PDF, salva no Storage e envia e-mail
- `app/api/contratos/[id]/pdf` — download do PDF (URL assinada)
- `proxy.ts` — proteção de rotas (exige login)

## Deploy na Vercel

1. Suba este diretório para um repositório Git (GitHub).
2. Importe na Vercel e configure as variáveis de ambiente acima.
3. O Puppeteer usa `@sparticuz/chromium` automaticamente em produção (detecta `VERCEL`).
4. A rota de geração tem `maxDuration = 60`; no plano Hobby o limite padrão atende.

## Usuários

Criar/gerenciar em Supabase Dashboard → Authentication → Users (cadastro aberto está desabilitado; não há página de signup).
