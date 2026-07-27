import { Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" fill="currentColor" />
            </span>
            Você<span className="text-primary">Bem</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Saúde mental e nutricional gratuita para quem mais precisa. Feito por voluntários,
            sustentado por doações.
          </p>
        </div>
        <div className="text-sm">
          <h4 className="mb-3 font-semibold">Plataforma</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Para Pacientes</li>
            <li>Para Profissionais</li>
            <li>Para Doadores</li>
            <li>Transparência</li>
          </ul>
        </div>
        <div className="text-sm">
          <h4 className="mb-3 font-semibold">Contato</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>contato@vocebem.org</li>
            <li>0800 000 0000</li>
            <li>São Paulo, Brasil</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VocêBem · CNPJ fictício para fins de demonstração
      </div>
    </footer>
  );
}
