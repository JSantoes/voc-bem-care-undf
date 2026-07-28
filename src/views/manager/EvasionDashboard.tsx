// VIEW: manager evasion dashboard with interactive filters
import { useState } from "react";
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
import { attendanceTrend, type Course, type Turma } from "@/models/undf-data";
import { useEvasionMetrics } from "@/controllers/use-students";

const COURSES: (Course | "todos")[] = ["todos", "Engenharia", "Medicina", "Direito", "Pedagogia", "Computação"];
const TURMAS: (Turma | "todos")[] = ["todos", "2024.1", "2024.2", "2025.1"];
const PIE_COLORS = ["hsl(0 70% 60%)", "hsl(38 90% 55%)", "var(--color-primary)"];

export function EvasionDashboard() {
  const [course, setCourse] = useState<Course | "todos">("todos");
  const [turma, setTurma] = useState<Turma | "todos">("todos");
  const m = useEvasionMetrics(course, turma);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard de Evasão</h2>
          <p className="text-sm text-muted-foreground">
            Indicadores de permanência estudantil da UNDF
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select label="Curso" value={course} onChange={(v) => setCourse(v as Course | "todos")} options={COURSES} />
          <Select label="Turma" value={turma} onChange={(v) => setTurma(v as Turma | "todos")} options={TURMAS} />
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Users className="h-4 w-4" />} label="Estudantes" value={m.total.toString()} tone="primary" />
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
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={m.byCourse}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="curso" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }} />
                <Legend />
                <Bar dataKey="alto" stackId="a" name="Alto" fill="hsl(0 70% 60%)" radius={[6, 6, 0, 0]} />
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
                <Pie data={m.riskShare} dataKey="value" innerRadius={50} outerRadius={90} paddingAngle={3}>
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
      <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${toneCls}`}>
        {icon}
        {label}
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card p-5 shadow-soft ${className}`}>{children}</div>
  );
}
function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">{children}</h3>;
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-sm shadow-soft">
      <span className="text-xs font-semibold uppercase text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "todos" ? "Todos" : o}
          </option>
        ))}
      </select>
    </label>
  );
}
