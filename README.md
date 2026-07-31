# OrientaAI · UNDF

Plataforma demonstrativa (MVP) de **permanência estudantil** da Universidade do Distrito Federal (UNDF), com foco em evasão, acessibilidade (PCD), benefícios PAE e saúde (psicologia/nutrição). O app alterna entre a **Visão do Estudante** e a **Visão do Gestor** a partir de um seletor no cabeçalho.

> ⚠️ Todos os dados de estudantes, profissionais e agendamentos são **fictícios**, gerados em `src/models/undf-data.ts`. Campos sensíveis (CPF, e-mail, nome) são **mascarados no front-end** (`src/lib/mask.ts`) apenas para fins visuais — não há criptografia nem dados reais envolvidos.

---

## ✨ Funcionalidades

- **Visão do Gestor**
  - Dashboard de evasão (risco alto/médio/baixo, frequência média)
  - Tabela de benefícios PCD / Altas Habilidades
  - Módulo de relatórios
- **Visão do Estudante**
  - Perfil e privacidade (com mascaramento de dados sensíveis)
  - Painel acadêmico (frequência, notas, risco)
  - Agendamento de saúde (psicólogos e nutricionistas)

---

## 🧱 Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start/latest) (SSR via Nitro) |
| UI | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Roteamento | [TanStack Router](https://tanstack.com/router/latest) (file-based) |
| Dados | [TanStack Query](https://tanstack.com/query/latest) |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com/) |
| Componentes | [shadcn/ui](https://ui.shadcn.com/) (estilo *new-york*, ícones *lucide*) |
| Build | [Vite 8](https://vite.dev/) + [`@lovable.dev/vite-tanstack-config`](https://www.npmjs.com/package/@lovable.dev/vite-tanstack-config) |
| Formulários | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Package manager | [Bun](https://bun.sh/) (recomendado) ou npm |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) ≥ 20
- [Bun](https://bun.sh/) ≥ 1.x (recomendado — o projeto usa `bun.lock`)
- Git

---

## 🚀 Como rodar

> Recomenda-se **Bun**, mas os mesmos scripts funcionam com **npm** (há também `package-lock.json`).

### 1. Instalar dependências

```bash
bun install
# ou
npm install
```

### 2. Ambiente de desenvolvimento

```bash
bun run dev
# ou
npm run dev
```

A aplicação sobe em `http://localhost:8080` (porta definida pela config do Lovable/Vite).

### 3. Build de produção

```bash
bun run build
# ou
npm run build
```

### 4. Pré-visualizar o build

```bash
bun run preview
# ou
npm run preview
```

### 5. Build em modo desenvolvimento

```bash
bun run build:dev
# ou
npm run build:dev
```

---

## 🧰 Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `dev` | Inicia o servidor de desenvolvimento (Vite) |
| `build` | Gera o build de produção |
| `build:dev` | Gera o build em modo desenvolvimento (`--mode development`) |
| `preview` | Serve o build de produção localmente |
| `lint` | Executa o ESLint |
| `format` | Formata o código com Prettier |

Executar:

```bash
bun run <script>
# ou
npm run <script>
```

---

## 📁 Estrutura do projeto

```text
voc-bem-care-undf/
├─ src/
│  ├─ routes/                 # Rotas (file-based routing do TanStack Router)
│  │  ├─ __root.tsx           # Layout/shell raiz (HTML, providers, 404, erro)
│  │  ├─ index.tsx            # Página inicial — alterna entre Estudante/Gestor
│  │  └─ README.md            # Convenções de roteamento
│  ├─ views/
│  │  ├─ manager/             # Visão do Gestor (dashboards e relatórios)
│  │  │  ├─ EvasionDashboard.tsx
│  │  │  ├─ PcdBenefitsTable.tsx
│  │  │  └─ ReportsModule.tsx
│  │  └─ student/             # Visão do Estudante
│  │     ├─ AcademicPanel.tsx
│  │     ├─ HealthScheduling.tsx
│  │     └─ PrivacyProfile.tsx
│  ├─ components/
│  │  ├─ site-header.tsx      # Cabeçalho + seletor de papel (estudante/gestor)
│  │  ├─ site-footer.tsx      # Rodapé
│  │  └─ ui/                  # Componentes shadcn/ui (button, card, dialog, ...)
│  ├─ controllers/            # Lógica de estado / "controllers" do app
│  │  ├─ use-role.tsx         # Context que controla o papel ativo
│  │  └─ use-students.ts      # Filtros e métricas do dashboard do gestor
│  ├─ hooks/
│  │  └─ use-mobile.tsx       # Hook utilitário
│  ├─ lib/
│  │  ├─ utils.ts             # cn() (clsx + tailwind-merge)
│  │  ├─ mask.ts              # Mascaramento de CPF/e-mail/nome (visual)
│  │  ├─ error-capture.ts     # Captura de erros de SSR
│  │  ├─ error-page.ts        # Página de erro 500
│  │  └─ lovable-error-reporting.ts
│  ├─ models/
│  │  └─ undf-data.ts         # Tipos de domínio + dados fictícios
│  ├─ router.tsx              # Criação do router (com QueryClient)
│  ├─ routeTree.gen.ts        # ⚠️ AUTOGERADO — não editar
│  ├─ server.ts               # Entry SSR (wrapper de erros)
│  ├─ start.ts                # Instância TanStack Start + middleware de erro
│  └─ styles.css              # Tailwind v4 + variáveis de tema
├─ vite.config.ts             # Config Vite (via @lovable.dev/vite-tanstack-config)
├─ tsconfig.json              # Config TS (alias @/* → ./src/*)
├─ components.json            # Config shadcn/ui
├─ eslint.config.js           # Config ESLint (flat)
├─ .prettierrc / .prettierignore
├─ bunfig.toml                # Config Bun (guard de supply-chain de 24h)
├─ bun.lock / package-lock.json
└─ package.json
```

### Aliases de importação

- `@/*` → `./src/*` (definido em `tsconfig.json`)

---

## 🧭 Convenções de roteamento

O projeto usa **file-based routing** do TanStack Router. Detalhes em [`src/routes/README.md`](src/routes/README.md). Em resumo:

- Arquivos em `src/routes/` viram rotas automaticamente.
- `__root.tsx` é o único layout raiz.
- `routeTree.gen.ts` é **autogerado** — nunca edite manualmente.

---

## 🔐 Observações de segurança

- Os dados são **simulados/mocks**; nenhuma informação real de estudantes é utilizada.
- O mascaramento em `src/lib/mask.ts` é **puramente visual** e **não** substitui criptografia real.
- Variáveis de ambiente locais (se usadas) devem ficar em `.dev.vars` (Cloudflare/Nitro), que **não** deve ser versionado.

---

## 📝 Padrões de código

- **Lint:** `bun run lint` (ESLint, config flat)
- **Format:** `bun run format` (Prettier)
- TypeScript em modo `strict`
- Componentes seguem o padrão **shadcn/ui** (estilo *new-york*)

---

## 🤝 Contribuição

1. Crie uma branch: `git checkout -b feat/minha-feature`
2. Faça commit das alterações
3. Rode `bun run lint` e `bun run format` antes de enviar
4. Abra um Pull Request


