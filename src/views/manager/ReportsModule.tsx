// VIEW: manager reports module — generates filtered class summaries + PDF export.
import { useMemo, useState } from "react";
import { FileText, Download, Sparkles } from "lucide-react";
import type { Course, School, Student } from "@/models/undf-data";
import { ALL, filterStudents, type Filters } from "@/controllers/use-students";
import { generateReportPdf } from "@/lib/pdf";

type Option = { value: string; label: string };

export function ReportsModule({
  schools,
  courses,
  students,
}: {
  schools: School[];
  courses: Course[];
  students: Student[];
}) {
  const [filters, setFilters] = useState<Filters>({ school: ALL, course: ALL, turma: ALL });
  const [hasReport, setHasReport] = useState(false);

  const schoolOptions: Option[] = [
    { value: ALL, label: "Todas as escolas" },
    ...schools.map((s) => ({ value: s.id, label: `${s.code} · ${s.name}` })),
  ];
  const availableCourses = useMemo(
    () => (filters.school === ALL ? courses : courses.filter((c) => c.schoolId === filters.school)),
    [courses, filters.school],
  );
  const courseOptions: Option[] = [
    { value: ALL, label: "Todos os cursos" },
    ...availableCourses.map((c) => ({ value: c.id, label: c.name })),
  ];
  const turmaOptions: Option[] = useMemo(
    () => [
      { value: ALL, label: "Todas as turmas" },
      ...Array.from(new Set(students.map((s) => s.turma)))
        .sort()
        .map((t) => ({ value: t, label: t })),
    ],
    [students],
  );

  const report = useMemo(
    () => buildReport(students, schools, courses, filters),
    [students, schools, courses, filters],
  );

  const exportPdf = () => {
    // Always reflects the currently selected filters (live data from the DB).
    const live = buildReport(students, schools, courses, filters);
    generateReportPdf(
      { school: live.scopeSchool, course: live.scopeCourse, turma: live.scopeTurma },
      {
        total: live.total,
        alto: live.alto,
        pctAlto: live.pctAlto,
        avgAttendance: live.avgAttendance,
        avgGpa: live.avgGpa,
        pcd: live.pcd,
        beneficiados: live.beneficiados,
        recommendation: live.recommendation,
      },
    );
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold tracking-tight">Módulo de Relatórios</h2>
        <p className="text-sm text-muted-foreground">
          Gere resumos sobre a situação geral das turmas e exporte em PDF
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Escola">
          <SelectInput
            value={filters.school}
            options={schoolOptions}
            onChange={(v) => setFilters((f) => ({ ...f, school: v, course: ALL }))}
          />
        </Field>
        <Field label="Curso">
          <SelectInput
            value={filters.course}
            options={courseOptions}
            onChange={(v) => setFilters((f) => ({ ...f, course: v }))}
          />
        </Field>
        <Field label="Turma">
          <SelectInput
            value={filters.turma}
            options={turmaOptions}
            onChange={(v) => setFilters((f) => ({ ...f, turma: v }))}
          />
        </Field>
        <div className="flex items-end">
          <button
            onClick={() => setHasReport(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            Gerar relatório
          </button>
        </div>
      </div>

      {hasReport && (
        <article className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold">Resumo executivo</h3>
                <p className="text-xs text-muted-foreground">
                  {report.scopeSchool} · {report.scopeCourse} · {report.scopeTurma} · gerado agora
                </p>
              </div>
            </div>
            <button
              onClick={exportPdf}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted"
            >
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

type ReportResult = {
  scopeSchool: string;
  scopeCourse: string;
  scopeTurma: string;
  total: number;
  alto: number;
  pctAlto: number;
  avgAttendance: number;
  avgGpa: number;
  pcd: number;
  beneficiados: number;
  recommendation: string;
};

function buildReport(
  students: Student[],
  schools: School[],
  courses: Course[],
  f: Filters,
): ReportResult {
  const list = filterStudents(students, f);
  const total = list.length || 1;
  const alto = list.filter((s) => s.risk === "alto").length;
  const avgAttendance = Math.round(list.reduce((a, s) => a + s.attendance, 0) / total);
  const avgGpa = list.reduce((a, s) => a + s.gpa, 0) / total;
  const pctAlto = Math.round((alto / total) * 100);
  const pcd = list.filter((s) => s.pcd).length;
  const beneficiados = list.filter((s) => s.benefits.length > 0).length;
  const recommendation =
    list.length === 0
      ? "Não há estudantes para os filtros selecionados. Ajuste os critérios e gere novamente."
      : pctAlto > 30
        ? "Priorizar busca ativa e reforço acadêmico. Encaminhar estudantes de alto risco ao Núcleo de Apoio Psicopedagógico da UNDF."
        : "Manter monitoramento contínuo e ampliar comunicação sobre benefícios do PAE.";

  const schoolName = schools.find((s) => s.id === f.school)?.name;
  const courseName = courses.find((c) => c.id === f.course)?.name;

  return {
    scopeSchool: f.school === ALL ? "Todas as escolas" : (schoolName ?? f.school),
    scopeCourse: f.course === ALL ? "Todos os cursos" : (courseName ?? f.course),
    scopeTurma: f.turma === ALL ? "Todas as turmas" : f.turma,
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
      <span className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full truncate rounded-lg border border-input bg-background px-3 text-sm font-medium outline-none transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
