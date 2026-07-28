// MODEL: Domain types + fictitious UNDF data
export type Course = "Engenharia" | "Medicina" | "Direito" | "Pedagogia" | "Computação";
export type Turma = "2024.1" | "2024.2" | "2025.1";
export type RiskLevel = "baixo" | "medio" | "alto";
export type Benefit =
  | "Auxílio-Permanência"
  | "Auxílio PCD/Altas Habilidades"
  | "Auxílio Saúde Mental";

export type Student = {
  id: string;
  name: string;
  matricula: string;
  cpf: string; // sensitive
  email: string;
  course: Course;
  turma: Turma;
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
  date: string;
  time: string;
  modality: "Online (Google Meet)" | "Presencial na UNDF";
  status: "confirmado" | "pendente";
};

const first = ["Ana", "João", "Maria", "Pedro", "Beatriz", "Lucas", "Carla", "Rafael", "Júlia", "Mateus", "Larissa", "Bruno"];
const last = ["Silva", "Souza", "Almeida", "Costa", "Pereira", "Ribeiro", "Ferreira", "Oliveira", "Martins", "Cardoso"];
const courses: Course[] = ["Engenharia", "Medicina", "Direito", "Pedagogia", "Computação"];
const turmas: Turma[] = ["2024.1", "2024.2", "2025.1"];

function rnd<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const students: Student[] = Array.from({ length: 24 }).map((_, i) => {
  const name = `${rnd(first, i * 3)} ${rnd(last, i * 7 + 1)}`;
  const attendance = 55 + ((i * 13) % 45);
  const gpa = 4 + ((i * 7) % 60) / 10;
  const risk: RiskLevel = attendance < 70 || gpa < 5 ? "alto" : attendance < 80 ? "medio" : "baixo";
  const pcd = i % 6 === 0;
  const benefits: Benefit[] = [];
  if (i % 3 === 0) benefits.push("Auxílio-Permanência");
  if (pcd) benefits.push("Auxílio PCD/Altas Habilidades");
  if (i % 5 === 0) benefits.push("Auxílio Saúde Mental");
  return {
    id: `s${i + 1}`,
    name,
    matricula: `UNDF${2024000 + i}`,
    cpf: `${100 + i}.${200 + i}.${300 + i}-${(10 + i) % 99}`,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@undf.edu.br`,
    course: rnd(courses, i),
    turma: rnd(turmas, i * 2),
    attendance,
    gpa: Math.round(gpa * 10) / 10,
    risk,
    pcd,
    pcdType: pcd ? rnd(["Auditiva", "Visual", "Motora", "TEA"], i) : undefined,
    benefits,
  };
});

// Current student for the "Visão do Estudante"
export const currentStudent: Student = students[2];

export const professionals: Professional[] = [
  { id: "pr1", name: "Dra. Ana Carolina Mendes", role: "Psicólogo(a)", crp: "CRP 01/12345", initials: "AM" },
  { id: "pr2", name: "Dr. Rafael Souza", role: "Psicólogo(a)", crp: "CRP 01/54321", initials: "RS" },
  { id: "pr3", name: "Dra. Beatriz Almeida", role: "Nutricionista", initials: "BA" },
  { id: "pr4", name: "Dr. Marcos Lima", role: "Nutricionista", initials: "ML" },
];

export const initialAppointments: Appointment[] = [
  {
    id: "a1",
    studentId: currentStudent.id,
    professionalId: "pr1",
    date: "28/07",
    time: "16:00",
    modality: "Online (Google Meet)",
    status: "confirmado",
  },
  {
    id: "a2",
    studentId: currentStudent.id,
    professionalId: "pr3",
    date: "30/07",
    time: "10:30",
    modality: "Presencial na UNDF",
    status: "confirmado",
  },
];

// Aggregated metrics for manager dashboard
export function evasionByCourse(list: Student[]) {
  const map = new Map<Course, { curso: Course; alto: number; medio: number; baixo: number }>();
  for (const c of courses) map.set(c, { curso: c, alto: 0, medio: 0, baixo: 0 });
  list.forEach((s) => {
    const b = map.get(s.course)!;
    b[s.risk] += 1;
  });
  return Array.from(map.values());
}

export function attendanceTrend() {
  return [
    { mes: "Mar", frequencia: 88 },
    { mes: "Abr", frequencia: 85 },
    { mes: "Mai", frequencia: 82 },
    { mes: "Jun", frequencia: 78 },
    { mes: "Jul", frequencia: 74 },
  ];
}
