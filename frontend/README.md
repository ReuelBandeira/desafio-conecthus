# WenLock — Frontend (CRUD de Usuários)

Frontend em React para o desafio técnico, construído a partir do design em
Adobe XD (`xdadobe desagin e imagens/`), consumindo a API NestJS que vive em
`../backend`.

## Stack

- **Vite + React 18 + TypeScript** (`strict: true`)
- **React Router** para as rotas
- **TanStack Query** para estado de servidor (cache, invalidação, loading/erro)
- **React Hook Form + Zod** para formulário e validação (botão de salvar só habilita com o form válido)
- **Tailwind CSS** para estilo, com tokens de cor extraídos do design
- **lucide-react** para ícones, **sonner** para toasts de feedback
- **Vitest + React Testing Library + MSW** para testes

## Arquitetura

Organização por feature, não por tipo de arquivo:

```
src/
  app/                 # shell da aplicação: rotas, providers, layout (Sidebar/Topbar)
  features/users/
    api/               # fetch tipado + hooks React Query
    schemas/           # validação Zod (name/registration/email/password)
    types/
    components/        # UserForm, UsersTable
    pages/             # HomePage, UsersListPage, CreateUserPage, EditUserPage, ViewUserPage
  shared/
    components/        # Button, FloatingInput, PasswordInput, Pagination, EmptyState, ConfirmModal, Avatar, Logo, Breadcrumb
    hooks/              # useDebouncedValue
    lib/                # api-client (fetch + normalização de erro), query-client
  test/                # setup do Vitest, mocks MSW do contrato HTTP real, test-utils
```

`UserForm` é reaproveitado nos três modos (`create` / `edit` / `view`) — a
tela de edição usa exatamente o mesmo componente, só com valores
pré-preenchidos e a regra de senha relaxada (vazio = mantém a atual); o modo
`view` (ícone de olho na listagem, um bônus do design que não estava escrito
como requisito no PDF) reaproveita o mesmo form em modo somente leitura.

## Decisões de validação

As regras de campo espelham exatamente o backend (nunca mais permissivas
que a API — ver `src/features/users/schemas/user-form.schema.ts`):

- Nome: apenas letras, 2–30 caracteres
- Matrícula: apenas números, 4–10 caracteres
- E-mail: formato válido, máx. 40 caracteres
- Senha: exatamente 6 caracteres alfanuméricos (igual ao backend — a spec do PDF é explícita nisso), com campo de confirmação

## Tratamento de erro da API

O backend devolve três formatos de erro diferentes (validação de domínio,
validação de DTO, conflito simples) — `shared/lib/api-client.ts` normaliza
os três num único `ApiError`, e `shared/lib/api-error.ts` traduz as
mensagens conhecidas do backend (que vêm em inglês, ex.: `"User already
registered with this registration"`) para mensagens em português já
associadas ao campo certo do formulário (ex.: matrícula/e-mail duplicados
destacam o campo em vez de só mostrar um toast genérico).

## Rodando

Pré-requisito: o backend rodando (`docker compose up -d` em
`../backend`, exposto em `http://localhost:5000`).

### Desenvolvimento (hot-reload)

```bash
cp .env.example .env
npm install
npm run dev
```

Scripts:

```bash
npm run dev        # ambiente de desenvolvimento
npm run build       # build de produção (tsc + vite build)
npm run lint         # eslint
npm run test         # suíte de testes (Vitest)
npm run test:cov     # suíte com relatório de cobertura
```

### Docker

```bash
docker build -t wenlock-frontend --build-arg VITE_API_BASE_URL=http://localhost:5000/api/v1 .
docker run -p 8080:80 wenlock-frontend
```

Build multi-stage: compila com Vite/Node e serve os arquivos estáticos com
nginx (`nginx.conf` faz o fallback de rotas do React Router para
`index.html`). Como o Vite embute a variável de ambiente no bundle em
tempo de build (não em runtime), `VITE_API_BASE_URL` precisa ser passada
como `--build-arg`, não como variável de ambiente do container. Veja o
`docker-compose.yml` na raiz do repositório para subir frontend + backend +
banco juntos.

## Testes

Cobertura em três níveis, usando MSW para mockar o contrato HTTP real do
backend (não o `fetch` cru):

- **Unit**: schemas Zod (cada regra de nome/matrícula/senha/e-mail), `useDebouncedValue`, tradução de erros da API.
- **Componente**: `UserForm` (botão desabilitado até o form ficar válido, toggle de senha, confirmação de cancelamento), `ConfirmModal`, `Pagination`, `EmptyState`.
- **Página** (com MSW): `UsersListPage` (listar, buscar, estados vazios, excluir com confirmação), `CreateUserPage` e `EditUserPage` (sucesso e conflito de matrícula/e-mail vindo da API, edição sem trocar senha), `ViewUserPage` (somente leitura).

Fora de escopo por ora: testes e2e (Playwright/Cypress) — mesma decisão de
priorização tomada no backend, fica como próximo passo natural.

## Fora de escopo

- Login/autenticação/recuperação de senha — não pedido pelo PDF do teste e sem endpoint correspondente no backend. As telas de Login/Splash no material de design não foram implementadas.
