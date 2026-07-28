// VIEW: student health scheduling (psychologist / nutritionist)
import { useState } from "react";
import { CalendarPlus, Video, MapPin, HeartPulse, Check } from "lucide-react";
import { professionals, initialAppointments, type Appointment } from "@/models/undf-data";

export function HealthScheduling() {
  const [appts, setAppts] = useState<Appointment[]>(initialAppointments);
  const [profId, setProfId] = useState(professionals[0].id);
  const [date, setDate] = useState("2026-08-05");
  const [time, setTime] = useState("14:00");
  const [modality, setModality] = useState<Appointment["modality"]>("Online (Google Meet)");
  const [ok, setOk] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const [, m, d] = date.split("-");
    const newAppt: Appointment = {
      id: `a${Date.now()}`,
      studentId: "me",
      professionalId: profId,
      date: `${d}/${m}`,
      time,
      modality,
      status: "confirmado",
    };
    setAppts([newAppt, ...appts]);
    setOk(true);
    setTimeout(() => setOk(false), 2500);
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Agendamento de saúde</h2>
        <p className="text-sm text-muted-foreground">
          Cuide de você — psicólogos e nutricionistas voluntários da UNDF
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={submit} className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <HeartPulse className="h-3.5 w-3.5" />
            Nova consulta
          </div>

          <div className="grid gap-4">
            <Field label="Profissional">
              <select
                value={profId}
                onChange={(e) => setProfId(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {professionals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.role}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Data">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
              <Field label="Horário">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              </Field>
            </div>

            <Field label="Modalidade">
              <div className="grid gap-2 sm:grid-cols-2">
                <ModalityBtn
                  active={modality === "Online (Google Meet)"}
                  onClick={() => setModality("Online (Google Meet)")}
                  icon={<Video className="h-4 w-4" />}
                  title="Online"
                  desc="Google Meet"
                />
                <ModalityBtn
                  active={modality === "Presencial na UNDF"}
                  onClick={() => setModality("Presencial na UNDF")}
                  icon={<MapPin className="h-4 w-4" />}
                  title="Presencial"
                  desc="Campus UNDF"
                />
              </div>
            </Field>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
            >
              {ok ? <Check className="h-4 w-4" /> : <CalendarPlus className="h-4 w-4" />}
              {ok ? "Consulta agendada!" : "Confirmar agendamento"}
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Próximas consultas
          </h3>
          <ul className="space-y-3">
            {appts.map((a) => {
              const p = professionals.find((x) => x.id === a.professionalId)!;
              return (
                <li
                  key={a.id}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/60 p-3"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-sm font-bold text-primary">
                    {p.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.date} · {a.time} · {p.role}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      a.modality.startsWith("Online")
                        ? "bg-chart-2/15 text-chart-2"
                        : "bg-success/15 text-success"
                    }`}
                  >
                    {a.modality.startsWith("Online") ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <MapPin className="h-3 w-3" />
                    )}
                    {a.modality.startsWith("Online") ? "Online" : "Presencial"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ModalityBtn({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
        active
          ? "border-primary bg-primary/10"
          : "border-border/60 bg-background hover:border-primary/40"
      }`}
    >
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}
