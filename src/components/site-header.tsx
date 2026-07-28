import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { useRole } from "@/controllers/use-role";

export function SiteHeader() {
  const { role, setRole } = useRole();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 md:flex md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-black tracking-tight">
              Orienta<span className="text-primary">AI</span>
            </p>
            <p className="truncate text-xs text-muted-foreground">Universidade do Distrito Federal · UNDF</p>
          </div>
        </div>
        <div className="col-span-2 flex justify-center md:col-span-1 md:justify-end">
          <div
            role="tablist"
            aria-label="Alternar visão"
            className="inline-flex items-center rounded-full border border-border/60 bg-muted/60 p-1 shadow-inner"
          >
            <RoleBtn active={role === "estudante"} onClick={() => setRole("estudante")}>
              <GraduationCap className="h-4 w-4" />
              Visão do Estudante
            </RoleBtn>
            <RoleBtn active={role === "gestor"} onClick={() => setRole("gestor")}>
              <ShieldCheck className="h-4 w-4" />
              Visão do Gestor
            </RoleBtn>
          </div>
        </div>
      </div>
    </header>
  );
}

function RoleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all sm:px-4 sm:text-sm ${
        active
          ? "bg-card text-foreground shadow-soft ring-1 ring-primary/30"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
