// VIEW: manager evasion dashboard with interactive, cascading filters.
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Users, HeartHandshake, TrendingDown } from "lucide-react";
import { attendanceTrend, type Course, type School, type Student } from "@/models/undf-data";
import { ALL, useEvasionMetrics, type Filters } from "@/controllers/use-students";

const PIE_COLORS = ["hsl(0 70% 60%)", "hsl(38 90% 55%)", "var(--color-primary)"];

type Option = { value: string; label: string };

export function EvasionDashboard({
  schools,
  courses,
  students,
  filters,
  onFiltersChange,
}: {
  schools: School[];
  courses: Course[];
  students: Student[];
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
}) {
  const m = useEvasionMetrics(students, filters);

  // Cascading dropdowns: when a school is chosen, only its courses are offered.
  const schoolOptions: Option[] = [
    { value: ALL, label: "Todas" },
    ...schools.map((s) => ({ value: s.id, label: `${s.code} · ${s.name}` })),
  ];
  const availableCourses = useMemo(
    () => (filters.school === ALL ? courses : courses.filter((c) => c.schoolId === filters.school)),
    [courses, filters.school],
  );
  const courseOptions: Option[] = [
    { value: ALL, label: "Todos" },
    ...availableCourses.map((c) => ({ value: c.id, label: c.name })),
  ];
  const turmaOptions: Option[] = useMemo(
    () => [
      { value: ALL, label: "Todas" },
      ...Array.from(new Set(students.map((s) => s.turma)))
        .sort()
        .map((t) => ({ value: t, label: t })),
    ],
    [students],
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Evasão</h2>
          <p className="text-sm text-muted-foreground">
            Indicadores de permanência estudantil da UNDF
          </p>
        </div>

        {/* Aligned, responsive filter bar: stacks full-width on mobile, row on >= sm */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:flex lg:flex-wrap lg:items-end">
          <FilterSelect
            label="Escola"
            value={filters.school}
            options={schoolOptions}
            onChange={(v) => onFiltersChange({ ...filters, school: v, course: ALL })}
          />
          <FilterSelect
            label="Curso"
            value={filters.course}
            options={courseOptions}
            onChange={(v) => onFiltersChange({ ...filters, course: v })}
          />
          <FilterSelect
            label="Turma"
            value={filters.turma}
            options={turmaOptions}
            onChange={(v) => onFiltersChange({ ...filters, turma: v })}
          />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Users className="h-4 w-4" />}
          label="Estudantes"
          value={m.total.toString()}
          tone="primary"
        />
        <Kpi
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Alto risco de evasão"
          value={m.alto.toString()}
          tone="danger"
        />
        <Kpi
          icon={<TrendingDown className="h-4 w-4" />}
          label="Frequência média"
          value={`${m.avgAttendance}%`}
          tone="warn"
        />
        <Kpi
          icon={<HeartHandshake className="h-4 w-4" />}
          label="Beneficiados PAE"
          value={m.beneficiados.toString()}
          tone="success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Risco por curso</CardTitle>
          <div className="h-[24rem] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={m.byCourse}
                barCategoryGap="22%"
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
                {/*
                  interval={0} renders every course label. The generous `height`
                  reserves enough vertical room for the rotated long names so they
                  never overflow into the legend, on any screen width.
                */}
                <XAxis
                  dataKey="curso"
                  interval={0}
                  angle={-22}
                  textAnchor="end"
                  height={96}
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={12}
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                  contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
                />
                <Legend />
                {/*
                  Flat (no radius) stacked segments: the color blocks touch
                  perfectly with no gaps or rounded seams, giving a continuous,
                  solid look. Colors are unchanged.
                */}
                <Bar dataKey="alto" stackId="a" name="Alto" fill="hsl(0 70% 60%)" />
                <Bar dataKey="medio" stackId="a" name="Médio" fill="hsl(38 90% 55%)" />
                <Bar dataKey="baixo" stackId="a" name="Baixo" fill="var(--color-primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Distribuição de risco</CardTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={m.riskShare}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {m.riskShare.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <CardTitle>Tendência de frequência semestral</CardTitle>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceTrend()}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="mes" fontSize={12} />
              <YAxis domain={[60, 100]} fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="frequencia"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </section>
  );
}

function Kpi({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "danger" | "warn" | "success";
}) {
  const toneCls = {
    primary: "bg-primary/10 text-primary",
    danger: "bg-destructive/10 text-destructive",
    warn: "bg-chart-3/15 text-chart-4",
    success: "bg-success/15 text-success",
  }[tone];
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${toneCls}`}
      >
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card p-5 shadow-soft ${className}`}>
      {children}
    </div>
  );
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
      {children}
    </h3>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1 lg:w-52">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full truncate rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-soft outline-none transition-colors hover:border-primary/40 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
