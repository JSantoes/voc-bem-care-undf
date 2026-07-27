import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, User, QrCode, Copy, Check, Shield, X, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { donationAllocation } from "@/lib/mock-data";

export const Route = createFileRoute("/doar")({
  head: () => ({
    meta: [
      { title: "Doe agora · VocêBem" },
      {
        name: "description",
        content: "Sua doação financia atendimentos gratuitos de psicologia e nutrição.",
      },
      { property: "og:title", content: "Doe e transforme vidas · VocêBem" },
    ],
  }),
  component: DonationPage,
});

const presets = [20, 50, 100];

function DonationPage() {
  const [tab, setTab] = useState<"pf" | "pj">("pf");
  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  const final = custom ? Number(custom) || 0 : amount;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Doação 100% destinada à causa
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
            Cada doação é uma <span className="text-primary">consulta possível</span>.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Pessoa física ou empresa, sua contribuição mantém a plataforma viva e gratuita.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                onClick={() => setTab("pf")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ${
                  tab === "pf" ? "bg-card shadow-soft" : "text-muted-foreground"
                }`}
              >
                <User className="h-4 w-4" /> Pessoa Física
              </button>
              <button
                onClick={() => setTab("pj")}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold ${
                  tab === "pj" ? "bg-card shadow-soft" : "text-muted-foreground"
                }`}
              >
                <Building2 className="h-4 w-4" /> Empresa · ESG
              </button>
            </div>

            <h2 className="mt-8 text-lg font-semibold">Escolha um valor</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {presets.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setAmount(v);
                    setCustom("");
                  }}
                  className={`rounded-2xl border-2 py-5 text-lg font-bold transition-colors ${
                    !custom && amount === v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-input bg-background hover:border-primary/40"
                  }`}
                >
                  R$ {v}
                </button>
              ))}
              <div
                className={`rounded-2xl border-2 px-3 py-3 transition-colors sm:col-span-1 ${
                  custom ? "border-primary bg-primary/10" : "border-input bg-background"
                }`}
              >
                <span className="block text-xs text-muted-foreground">Outro valor</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-semibold">R$</span>
                  <input
                    inputMode="numeric"
                    value={custom}
                    onChange={(e) => setCustom(e.target.value.replace(/\D/g, ""))}
                    placeholder="0"
                    className="w-full bg-transparent text-lg font-bold outline-none"
                  />
                </div>
              </div>
            </div>

            {tab === "pj" && (
              <div className="mt-6 space-y-4 rounded-2xl bg-muted/50 p-5">
                <Field label="Razão social">
                  <input className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2" placeholder="Empresa LTDA" />
                </Field>
                <Field label="CNPJ">
                  <input className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-primary/40 focus:ring-2" placeholder="00.000.000/0000-00" />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--color-primary)]" />
                  Receber relatório de impacto ESG mensal
                </label>
              </div>
            )}

            <label className="mt-6 flex items-center justify-between rounded-2xl border border-border/60 px-5 py-4">
              <div>
                <div className="font-semibold">Doação recorrente</div>
                <p className="text-sm text-muted-foreground">Repetir todo mês — cancele quando quiser.</p>
              </div>
              <button
                onClick={() => setRecurring((v) => !v)}
                className={`relative h-7 w-12 rounded-full transition-colors ${recurring ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-transform ${recurring ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </label>

            <button
              onClick={() => setShowQr(true)}
              disabled={!final}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              <QrCode className="h-5 w-5" />
              Doar R$ {final || 0} via Pix
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Shield className="mr-1 inline h-3 w-3" />
              Pagamento processado em ambiente seguro
            </p>
          </div>

          {/* Transparency */}
          <aside className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
            <h2 className="text-xl font-bold">Transparência</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Veja como cada real é aplicado para sustentar atendimentos gratuitos.
            </p>

            <div className="mt-6 space-y-4">
              {donationAllocation.map((a) => (
                <div key={a.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">{a.label}</span>
                    <span className="font-bold">{a.pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${a.pct}%`, background: a.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-primary/10 p-5 text-sm">
              <p className="font-semibold text-primary">Impacto da sua doação</p>
              <p className="mt-1 text-muted-foreground">
                R$ {final || 0} ≈{" "}
                <strong className="text-foreground">{Math.max(1, Math.floor((final || 0) / 20))}</strong>{" "}
                consulta(s) viabilizada(s).
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* PIX modal */}
      {showQr && (
        <div
          onClick={() => setShowQr(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 shadow-elegant"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">Pague com Pix</h3>
                <p className="text-sm text-muted-foreground">
                  R$ {final} · {recurring ? "Recorrente mensal" : "Doação única"}
                </p>
              </div>
              <button onClick={() => setShowQr(false)} className="rounded-full p-1.5 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center rounded-2xl bg-muted p-6">
              <MockQR />
            </div>

            <div className="mt-5">
              <label className="block text-xs font-semibold text-muted-foreground">PIX COPIA E COLA</label>
              <div className="mt-1.5 flex gap-2">
                <code className="flex-1 truncate rounded-xl bg-muted px-3 py-2.5 text-xs">
                  00020126360014BR.GOV.BCB.PIX0114vocebem@pix.org5204000053039865802BR
                </code>
                <button
                  onClick={() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              Após o pagamento, você receberá um comprovante no seu e-mail.
            </p>
          </div>
        </div>
      )}

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

function MockQR() {
  // Deterministic decorative QR-like grid
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const x = i % 21;
    const y = Math.floor(i / 21);
    const finder =
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    const innerFinder =
      (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
      (x >= 16 && x <= 18 && y >= 2 && y <= 4) ||
      (x >= 2 && x <= 4 && y >= 16 && y <= 18);
    const border =
      (x === 0 || x === 6 || y === 0 || y === 6) && x < 7 && y < 7;
    const border2 =
      (x === 14 || x === 20 || y === 0 || y === 6) && x > 13 && y < 7;
    const border3 =
      (x === 0 || x === 6 || y === 14 || y === 20) && x < 7 && y > 13;
    if (finder) return border || border2 || border3 || innerFinder;
    return (x * 7 + y * 13 + (x ^ y) * 5) % 3 === 0;
  });
  return (
    <div className="grid h-48 w-48 grid-cols-[repeat(21,1fr)] gap-px rounded-lg bg-background p-2">
      {cells.map((on, i) => (
        <div key={i} className={on ? "bg-foreground" : "bg-background"} />
      ))}
    </div>
  );
}
