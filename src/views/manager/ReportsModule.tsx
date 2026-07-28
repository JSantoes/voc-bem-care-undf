// VIEW: manager reports module — generates class summaries
import { useState } from "react";
import { FileText, Download, Sparkles } from "lucide-react";
import { students, type Course, type Turma } from "@/models/undf-data";

const COURSES: (Course | "todos")[] = ["todos", "Engenharia", "Medicina", "Direito", "Pedagogia", "Computação"];
const TURMAS: (Turma | "todos")[] = ["todos", "2024.1", "2024.2", "2025.1"];

export function ReportsModule() {
  const [course, setCourse] = useState<Course | "todos">("todos");
  const [turma, setTurma] = useState<Turma | "todos">("todos");
  const [report, setReport] = useState<null | ReturnType<typeof buildReport>>(null);

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Módulo de Relatórios</h2>
        <p className="text-sm text-muted-foreground">Gere resumos sobre a situação geral das turmas</p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft md:grid-cols-[1fr_1fr_auto]">
        <Field label="Curso">
          <select
            value={course}
            onChange={(e) => setCourse(e.target.value as Course | "todos")}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {COURSES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Turma">
          <select
            value={turma}
            onChange={(e) => setTurma(e.target.value as Turma | "todos")}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {TURMAS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <button
          onClick={() => setReport(buildReport(course, turma))}
          className="inline-flex items-center justify-center gap-2 self-end rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105"
        >
          <Sparkles className="h-4 w-4" />
          Gerar relatório
        </button>
      </div>

      {report && (
        <article className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold">Resumo executivo</h3>
                <p className="text-xs text-muted-foreground">
                  {report.scope} · gerado agora
                </p>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold hover:bg-muted">
              <Download className="h-3.5 w-3.5" />
              PDF
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Stat k="Estudantes analisados" v={report.total} />
            <Stat k="Frequência média" v={`${report.avgAttendance}%`} />
            <Stat k="Nota média (0–10)" v={report.avgGpa.toFixed(1)} />
            <Stat k="Alto risco de evasão" v={`${report.alto} (${report.pctAlto}%)`} />
            <Stat k="Estudantes PCD" v={report.pcd} />
            <Stat k="Contemplados PAE" v={report.beneficiados} />
          </div>

          <p className="mt-5 rounded-xl bg-muted/60 p-4 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Recomendação: </strong>
            {report.recommendation}
          </p>
        </article>
      )}
    </section>
  );
}

function buildReport(course: Course | "todos", turma: Turma | "todos") {
  const list = students.filter(
    (s) => (course === "todos" || s.course === course) && (turma === "todos" || s.turma === turma),
  );
  const total = list.length || 1;
  const alto = list.filter((s) => s.risk === "alto").length;
  const avgAttendance = Math.round(list.reduce((a, s) => a + s.attendance, 0) / total);
  const avgGpa = list.reduce((a, s) => a + s.gpa, 0) / total;
  const pctAlto = Math.round((alto / total) * 100);
  const pcd = list.filter((s) => s.pcd).length;
  const beneficiados = list.filter((s) => s.benefits.length > 0).length;
  const recommendation =
    pctAlto > 30
      ? "Priorizar busca ativa e reforço acadêmico. Encaminhar estudantes de alto risco ao Núcleo de Apoio Psicopedagógico da UNDF."
      : "Manter monitoramento contínuo e ampliar comunicação sobre benefícios do PAE.";
  return {
    scope: `${course === "todos" ? "Todos os cursos" : course} · ${turma === "todos" ? "Todas as turmas" : turma}`,
    total: list.length,
    alto,
    pctAlto,
    avgAttendance,
    avgGpa,
    pcd,
    beneficiados,
    recommendation,
  };
}

function Stat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-4">
      <p className="text-xs uppercase text-muted-foreground">{k}</p>
      <p className="mt-1 text-xl font-bold">{v}</p>
    </div>
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
