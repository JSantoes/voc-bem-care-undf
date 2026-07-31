// VIEW: friendly academic panel for the student, with a semester filter.
import { useMemo, useState } from "react";
import { BookOpen, CalendarCheck, TrendingUp, GraduationCap } from "lucide-react";
import type { Student, StudentGrade } from "@/models/undf-data";

export function AcademicPanel({
  student,
  grades,
}: {
  student: Student | null;
  grades: StudentGrade[];
}) {
  // Semesters are derived from the student's real grade records (e.g. 2024.1, 2024.2, 2025.1).
  const semesters = useMemo(
    () =>
      Array.from(new Set(grades.map((g) => g.semester)))
        .sort()
        .reverse(),
    [grades],
  );
  const [semester, setSemester] = useState<string>(semesters[0] ?? "");

  const rows = useMemo(() => grades.filter((g) => g.semester === semester), [grades, semester]);

  const avg = rows.length ? rows.reduce((a, s) => a + s.grade, 0) / rows.length : 0;
  const att = rows.length
    ? Math.round(rows.reduce((a, s) => a + s.attendance, 0) / rows.length)
    : 0;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meu painel acadêmico</h2>
          <p className="text-sm text-muted-foreground">{student?.course ?? "—"}</p>
        </div>
        {semesters.length > 0 && (
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Semestre
            </span>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="h-10 w-40 rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-soft outline-none transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={<TrendingUp className="h-4 w-4" />} label="Média geral" value={avg.toFixed(1)} />
        <Kpi icon={<CalendarCheck className="h-4 w-4" />} label="Frequência" value={`${att}%`} />
        <Kpi
          icon={<BookOpen className="h-4 w-4" />}
          label="Disciplinas"
          value={rows.length.toString()}
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Desempenho por disciplina
        </h3>
        {rows.length === 0 ? (
          <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Sem lançamentos de notas para o semestre {semester || "selecionado"}.
          </p>
        ) : (
          <ul className="space-y-5">
            {rows.map((s) => (
              <li key={`${s.subjectId}-${s.semester}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.subject}</span>
                  <span className="text-muted-foreground">
                    Nota <strong className="text-foreground">{s.grade.toFixed(1)}</strong> · Freq{" "}
                    <strong className="text-foreground">{s.attendance}%</strong>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {/* Nota (0–10) */}
                  <Bar label="Nota" pct={(s.grade / 10) * 100} tone="primary" />
                  {/* Frequência (0–100%) */}
                  <Bar label="Freq" pct={s.attendance} tone="muted" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: "primary" | "muted" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 shrink-0 text-[10px] font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${
            tone === "primary" ? "bg-gradient-to-r from-primary to-chart-2" : "bg-chart-3"
          }`}
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
      </div>
    </div>
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
