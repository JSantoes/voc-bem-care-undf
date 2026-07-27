import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, HandHeart, Stethoscope, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ImpactCounter } from "@/components/impact-counter";
import { impactMetrics } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VocêBem · Saúde mental e nutricional gratuita" },
      {
        name: "description",
        content:
          "Plataforma que conecta pacientes de baixa renda a psicólogos e nutricionistas voluntários, sustentada por doações.",
      },
      { property: "og:title", content: "VocêBem · Saúde gratuita para quem precisa" },
      {
        property: "og:description",
        content: "Atendimento psicológico e nutricional voluntário, financiado por doações.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-secondary/30" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-secondary/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Telessaúde gratuita · Movido por voluntários
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Cuidar de quem precisa começa com{" "}
              <span className="text-primary">um clique</span>.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              A VocêBem conecta pacientes de baixa renda a psicólogos e nutricionistas voluntários.
              Atendimento humano, online e 100% gratuito — sustentado por doadores como você.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cadastro/paciente"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.02]"
              >
                <Heart className="h-5 w-5" fill="currentColor" />
                Preciso de Atendimento
              </Link>
              <Link
                to="/doar"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary bg-background px-7 py-3.5 text-base font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                <HandHeart className="h-5 w-5" />
                Quero Ajudar
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Validação via Gov.br / CadÚnico · Sigilo profissional garantido
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 to-secondary/40 blur-2xl" />
            <div className="rounded-[2rem] border border-border/60 bg-card p-8 shadow-elegant">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 font-bold text-primary">
                  AM
                </div>
                <div>
                  <div className="font-semibold">Dra. Ana Mendes</div>
                  <div className="text-sm text-muted-foreground">Psicóloga · CRP 06/12345</div>
                </div>
                <span className="ml-auto flex h-2.5 w-2.5 rounded-full bg-success" />
              </div>
              <div className="mt-6 rounded-2xl bg-muted/60 p-4">
                <div className="text-xs font-medium text-muted-foreground">PRÓXIMA CONSULTA</div>
                <div className="mt-1 text-lg font-semibold">Hoje, 16:00</div>
                <div className="text-sm text-muted-foreground">Sessão de terapia online · 50min</div>
              </div>
              <button className="mt-4 w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground">
                Entrar na sala
              </button>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {["Sigiloso", "Gratuito", "Online"].map((t) => (
                  <div key={t} className="rounded-xl border border-border/60 px-2 py-2 text-xs font-medium">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Impacto em tempo real</h2>
            <p className="mt-3 text-muted-foreground">Cada número é uma vida acolhida.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            <ImpactCounter value={impactMetrics.atendimentos} label="Atendimentos realizados" />
            <ImpactCounter value={impactMetrics.profissionais} label="Profissionais voluntários" />
            <ImpactCounter value={impactMetrics.doadores} label="Doadores ativos" />
            <ImpactCounter value={impactMetrics.cidades} label="Cidades atendidas" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">Três caminhos. Um propósito em comum.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <HowCard
            icon={<Heart className="h-6 w-6" />}
            title="Para Pacientes"
            tone="primary"
            steps={[
              "Cadastre-se e valide via Gov.br / CadÚnico",
              "Escolha um profissional disponível",
              "Faça sua consulta online, gratuita e sigilosa",
            ]}
            cta="Quero ser atendido"
            href="/cadastro/paciente"
          />
          <HowCard
            icon={<Stethoscope className="h-6 w-6" />}
            title="Para Profissionais"
            tone="secondary"
            steps={[
              "Cadastre seu CRP ou CRN",
              "Defina seus horários disponíveis",
              "Atenda voluntariamente em sessões online",
            ]}
            cta="Quero ser voluntário"
            href="/cadastro/profissional"
          />
          <HowCard
            icon={<HandHeart className="h-6 w-6" />}
            title="Para Doadores"
            tone="accent"
            steps={[
              "Escolha um valor ou doe via Pix",
              "Acompanhe a transparência da aplicação",
              "Empresas: relatório de impacto ESG mensal",
            ]}
            cta="Quero doar"
            href="/doar"
          />
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/70 p-10 text-primary-foreground shadow-elegant md:p-14">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="text-2xl font-bold md:text-3xl">
                R$ 20 viabilizam uma consulta completa.
              </h3>
              <p className="mt-2 max-w-xl opacity-90">
                Sua doação cobre infraestrutura de telessaúde, plataforma segura e suporte aos
                profissionais voluntários.
              </p>
            </div>
            <Link
              to="/doar"
              className="inline-flex items-center gap-2 rounded-full bg-background px-7 py-3.5 font-semibold text-primary transition-transform hover:scale-105"
            >
              Doar agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function HowCard({
  icon,
  title,
  steps,
  cta,
  href,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  steps: string[];
  cta: string;
  href: "/cadastro/paciente" | "/cadastro/profissional" | "/doar";
  tone: "primary" | "secondary" | "accent";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/15 text-primary"
      : tone === "secondary"
        ? "bg-secondary text-secondary-foreground"
        : "bg-accent text-accent-foreground";
  return (
    <div className="group rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition-shadow hover:shadow-elegant">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass}`}>
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <Link
        to={href}
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform group-hover:translate-x-0.5"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
