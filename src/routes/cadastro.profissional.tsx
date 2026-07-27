import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Loader2, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/cadastro/profissional")({
  head: () => ({
    meta: [
      { title: "Cadastro de Profissional · VocêBem" },
      { name: "description", content: "Volunteer como psicólogo ou nutricionista. Valide seu CRP/CRN." },
    ],
  }),
  component: ProSignup,
});

type Status = "form" | "validating" | "validated";

function ProSignup() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("form");
  const [specialty, setSpecialty] = useState<"Psicólogo(a)" | "Nutricionista">("Psicólogo(a)");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Profissional</h1>
          <p className="mt-2 text-muted-foreground">
            Obrigado por dedicar parte do seu tempo. Vamos validar seu registro profissional.
          </p>

          {status !== "validated" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStatus("validating");
                setTimeout(() => setStatus("validated"), 1800);
              }}
              className="mt-8 space-y-5"
            >
              <Field label="Nome completo">
                <input
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 focus:ring-2"
                  placeholder="Dr(a). Nome Sobrenome"
                />
              </Field>
              <Field label="Especialidade">
                <div className="grid grid-cols-2 gap-3">
                  {(["Psicólogo(a)", "Nutricionista"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpecialty(s)}
                      className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                        specialty === s
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-input bg-background text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={specialty === "Psicólogo(a)" ? "Registro CRP" : "Registro CRN"}>
                <input
                  required
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 focus:ring-2"
                  placeholder={specialty === "Psicólogo(a)" ? "CRP 06/12345" : "CRN-3 12345"}
                />
              </Field>
              <Field label="E-mail profissional">
                <input
                  required
                  type="email"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none ring-primary/40 focus:ring-2"
                  placeholder="voce@clinica.com"
                />
              </Field>

              <button
                type="submit"
                disabled={status === "validating"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-semibold text-primary-foreground shadow-soft disabled:opacity-70"
              >
                {status === "validating" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Validando registro…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Validar Registro
                  </>
                )}
              </button>
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
                    <div className="font-semibold">Registro validado</div>
                    <div className="text-sm text-muted-foreground">
                      Bem-vindo(a) à rede de voluntários VocêBem.
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate({ to: "/profissional" })}
                className="w-full rounded-full bg-primary py-3.5 font-semibold text-primary-foreground"
              >
                Ir para meu painel
              </button>
              <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
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
