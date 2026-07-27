import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Calendar, Star, Video, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { professionals, upcomingAppointments, type Professional } from "@/lib/mock-data";

export const Route = createFileRoute("/paciente")({
  head: () => ({
    meta: [
      { title: "Painel do Paciente · VocêBem" },
      { name: "description", content: "Agende consultas e acesse seus atendimentos." },
    ],
  }),
  component: PatientDashboard,
});

function PatientDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"agendar" | "minhas">("agendar");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "Psicólogo(a)" | "Nutricionista">("todos");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = professionals.filter((p) => {
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.focus.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "todos" || p.specialty === filter;
    return matchQ && matchF;
  });

  const schedule = (p: Professional) => {
    setToast(`Consulta agendada com ${p.name} — ${p.nextSlot}`);
    setTimeout(() => setToast(null), 2800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 md:p-10">
          <p className="text-sm font-medium text-primary">Bem-vinda de volta</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">Olá, Maria 👋</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Como você está se sentindo hoje? Agende uma nova consulta ou acesse seus atendimentos.
          </p>
        </div>

        <div className="mt-8 inline-flex rounded-full bg-muted p-1">
          <TabBtn active={tab === "agendar"} onClick={() => setTab("agendar")}>
            Agendar Nova Consulta
          </TabBtn>
          <TabBtn active={tab === "minhas"} onClick={() => setTab("minhas")}>
            Minhas Consultas
          </TabBtn>
        </div>

        {tab === "agendar" && (
          <div className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome ou especialidade…"
                  className="w-full rounded-full border border-input bg-card py-3 pl-11 pr-4 text-sm outline-none ring-primary/40 focus:ring-2"
                />
              </div>
              <div className="inline-flex rounded-full bg-muted p-1">
                {(["todos", "Psicólogo(a)", "Nutricionista"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      filter === f ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    {f === "todos" ? "Todos" : f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {filtered.map((p) => (
                <article
                  key={p.id}
                  className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-shadow hover:shadow-elegant"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 font-bold text-primary">
                      {p.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-muted-foreground">{p.specialty}</p>
                      <p className="mt-1 text-sm">{p.focus}</p>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                      <Star className="h-3 w-3 fill-current text-chart-3" /> {p.rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      Próximo horário: <strong className="text-foreground">{p.nextSlot}</strong>
                    </span>
                    <button
                      onClick={() => schedule(p)}
                      className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                    >
                      Agendar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {tab === "minhas" && (
          <div className="mt-6 space-y-4">
            {upcomingAppointments.map((a) => (
              <article
                key={a.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft sm:flex-row sm:items-center"
              >
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <span className="text-xs font-medium">{a.date}</span>
                  <span className="text-base font-bold">{a.time}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{a.professionalName}</h3>
                  <p className="text-sm text-muted-foreground">{a.specialty} · 50 minutos</p>
                </div>
                <button
                  onClick={() => navigate({ to: "/consulta/$id", params: { id: a.id } })}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <Video className="h-4 w-4" />
                  Entrar na Sala
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background shadow-elegant">
          {toast}
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        active ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}
