// VIEW: friendly academic panel for the student
import { BookOpen, CalendarCheck, TrendingUp } from "lucide-react";
import { currentStudent } from "@/models/undf-data";

const subjects = [
  { name: "Cálculo I", grade: 8.4, attendance: 92 },
  { name: "Algoritmos", grade: 9.1, attendance: 96 },
  { name: "Sociologia", grade: 7.2, attendance: 78 },
  { name: "Redação Acadêmica", grade: 8.8, attendance: 90 },
];

export function AcademicPanel() {
  const avg = subjects.reduce((a, s) => a + s.grade, 0) / subjects.length;
  const att = Math.round(subjects.reduce((a, s) => a + s.attendance, 0) / subjects.length);
  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Meu painel acadêmico</h2>
        <p className="text-sm text-muted-foreground">
          {currentStudent.course} · Turma {currentStudent.turma}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Média geral" value={avg.toFixed(1)} />
        <Kpi icon={<CalendarCheck className="h-4 w-4" />} label="Frequência" value={`${att}%`} />
        <Kpi icon={<BookOpen className="h-4 w-4" />} label="Disciplinas" value={subjects.length.toString()} />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Desempenho por disciplina
        </h3>
        <ul className="space-y-4">
          {subjects.map((s) => (
            <li key={s.name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">
                  Nota <strong className="text-foreground">{s.grade}</strong> · Freq{" "}
                  <strong className="text-foreground">{s.attendance}%</strong>
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-chart-2"
                  style={{ width: `${s.attendance}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}
