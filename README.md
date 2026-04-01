# CRM Mocelin — Vite + React + Supabase

Estrutura inicial pronta para publicar no GitHub e no Vercel.

## 1. Instalação
```bash
npm install
```

## 2. Variáveis de ambiente
Copie o arquivo `.env.example` para `.env` e preencha:

```bash
cp .env.example .env
```

Variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3. Rodar localmente
```bash
npm run dev
```

## 4. Build
```bash
npm run build
```

## 5. Publicar no Vercel
No Vercel, crie estas variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Depois faça um novo deploy.

## O que já está pronto
- conexão com Supabase
- tela de login real
- leitura do perfil do usuário em `user_profiles`
- shell inicial do CRM

## Próximo passo
Migrar:
- leads
- pipeline
- tarefas
- histórico
- relatórios
