import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { Video, FileText, Check, Lock, X } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { upcomingAppointments } from "@/lib/mock-data";

export const Route = createFileRoute("/profissional")({
  head: () => ({
    meta: [
      { title: "Painel do Profissional · VocêBem" },
      { name: "description", content: "Gerencie agenda, disponibilidade e atendimentos." },
    ],
  }),
  component: ProDashboard,
});

const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
const slots = ["08:00", "10:00", "14:00", "16:00", "18:00"];

function ProDashboard() {
  const navigate = useNavigate();
  const [available, setAvailable] = useState(true);
  const [modal, setModal] = useState<string | null>(null);
  const [grid, setGrid] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    days.forEach((d) => slots.forEach((s) => (init[`${d}-${s}`] = Math.random() > 0.6)));
    return init;
  });
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const appt = upcomingAppointments.find((a) => a.id === modal);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-secondary/40 via-background to-primary/10 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-sm font-medium text-primary">Painel profissional</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Dra. Ana Carolina Mendes
            </h1>
            <p className="mt-2 text-muted-foreground">Psicóloga · CRP 06/12345</p>
          </div>
          <button
            onClick={() => setAvailable((v) => !v)}
            className={`inline-flex items-center gap-3 rounded-full border-2 px-5 py-3 font-semibold transition-colors ${
              available
                ? "border-success bg-success/10 text-success"
                : "border-muted-foreground/40 bg-muted text-muted-foreground"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${available ? "bg-success" : "bg-muted-foreground"}`} />
            {available ? "Disponível para novos pacientes" : "Indisponível"}
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Appointments */}
          <section>
            <h2 className="mb-4 text-xl font-bold">Próximos atendimentos</h2>
            <div className="space-y-4">
              {upcomingAppointments.map((a) => (
                <article
                  key={a.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:flex-row sm:items-center"
                >
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <span className="text-xs font-medium">{a.date}</span>
                    <span className="text-base font-bold">{a.time}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{a.patientName}</h3>
                    <p className="text-sm text-muted-foreground">{a.specialty} · 50 minutos</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setModal(a.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <FileText className="h-4 w-4" />
                      Detalhes
                    </button>
                    <button
                      onClick={() => navigate({ to: "/consulta/$id", params: { id: a.id } })}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      <Video className="h-4 w-4" />
                      Iniciar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Availability grid */}
          <section>
            <h2 className="mb-4 text-xl font-bold">Minha disponibilidade</h2>
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                <div></div>
                {days.map((d) => (
                  <div key={d} className="font-semibold text-muted-foreground">
                    {d}
                  </div>
                ))}
                {slots.map((s) => (
                  <Fragment key={s}>
                    <div className="self-center text-muted-foreground">{s}</div>
                    {days.map((d) => {
                      const key = `${d}-${s}`;
                      const on = grid[key];
                      return (
                        <button
                          key={key}
                          onClick={() => setGrid({ ...grid, [key]: !on })}
                          className={`aspect-square rounded-lg transition-colors ${
                            on
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted-foreground/20"
                          }`}
                          aria-label={`${d} ${s}`}
                        >
                          {on && <Check className="mx-auto h-3 w-3" />}
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Toque nos horários para marcar/desmarcar sua disponibilidade.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Patient details modal */}
      {appt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={() => {
            setModal(null);
            setSaved(false);
            setNotes("");
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-border/60 bg-card p-7 shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Lock className="h-3.5 w-3.5" /> SESSÃO SIGILOSA
                </div>
                <h3 className="mt-1 text-2xl font-bold">{appt.patientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {appt.date} · {appt.time} · {appt.specialty}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3 rounded-2xl bg-muted/60 p-4 text-sm">
              <Row label="Idade" value="34 anos" />
              <Row label="Histórico" value="3 sessões anteriores" />
              <Row label="Encaminhamento" value="CAPS Vila Mariana" />
            </div>

            <label className="mt-5 block">
              <span className="mb-1.5 block text-sm font-medium">Anotações da sessão</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2"
                placeholder="Registre observações relevantes…"
              />
            </label>

            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => {
                  setModal(null);
                  setSaved(false);
                  setNotes("");
                }, 1200);
              }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" /> Salvo com criptografia
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Salvar (criptografado)
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
