# API RESTful - CRUD de Usuários

Este projeto foi desenvolvido como desafio técnico, aplicando princípios de Clean Architecture (camadas domain/application/infrastructure), DDD e SOLID utilizando NestJS, TypeORM e MySQL.

O objetivo foi construir uma API escalável, organizada e desacoplada, com separação clara entre domínio, aplicação e infraestrutura.

## Decisões Arquiteturais

- O módulo `user` segue três camadas explícitas:
  - **domain** — regras de negócio puras: `UserEntity`, value objects, validador Joi, e a porta `UserRepositoryPort` (interface). Não conhece NestJS, TypeORM ou HTTP.
  - **application** — orquestração: um caso de uso por operação (SRP), e os DTOs de entrada/saída.
  - **infrastructure** — adapters: o controller HTTP e a implementação do repositório em TypeORM (`UserOrmEntity` + `UserRepository`), a única camada que conhece o ORM.
- A porta do repositório é injetada por um token tipado (`USER_REPOSITORY`, um `Symbol`), não por string mágica — evita erros de digitação silenciosos no DI.
- Existe uma entidade de persistência (`UserOrmEntity`) separada da entidade de domínio (`UserEntity`), que carrega as regras de negócio e nunca é serializada/persistida diretamente.
- O soft delete foi escolhido para manter histórico de dados, usando o mecanismo nativo do TypeORM (`@DeleteDateColumn` + `softDelete()`), que já exclui automaticamente registros deletados das consultas padrão (`find`, `findOne`, `QueryBuilder`). Exceção deliberada: as checagens de unicidade de `registration`/`email` (`findByRegistration`/`findByEmail`) usam `withDeleted: true`, porque essas colunas mantêm constraint UNIQUE no banco mesmo após o soft delete — o registro antigo continua ocupando fisicamente o índice, então a aplicação precisa enxergá-lo para devolver um 409 controlado em vez de deixar o INSERT quebrar com erro de constraint no banco.
- Schema versionado por migrations (`synchronize: false`) — nunca há alteração automática de schema em runtime; toda mudança de banco é uma migration revisável e reversível.
- Validações de regra de negócio estão no domínio (Joi), não na camada HTTP. A camada HTTP (DTOs com `class-validator`) valida o formato/shape da entrada antes mesmo de chegar ao domínio — dupla camada de validação (defesa em profundidade).
- A validação de formato de senha em texto puro vive apenas nos DTOs de entrada, não no validador de domínio: por design, o valor de `password` na entidade já pode ser o hash bcrypt (60+ caracteres, com símbolos), então o domínio só garante que a senha (hash) está presente — validar o *shape* de uma senha em texto puro contra um hash seria uma inconsistência.
- Variáveis de ambiente são validadas no boot da aplicação (`ConfigModule` + schema Joi) — a aplicação falha rápido, com mensagem clara, se faltar alguma variável obrigatória.
- API versionada sob `/api/v1`; `/health` fica deliberadamente fora do prefixo — é consumido por probes de infraestrutura (Docker, load balancer), que não devem acoplar no versionamento do negócio.

---

## Tecnologias Utilizadas

- Node.js
- NestJS
- TypeORM
- MySQL
- Docker
- Swagger UI
- Jest

---

## Estrutura do Projeto

Organização modular baseada em separação de responsabilidades, com o módulo de domínio em camadas explícitas (domain/application/infrastructure).

```
src/
 ├── core/                          # infraestrutura transversal, não específica de um módulo
 │    ├── config/
 │    │    ├── database/            # DataSource, DatabaseModule, migrations
 │    │    └── env/                 # Validação de variáveis de ambiente
 │    ├── docs/swagger/
 │    ├── domain/
 │    │    ├── exception/           # DomainExceptionFilter
 │    │    ├── notification/        # Notification, NotificationErrors
 │    │    └── validator/           # ValidatorInterface
 │    ├── pagination/
 │    ├── services/                 # HashService
 │    └── utils/                    # UserMessages
 │
 ├── modules/
 │    ├── health/                   # GET /health (checa conexão com o banco)
 │    │
 │    └── user/
 │         ├── domain/
 │         │    ├── entities/       # UserEntity — regras de negócio
 │         │    ├── factories/
 │         │    ├── repositories/   # UserRepositoryPort (interface) + token USER_REPOSITORY
 │         │    ├── validators/     # Validação Joi (invariantes de domínio)
 │         │    └── value-objects/
 │         │
 │         ├── application/
 │         │    ├── dtos/           # Validação de entrada (class-validator)
 │         │    └── use-cases/
 │         │         ├── create-user/
 │         │         ├── delete-user/
 │         │         ├── find-all-user/
 │         │         ├── find-by-id-user/
 │         │         └── update-user/
 │         │
 │         ├── infrastructure/
 │         │    ├── http/           # UserController
 │         │    └── persistence/    # UserOrmEntity + UserRepository (implementação TypeORM)
 │         │
 │         └── user.module.ts
 │
 ├── app.module.ts
 └── main.ts

test/
Dockerfile
docker-compose.yaml
entrypoint.sh
```

## Explicação da Estrutura

### core

Infraestrutura compartilhada entre módulos: configuração de banco (DataSource/migrations do TypeORM), validação de variáveis de ambiente, Swagger, filtro de exceção de domínio, sistema de notificação de erros, paginação e serviços utilitários (hash de senha).

### modules/user

- **domain** → regras de negócio puras, sem dependência de framework: entidade, factories, porta do repositório (interface + token de injeção) e validador.
- **application** → um caso de uso por operação do CRUD (Create, Update, Delete, FindById, FindAll), respeitando SRP, e os DTOs que definem o contrato HTTP.
- **infrastructure** → adapters concretos: controller HTTP e o repositório TypeORM, a única camada que sabe que o banco existe.

