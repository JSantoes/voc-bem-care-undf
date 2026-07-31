// MODEL: Domain types + pure helpers.
// Data itself now lives in SQLite (see src/server/). This file only holds the
// shared types and pure functions that operate on already-loaded data.
export type RiskLevel = "baixo" | "medio" | "alto";
export type Benefit =
  "Auxílio-Permanência" | "Auxílio PCD/Altas Habilidades" | "Auxílio Saúde Mental";

export type School = { id: string; code: string; name: string };
export type Course = { id: string; schoolId: string; name: string };
export type Subject = { id: string; courseId: string; name: string; semester: string };

export type Student = {
  id: string;
  name: string;
  matricula: string;
  cpf: string;
  email: string;
  courseId: string;
  course: string;
  schoolId: string;
  school: string;
  turma: string;
  attendance: number; // %
  gpa: number; // 0-10
  risk: RiskLevel;
  pcd: boolean;
  pcdType?: string;
  benefits: Benefit[];
};

export type Professional = {
  id: string;
  name: string;
  role: "Psicólogo(a)" | "Nutricionista";
  crp?: string;
  initials: string;
};

export type Appointment = {
  id: string;
  studentId: string;
  professionalId: string;
  date: string; // dd/mm
  time: string; // HH:mm
  modality: "Online (Google Meet)" | "Presencial na UNDF";
  status: "confirmado" | "pendente";
};

export type StudentGrade = {
  subjectId: string;
  subject: string;
  semester: string;
  grade: number;
  attendance: number;
};

// "Todos" sentinel for filter dropdowns.
export const ALL = "todos" as const;
export type FilterValue = string;

// Aggregate risk counts per course for the stacked bar chart.
export function evasionByCourse(list: Student[]) {
  const order: string[] = [];
  const map = new Map<string, { curso: string; alto: number; medio: number; baixo: number }>();
  for (const s of list) {
    if (!map.has(s.course)) {
      map.set(s.course, { curso: s.course, alto: 0, medio: 0, baixo: 0 });
      order.push(s.course);
    }
    map.get(s.course)![s.risk] += 1;
  }
  return order.map((c) => map.get(c)!);
}

// Static semester frequency trend (institutional KPI, not student-specific).
export function attendanceTrend() {
  return [
    { mes: "Mar", frequencia: 88 },
    { mes: "Abr", frequencia: 85 },
    { mes: "Mai", frequencia: 82 },
    { mes: "Jun", frequencia: 78 },
    { mes: "Jul", frequencia: 74 },
  ];
}
