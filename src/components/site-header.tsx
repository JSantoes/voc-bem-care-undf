import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

const navItems = [
  { to: "/", label: "Início" },
  { to: "/paciente", label: "Sou Paciente" },
  { to: "/profissional", label: "Sou Profissional" },
  { to: "/doar", label: "Doar" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span>
            Você<span className="text-primary">Bem</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-muted text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          to="/doar"
          className="hidden items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105 md:inline-flex"
        >
          <Heart className="h-4 w-4" fill="currentColor" />
          Doar agora
        </Link>
      </div>
    </header>
  );
}
