# CRM Contratos — Arte Final

Sistema web que substitui a automação n8n (Google Forms → Sheets → Word → PDF → e-mail) para contratos de monitoramento via GPRS.

**Fluxo:** cadastrar contratante no formulário → o sistema gera o contrato em PDF (template fiel ao .docx original) → salva no Supabase Storage → envia por e-mail ao administrativo.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind) — hospedagem na Vercel
- **Supabase** — Postgres (`contratos`), Auth (login) e Storage (`contratos-pdf`)
  - Projeto: `crm-contratos-gprs` (`gszcuwwytikokigezlpw`, região São Paulo)
- **Puppeteer** (`puppeteer-core` + `@sparticuz/chromium` em produção; `puppeteer` em dev) — HTML → PDF
- **Resend** — envio de e-mail com anexo
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
| `RESEND_API_KEY` | Chave da API do Resend (https://resend.com/api-keys) |
| `EMAIL_FROM` | Remetente verificado no Resend (`onboarding@resend.dev` para testes) |
| `ADMIN_EMAIL` | E-mail do administrativo que recebe os contratos |

Sem `RESEND_API_KEY`, o contrato é gerado e salvo normalmente, mas fica com status **"PDF gerado"** (não enviado). Configure a chave e use **Reenviar** na lista.

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
