import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { RoleProvider, useRole } from "@/controllers/use-role";
import { EvasionDashboard } from "@/views/manager/EvasionDashboard";
import { PcdBenefitsTable } from "@/views/manager/PcdBenefitsTable";
import { ReportsModule } from "@/views/manager/ReportsModule";
import { AcademicPanel } from "@/views/student/AcademicPanel";
import { HealthScheduling } from "@/views/student/HealthScheduling";
import { PrivacyProfile } from "@/views/student/PrivacyProfile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrientaAI · Permanência estudantil na UNDF" },
      {
        name: "description",
        content:
          "Plataforma da Universidade do Distrito Federal (UNDF) para monitorar permanência, acessibilidade PCD, benefícios PAE e saúde estudantil.",
      },
      { property: "og:title", content: "OrientaAI · UNDF" },
      {
        property: "og:description",
        content: "MVP de dados de evasão, benefícios PAE e agendamento de saúde para estudantes da UNDF.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <RoleProvider>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          <RoleContent />
        </main>
        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          OrientaAI · Núcleo de Permanência Estudantil da UNDF · MVP demonstrativo
        </footer>
      </div>
    </RoleProvider>
  );
}

function RoleContent() {
  const { role } = useRole();
  if (role === "gestor") {
    return (
      <div className="space-y-10">
        <EvasionDashboard />
        <PcdBenefitsTable />
        <ReportsModule />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <PrivacyProfile />
      <AcademicPanel />
      <HealthScheduling />
    </div>
  );
}
