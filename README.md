# CRM Mocelin — Vite + React + Supabase

Versão com:
- login real via Supabase
- leitura do perfil do usuário
- módulo **Novo Lead** conectado ao banco

## Instalação
```bash
npm install
```

## Variáveis de ambiente
Crie um `.env` com:
```bash
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA_AQUI
```

## Publicar no Vercel
Crie estas variáveis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Fluxo do Novo Lead
1. O usuário informa CNPJ, telefone ou e-mail
2. O sistema busca cliente existente em `customers`
3. Se existir, carrega automaticamente os dados
4. Ao salvar:
   - reaproveita o cliente existente ou cria um novo
   - cria um novo registro em `leads`

## Próximo passo
Migrar:
- Meus Leads
- Pipeline
- Tarefas
- Histórico
- Relatórios
