import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/cadastro/paciente")({
  head: () => ({
    meta: [
      { title: "Cadastro de Paciente · VocêBem" },
      { name: "description", content: "Cadastre-se e valide sua elegibilidade via Gov.br / CadÚnico." },
    ],
  }),
  component: PatientSignup,
});

type Status = "form" | "validating" | "validated";

function PatientSignup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("form");
  const [form, setForm] = useState({ name: "", cpf: "", email: "" });

  const onValidate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("validating");
    setTimeout(() => setStatus("validated"), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Paciente</h1>
          <p className="mt-2 text-muted-foreground">
            Validamos sua elegibilidade de forma segura pelo Gov.br / CadÚnico.
          </p>

          {status !== "validated" && (
            <form onSubmit={onValidate} className="mt-8 space-y-5">
              <Field label="Nome completo">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 transition-shadow focus:ring-2"
                  placeholder="Maria da Silva"
                />
              </Field>
              <Field label="CPF">
                <input
                  required
                  value={form.cpf}
                  onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 transition-shadow focus:ring-2"
                  placeholder="000.000.000-00"
                />
              </Field>
              <Field label="E-mail">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 transition-shadow focus:ring-2"
                  placeholder="voce@email.com"
                />
              </Field>

              <button
                type="submit"
                disabled={status === "validating"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-[1.01] disabled:opacity-70"
              >
                {status === "validating" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Validando com Gov.br…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Validar com Gov.br / CadÚnico
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Conexão criptografada · Seus dados são usados apenas para verificar elegibilidade.
              </p>
            </form>
          )}

          {status === "validated" && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl border border-success/40 bg-success/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground">
                    <Check className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Validação concluída</div>
                    <div className="text-sm text-muted-foreground">
                      Você está elegível para atendimento gratuito pela VocêBem.
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate({ to: "/paciente" })}
                className="w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground"
              >
                Ir para meu painel
              </button>
              <Link
                to="/"
                className="block text-center text-sm text-muted-foreground hover:text-foreground"
              >
                Voltar para o início
              </Link>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
