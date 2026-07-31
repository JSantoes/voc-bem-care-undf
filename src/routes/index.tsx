import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { RoleProvider, useRole } from "@/controllers/use-role";
import { ALL, filterStudents, type Filters } from "@/controllers/use-students";
import { EvasionDashboard } from "@/views/manager/EvasionDashboard";
import { PcdBenefitsTable } from "@/views/manager/PcdBenefitsTable";
import { ReportsModule } from "@/views/manager/ReportsModule";
import { AcademicPanel } from "@/views/student/AcademicPanel";
import { HealthScheduling } from "@/views/student/HealthScheduling";
import { PrivacyProfile } from "@/views/student/PrivacyProfile";
import { fetchDashboardData, type DashboardData } from "@/lib/api";

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
        content:
          "MVP de dados de evasão, benefícios PAE e agendamento de saúde para estudantes da UNDF.",
      },
    ],
  }),
  // Runs on the server: hydrates the whole app from SQLite in one round-trip.
  loader: async () => await fetchDashboardData(),
  component: HomePage,
});

function HomePage() {
  const data = Route.useLoaderData() as DashboardData;
  return (
    <RoleProvider>
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
          <RoleContent data={data} />
        </main>
        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          OrientaAI · Núcleo de Permanência Estudantil da UNDF · MVP demonstrativo
        </footer>
      </div>
    </RoleProvider>
  );
}

function RoleContent({ data }: { data: DashboardData }) {
  const { role } = useRole();
  // The manager filter (Escola/Curso/Turma) is shared between the dashboard and
  // the PCD/benefits table so the student list respects the same filters.
  const [filters, setFilters] = useState<Filters>({ school: ALL, course: ALL, turma: ALL });
  const filteredStudents = filterStudents(data.students, filters);

  if (role === "gestor") {
    return (
      <div className="space-y-10">
        <EvasionDashboard
          schools={data.schools}
          courses={data.courses}
          students={data.students}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <PcdBenefitsTable students={filteredStudents} />
        <ReportsModule schools={data.schools} courses={data.courses} students={data.students} />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <PrivacyProfile student={data.currentStudent} />
      <AcademicPanel student={data.currentStudent} grades={data.currentGrades} />
      <HealthScheduling
        student={data.currentStudent}
        professionals={data.professionals}
        appointments={data.currentAppointments}
      />
    </div>
  );
}