### modules/health

Endpoint de observabilidade (`GET /health`) usando `@nestjs/terminus`, que verifica a conectividade real com o banco de dados — não apenas se o processo Node está de pé.

## Banco de Dados

Banco relacional MySQL executando via Docker. TypeORM utilizado para modelagem, migrations e acesso aos dados.

### Migrations

```bash
# Rodar migrations pendentes
npm run migration:run

# Reverter a última migration
npm run migration:revert

# Gerar uma nova migration a partir de mudanças nas entidades
npm run migration:generate -- src/core/config/database/migrations/NomeDaMigration

# Criar uma migration vazia
npm run migration:create -- src/core/config/database/migrations/NomeDaMigration
```

Em desenvolvimento, `npm run start:dev` já roda `migration:run` automaticamente antes de subir a aplicação. Em produção (Docker), o `entrypoint.sh` roda as migrations compiladas antes de iniciar o processo Node, e o próprio container só é considerado saudável (`docker ps`) depois que `GET /health` responde 200.

---

## 🚀 Setup do Projeto

#### Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- Docker
- Git

### Como executar a API na sua máquina

```bash
cp .env.example .env
docker compose up -d --build
```

Esse comando sobe o container do MySQL e o container da aplicação NestJS (rodando as migrations automaticamente).

#### Rodando localmente sem Docker

```bash
cp .env.example .env   # ajuste DB_HOST=localhost e DB_PORT para a porta exposta do MySQL
npm install
npm run start:dev
```

---

## Testes

Cobertura focada no domínio e nos casos de uso (onde vive a regra de negócio), com o repositório mockado — sem depender de banco de dados:

```bash
npm run test        # roda a suíte
npm run test:cov    # roda com relatório de cobertura
```

- `UserEntity` — invariantes de domínio (nome só letras, matrícula só números, senha/hash presente), incluindo um teste de regressão específico para o bug corrigido do setter de senha revalidando o hash bcrypt como se fosse texto puro.
- `CreateUserUseCase` / `UpdateUserUseCase` / `DeleteUserUseCase` / `FindByIdUserUseCase` / `FindAllUserUseCase` — fluxos de sucesso e todos os cenários de erro (409 de conflito, 400 de não encontrado, usuário inativo, update sem senha mantendo o hash atual).

Controller, repositório (TypeORM) e DTOs não têm teste próprio nesta rodada — são cobertos indiretamente pelo teste manual via Docker/Swagger; ficam como próximo passo natural (teste de integração com banco real ou testcontainers).

## Documentação Swagger

Após subir o projeto, acessar:

http://localhost:5000/swagger

(O Swagger fica fora do prefixo `/api/v1` de propósito — é documentação, não um endpoint de negócio versionado.)

## Health Check

```
GET /health
```

Retorna 200 com o status da conexão com o banco de dados. Usado pelo `HEALTHCHECK` do Docker para só marcar o container como saudável quando a aplicação realmente consegue falar com o MySQL.

---

## Endpoints

Todos sob o prefixo `/api/v1`:

- `POST   /api/v1/users`
- `GET    /api/v1/users`
- `GET    /api/v1/users/:id`
- `PUT    /api/v1/users/:id`
- `DELETE /api/v1/users/:id`

### Requisitos para Criar e Atualizar usuários

- Nome: apenas letras
- Matrícula (registration): apenas números, única
- Email: formato válido, único
- Senha (password): exatamente 6 caracteres alfanuméricos (letras e números). No PUT, pode ser omitida para manter a senha atual.

### Listar usuários

`GET /api/v1/users` — filtra por nome, matrícula, email, ou usa `filter[search]` para buscar nos três campos ao mesmo tempo.

- `page` — página atual (padrão: 1)
- `limit` — itens por página (padrão: 5, máximo: 100)
- `order` — `asc` ou `desc` (padrão: `desc`)
- `orderBy` — `name`, `registration`, `email`, `createdAt` ou `updatedAt` (padrão: `createdAt`)

`orderBy` é validado contra essa lista fixa — não aceita coluna arbitrária, já que o valor vai direto para um `ORDER BY` no `QueryBuilder` do TypeORM.

### Deletar usuários

`DELETE /api/v1/users/:id` — a data da deleção é registrada na coluna `deletedAt` (soft delete via TypeORM). O registro permanece na base e some das listagens/buscas, mas a matrícula e o email dele **não** ficam livres para reuso — o banco mantém a constraint UNIQUE ativa sobre o registro soft-deletado.

### Exemplos (curl)

```bash
BASE=http://localhost:5000/api/v1

# Criar usuário
curl -X POST $BASE/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Joao Silva","registration":"12345678","email":"joao@email.com","password":"Ab1c2d","isActive":true}'

# Listar (com busca e paginação)
curl "$BASE/users?filter[search]=Joao&page=1&limit=5"

# Listar ordenado por nome, crescente
curl "$BASE/users?orderBy=name&order=asc&limit=10"

# Buscar por id
curl "$BASE/users/<id>"

# Atualizar (senha omitida = mantém a atual)
curl -X PUT "$BASE/users/<id>" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Joao Silva Junior","registration":"12345678","email":"joao@email.com","isActive":true}'

# Remover (soft delete)
curl -X DELETE "$BASE/users/<id>"

# Health check
curl http://localhost:5000/health
```

## Critérios Atendidos

- Qualidade do Código
- Funcionalidade
- Capacidade de Resolução de Problemas
- Documentação
