// VIEW: PCD & PAE benefits monitoring table with privacy masking
import { useState } from "react";
import { Eye, EyeOff, Accessibility, BadgeCheck, Lock } from "lucide-react";
import type { Student } from "@/models/undf-data";
import { maskCpf, maskName } from "@/lib/mask";

export function PcdBenefitsTable({ students }: { students: Student[] }) {
  const [revealed, setRevealed] = useState(false);
  const [onlyPcd, setOnlyPcd] = useState(false);
  const list = students.filter((s) => (onlyPcd ? s.pcd : true));

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Monitoramento PCD e Benefícios PAE</h2>
          <p className="text-sm text-muted-foreground">
            Dados cruzados de acessibilidade e programas de assistência estudantil
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setOnlyPcd((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              onlyPcd
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/60 bg-card text-muted-foreground"
            }`}
          >
            <Accessibility className="h-3.5 w-3.5" />
            Somente PCD
          </button>
          <button
            onClick={() => setRevealed((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {revealed ? "Ocultar dados sensíveis" : "Revelar dados sensíveis"}
          </button>
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" /> Dados criptografados em trânsito e em repouso (AES-256
          simulado)
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Estudante</th>
                <th className="px-4 py-3">Matrícula</th>
                <th className="px-4 py-3">CPF</th>
                <th className="px-4 py-3">Curso / Turma</th>
                <th className="px-4 py-3">PCD</th>
                <th className="px-4 py-3">Benefícios PAE/UNDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {list.map((s) => (
                <tr key={s.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3 font-medium">{maskName(s.name, revealed)}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.matricula}</td>
                  <td className="px-4 py-3 font-mono text-xs">{maskCpf(s.cpf, revealed)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.course} · {s.turma}
                  </td>
                  <td className="px-4 py-3">
                    {s.pcd ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-chart-2/15 px-2 py-0.5 text-xs font-semibold text-chart-2">
                        <Accessibility className="h-3 w-3" />
                        {s.pcdType}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.benefits.length === 0 && (
                        <span className="text-xs text-muted-foreground">Sem benefícios</span>
                      )}
                      {s.benefits.map((b) => (
                        <span
                          key={b}
                          className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success"
                        >
                          <BadgeCheck className="h-3 w-3" />
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
