
# VocêBem — MVP Plan

A front-end-only SPA (mock data, no backend) connecting low-income patients with volunteer psychologists/nutritionists, plus a donation portal. Built on the existing TanStack Start + Tailwind v4 + shadcn stack.

## Design System

- Palette (added as oklch tokens in `src/styles.css`):
  - Primary: soft healing green (`#7BC4A4`-ish)
  - Secondary: calm light blue (`#A8D5E2`-ish)
  - Background: white / very light mint
  - Foreground: dark slate gray for AA contrast
  - Accent (donate CTA): warm coral
- Typography: Inter via `<link>` in `__root.tsx`, large base size (16–18px), generous line-height.
- Components: rounded-2xl cards, soft shadows (`shadow-elegant` token), pill buttons, ample whitespace.
- All colors via semantic tokens — no hardcoded hex in components.
- Language: Portuguese (BR) throughout.

## Routes (TanStack file-based)

```
src/routes/
  __root.tsx              -> shared header (logo + nav) + footer + Outlet
  index.tsx               -> Landing Page
  cadastro.paciente.tsx   -> Patient registration (Gov.br/CadÚnico mock)
  cadastro.profissional.tsx -> Professional registration (CRP/CRN mock)
  paciente.tsx            -> Patient Dashboard
  profissional.tsx        -> Professional Dashboard
  consulta.$id.tsx        -> Telehealth Room
  doar.tsx                -> Donation Portal
```

Each route has its own `head()` with PT-BR title + description.

## Page Specs

### 1. Landing (`/`)
- Hero: mission headline, subcopy, two CTAs — "Preciso de Atendimento" → `/cadastro/paciente`, "Quero Ajudar" → `/doar`.
- "Como Funciona" — three columns (Paciente, Profissional, Doador) with icons.
- Live Impact strip: animated counters (mock) — atendimentos realizados, profissionais voluntários, doadores ativos, cidades atendidas.
- Secondary CTA band → "Seja Voluntário" → `/cadastro/profissional`.
- Footer with mission, contact placeholder.

### 2. Patient Flow
- **Registration** (`/cadastro/paciente`): name, CPF, email fields → "Validar com Gov.br / CadÚnico" button → loading spinner → green success card "Validação concluída — elegível para atendimento gratuito" → "Ir para meu painel" button.
- **Dashboard** (`/paciente`):
  - Tabs: "Agendar Nova Consulta" | "Minhas Consultas".
  - Agendar: cards for each mock professional (avatar, name, specialty, next available slot, "Agendar" button → toast).
  - Minhas Consultas: list of upcoming appointments with "Entrar na Sala" → `/consulta/$id`.

### 3. Professional Flow
- **Registration** (`/cadastro/profissional`): name, specialty select (Psicólogo/Nutricionista), CRP/CRN input → "Validar Registro" → success state.
- **Dashboard** (`/profissional`):
  - Header with availability toggle ("Disponível para novos pacientes").
  - Upcoming appointments list (date, patient name, type, "Iniciar Sessão" → telehealth room, "Ver Detalhes" → modal).
  - Simple weekly availability grid (mock toggleable cells).
  - **Patient Details modal** (shadcn Dialog): patient summary + textarea for "Anotações da sessão" + "Salvar (criptografado)" mock button.

### 4. Telehealth Room (`/consulta/$id`)
- Full-screen dark layout.
- Large placeholder tile for professional video (gradient + initials).
- PiP tile bottom-right for patient.
- Control bar: Mute, Camera, Chat (mock), End Call (red) → routes back to dashboard with toast "Sessão encerrada".
- Sidebar (collapsible) with session notes textarea.

### 5. Donation Portal (`/doar`)
- Tabs: Pessoa Física | Empresa (ESG).
- Amount selector: R$20, R$50, R$100, Personalizado (input).
- "Doar via Pix" button → modal with mock QR code (static SVG) + copy-paste Pix key.
- "Transparência" section: donut/bar showing allocation (Infra em nuvem 40%, Plataforma 25%, Suporte aos profissionais 20%, Operação 15%) with brief copy.
- ESG tab adds: logo upload placeholder, "Receber relatório de impacto" checkbox, recurring donation toggle.

## Mock Data & State

- `src/lib/mock-data.ts` — arrays for `professionals`, `appointments`, `impactMetrics`, `donationAllocation`.
- `src/lib/store.ts` — tiny Zustand store (or React context) for: current user role, registered flag, list of user's appointments. Persists to `localStorage` so navigation between dashboards feels continuous.
- No backend, no Lovable Cloud.

## Shared Components

- `components/site-header.tsx` — logo "VocêBem" + nav (Início, Sou Paciente, Sou Profissional, Doar).
- `components/site-footer.tsx`.
- `components/impact-counter.tsx` — animated number.
- `components/professional-card.tsx`.
- `components/appointment-card.tsx`.
- `components/section.tsx` — consistent padding wrapper.

## Out of Scope (MVP)

- Real auth, real video (WebRTC), real payments, real Gov.br/CRP API, persistence beyond localStorage, i18n switcher, admin role.

## Technical Notes

- Stack stays as-is: TanStack Start, Tailwind v4, shadcn. No new framework deps.
- Add Zustand (`bun add zustand`) for the lightweight cross-route store.
- Inter font loaded via `<link>` in `__root.tsx` head; tokens in `@theme` reference it.
- All forms use shadcn `Form` + `react-hook-form` + `zod` (already installed).
- QR code: inline SVG asset (no network dep).
