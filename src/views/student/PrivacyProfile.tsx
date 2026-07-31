// VIEW: student profile card with simulated encryption of sensitive fields
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";
import type { Student } from "@/models/undf-data";
import { maskCpf, maskEmail, encryptedPreview } from "@/lib/mask";

export function PrivacyProfile({ student }: { student: Student | null }) {
  const [revealed, setRevealed] = useState(false);
  if (!student) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <p className="text-sm text-muted-foreground">Nenhum estudante ativo encontrado.</p>
      </section>
    );
  }
  const initials = student.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <section className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-card to-chart-2/10 p-6 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-foreground shadow-soft">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-primary">Bem-vindo(a) de volta</p>
            <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">
              {student.name}
            </h1>
            <p className="truncate text-sm text-muted-foreground">Matrícula {student.matricula}</p>
          </div>
        </div>
        <button
          onClick={() => setRevealed((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {revealed ? "Ocultar dados" : "Ver meus dados"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Field label="CPF" value={maskCpf(student.cpf, revealed)} />
        <Field label="E-mail institucional" value={maskEmail(student.email, revealed)} />
        <Field label="Token de sessão (AES-256)" value={encryptedPreview(student.matricula)} mono />
        <Field
          label="Prontuário médico"
          value={revealed ? "Consulte na área de saúde" : encryptedPreview(student.name)}
          mono
        />
      </div>

      <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 text-success" />
        Seus dados sensíveis são criptografados em conformidade com a LGPD.
      </p>
    </section>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/70 p-3">
      <p className="flex items-center gap-1 text-[10px] font-semibold uppercase text-muted-foreground">
        <KeyRound className="h-3 w-3" />
        {label}
      </p>
      <p className={`mt-1 text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</p>
    </div>
  );
}
