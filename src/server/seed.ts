// SERVER-ONLY: Seed data for the UNDF OrientaAI database.
// Idempotent — only populates when the tables are empty, so the on-disk SQLite
// file persists between restarts but can be recreated by deleting data/undf.sqlite.
import "@tanstack/react-start/server-only";
import type { Database as DB } from "better-sqlite3";
import type { Benefit, RiskLevel } from "@/models/undf-data";

// ---------------------------------------------------------------------------
// 1) Structural data: Schools -> Courses -> Subjects (real UNDF hierarchy)
// ---------------------------------------------------------------------------
type SchoolSeed = { id: string; code: string; name: string };
type CourseSeed = {
  id: string;
  school: string;
  name: string;
  subjects: { id: string; name: string; semester: string }[];
};

const SCHOOLS: SchoolSeed[] = [
  { id: "eema", code: "EEMA", name: "Escola de Educação, Magistério e Artes" },
  { id: "escs", code: "ESCS", name: "Escola Superior de Ciências da Saúde" },
  { id: "eseti", code: "ESETI", name: "Escola Superior de Engenharia, Tecnologia e Inovação" },
  { id: "esg", code: "ESG", name: "Escola Superior de Gestão" },
];

const COURSES: CourseSeed[] = [
  {
    id: "pedagogia",
    school: "eema",
    name: "Pedagogia",
    subjects: [
      { id: "ped-cd", name: "Culturas Digitais", semester: "2024.1" },
      { id: "ped-he", name: "História da Educação", semester: "2024.2" },
      { id: "ped-pp", name: "Políticas Públicas em Educação", semester: "2025.1" },
    ],
  },
  {
    id: "matematica",
    school: "eema",
    name: "Matemática",
    subjects: [
      { id: "mat-c1", name: "Cálculo Diferencial e Integral", semester: "2024.1" },
      { id: "mat-al", name: "Álgebra Linear", semester: "2024.2" },
    ],
  },
  {
    id: "medicina",
    school: "escs",
    name: "Medicina",
    subjects: [
      { id: "med-iem", name: "Introdução ao Estudo da Medicina", semester: "2024.1" },
      { id: "med-mb", name: "Metabolismo", semester: "2024.2" },
      { id: "med-mad", name: "Mecanismos de Agressão e Defesa", semester: "2025.1" },
    ],
  },
  {
    id: "enfermagem",
    school: "escs",
    name: "Enfermagem",
    subjects: [
      { id: "enf-fe", name: "Fundamentos de Enfermagem", semester: "2024.1" },
      { id: "enf-sc", name: "Saúde Coletiva", semester: "2024.2" },
    ],
  },
  {
    id: "ciencia-da-computacao",
    school: "eseti",
    name: "Ciência da Computação",
    subjects: [
      { id: "cc-eda", name: "Estruturas de Dados e Algoritmos Avançados", semester: "2024.1" },
      { id: "cc-ac", name: "Arquitetura de Computadores", semester: "2024.1" },
      { id: "cc-bd", name: "Banco de Dados", semester: "2024.2" },
      { id: "cc-es", name: "Engenharia de Software", semester: "2024.2" },
      { id: "cc-poo", name: "Programação Orientada a Objetos", semester: "2025.1" },
      { id: "cc-so", name: "Sistemas Operacionais", semester: "2025.1" },
    ],
  },
  {
    id: "sistemas-de-informacao",
    school: "eseti",
    name: "Sistemas de Informação",
    subjects: [
      { id: "si-es", name: "Engenharia de Software", semester: "2024.1" },
      { id: "si-bd", name: "Banco de Dados", semester: "2024.2" },
    ],
  },
  {
    id: "gestao-publica",
    school: "esg",
    name: "Gestão Pública",
    subjects: [
      { id: "gp-peo", name: "Planejamento Estratégico e Orçamento Público", semester: "2024.1" },
      { id: "gp-gpp", name: "Gestão de Políticas Públicas", semester: "2024.2" },
    ],
  },
  {
    id: "gestao-ti",
    school: "esg",
    name: "Gestão da Tecnologia da Informação",
    subjects: [
      { id: "gti-gp", name: "Gestão de Projetos", semester: "2024.1" },
      { id: "gti-gt", name: "Governança de TI", semester: "2024.2" },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2) Health professionals (psychologists / nutritionists)
// ---------------------------------------------------------------------------
const PROFESSIONALS = [
  {
    id: "pr1",
    name: "Dra. Ana Carolina Mendes",
    role: "Psicólogo(a)",
    crp: "CRP 01/12345",
    initials: "AM",
  },
  {
    id: "pr2",
    name: "Dr. Rafael Souza",
    role: "Psicólogo(a)",
    crp: "CRP 01/54321",
    initials: "RS",
  },
  { id: "pr3", name: "Dra. Beatriz Almeida", role: "Nutricionista", crp: null, initials: "BA" },
  { id: "pr4", name: "Dr. Marcos Lima", role: "Nutricionista", crp: null, initials: "ML" },
];

// ---------------------------------------------------------------------------
// 3) Deterministic helpers for student generation
// ---------------------------------------------------------------------------
const FIRST = [
  "Ana",
  "João",
  "Maria",
  "Pedro",
  "Beatriz",
  "Lucas",
  "Carla",
  "Rafael",
  "Júlia",
  "Mateus",
  "Larissa",
  "Bruno",
  "Sofia",
  "Heitor",
  "Helena",
  "Davi",
];
const LAST = [
  "Silva",
  "Souza",
  "Almeida",
  "Costa",
  "Pereira",
  "Ribeiro",
  "Ferreira",
  "Oliveira",
  "Martins",
  "Cardoso",
  "Rocha",
  "Nunes",
];
const TURMAS = ["2024.1", "2024.2", "2025.1"];
const PCD_TYPES = ["Auditiva", "Visual", "Motora", "TEA", "TDAH"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}

// Enrollment rule (regra de matrícula):
//  - NO "UNDF" prefix anywhere.
//  - Students entering in 2025 cohorts get a registration starting with "2024"
//    (e.g. 2024XXXX). Generalized as: the prefix is (cohortYear - 1).
function matriculaFor(turma: string, seq: number): string {
  const year = Number(turma.split(".")[0]);
  const prefix = year - 1; // 2025 -> 2024, 2024 -> 2023
  return `${prefix}${pad(seq, 4)}`;
}

function cpfFor(i: number): string {
  // Build a valid-looking 11-digit CPF, formatted as XXX.XXX.XXX-XX
  const base = `${pad(100 + i * 37, 3)}${pad(200 + i * 19, 3)}${pad(300 + i * 11, 3)}${pad((11 + i * 7) % 97, 2)}`;
  const d = base.slice(0, 11).padStart(11, "0");
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
}

function riskFor(attendance: number, gpa: number): RiskLevel {
  if (attendance < 70 || gpa < 5) return "alto";
  if (attendance < 80) return "medio";
  return "baixo";
}

function benefitsFor(i: number, pcd: boolean): Benefit[] {
  const b: Benefit[] = [];
  if (i % 3 === 0) b.push("Auxílio-Permanência");
  if (pcd) b.push("Auxílio PCD/Altas Habilidades");
  if (i % 5 === 0) b.push("Auxílio Saúde Mental");
  return b;
}

// ---------------------------------------------------------------------------
// 4) Seed entrypoint
// ---------------------------------------------------------------------------
// Bump this whenever the seed data changes so an existing local DB is rebuilt
// automatically (no need to delete data/undf.sqlite by hand).
const SEED_VERSION = 3;

export function runSeed(db: DB) {
  const stored = db.prepare("SELECT val FROM meta WHERE key = 'seed_version'").get() as
    { val: string } | undefined;
  const populated = (db.prepare("SELECT COUNT(*) AS n FROM schools").get() as { n: number }).n;

  // Already seeded with the current version → nothing to do.
  if (populated > 0 && stored?.val === String(SEED_VERSION)) return;

  // Outdated or empty: wipe everything and rebuild from scratch.
  if (populated > 0) {
    db.exec("PRAGMA foreign_keys = OFF");
    for (const t of [
      "grades",
      "appointments",
      "students",
      "subjects",
      "courses",
      "professionals",
      "schools",
      "meta",
    ]) {
      db.exec(`DELETE FROM ${t}`);
    }
    db.exec("PRAGMA foreign_keys = ON");
  }

  const tx = db.transaction(() => {
    const insSchool = db.prepare("INSERT INTO schools (id, code, name) VALUES (?, ?, ?)");
    SCHOOLS.forEach((s) => insSchool.run(s.id, s.code, s.name));

    const insCourse = db.prepare("INSERT INTO courses (id, school_id, name) VALUES (?, ?, ?)");
    const insSubject = db.prepare(
      "INSERT INTO subjects (id, course_id, name, semester) VALUES (?, ?, ?, ?)",
    );
    COURSES.forEach((c) => {
      insCourse.run(c.id, c.school, c.name);
      c.subjects.forEach((sub) => insSubject.run(sub.id, c.id, sub.name, sub.semester));
    });

    const insProf = db.prepare(
      "INSERT INTO professionals (id, name, role, crp, initials) VALUES (?, ?, ?, ?, ?)",
    );
    PROFESSIONALS.forEach((p) => insProf.run(p.id, p.name, p.role, p.crp, p.initials));

    const insStudent = db.prepare(`
      INSERT INTO students
        (id, name, email, cpf, matricula, course_id, turma, attendance, gpa, risk, pcd, pcd_type, benefits, is_current)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 4 students per course, spread across cohorts.
    let seq = 1;
    let studentCounter = 1;
    let currentStudentId: string | null = null;
    COURSES.forEach((course, courseIdx) => {
      for (let k = 0; k < 4; k++) {
        const i = studentCounter++;
        // Name must be unique across ALL courses so the same person isn't shown
        // enrolled in more than one course. Indexing both pools by the global
        // student index guarantees uniqueness: a collision would require
        // i ≡ i' (mod 16) AND i ≡ i' (mod 12), i.e. i ≡ i' (mod 48), which is
        // impossible for the 32 students seeded here.
        const name = `${pick(FIRST, i - 1)} ${pick(LAST, i - 1)}`;
        const turma = pick(TURMAS, i * 2 + k);
        const attendance = 55 + ((i * 13 + k * 5) % 45);
        const gpa = Math.round((4 + ((i * 7 + k * 3) % 60) / 10) * 10) / 10;
        const risk = riskFor(attendance, gpa);

        // Deliberately include TDAH and TEA profiles for the PCD support panel.
        let pcd = i % 5 === 0;
        let pcdType: string | null = null;
        if (pcd) pcdType = pick(PCD_TYPES, i + k);

        // Guarantee explicit TDAH and TEA examples exist in the dataset.
        if (courseIdx === 0 && k === 1) {
          pcd = true;
          pcdType = "TDAH";
        }
        if (courseIdx === 1 && k === 2) {
          pcd = true;
          pcdType = "TEA";
        }

        const benefits = benefitsFor(i, pcd);
        const email = `${name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, ".")}@undf.edu.br`;

        // Current (logged-in) student: a Ciência da Computação (ESETI) student.
        const isCurrent = course.id === "ciencia-da-computacao" && k === 0 ? 1 : 0;
        if (isCurrent) currentStudentId = `s${i}`;

        insStudent.run(
          `s${i}`,
          name,
          email,
          cpfFor(i),
          matriculaFor(turma, seq++),
          course.id,
          turma,
          attendance,
          gpa,
          risk,
          pcd ? 1 : 0,
          pcdType,
          JSON.stringify(benefits),
          isCurrent,
        );
      }
    });

    // Grades for the current student across multiple semesters (drives the
    // semester filter in the academic panel). course = ciencia-da-computacao.
    const insGrade = db.prepare(`
      INSERT INTO grades (student_id, subject_id, semester, grade, attendance)
      VALUES (?, ?, ?, ?, ?)
    `);
    // Each discipline appears in exactly ONE semester (no repeats across the
    // semester filter).
    const currentGrades: {
      subject: string;
      semester: string;
      grade: number;
      attendance: number;
    }[] = [
      { subject: "cc-eda", semester: "2024.1", grade: 9.1, attendance: 96 },
      { subject: "cc-ac", semester: "2024.1", grade: 8.4, attendance: 92 },
      { subject: "cc-bd", semester: "2024.2", grade: 7.2, attendance: 78 },
      { subject: "cc-es", semester: "2024.2", grade: 8.8, attendance: 90 },
      { subject: "cc-poo", semester: "2025.1", grade: 6.5, attendance: 71 },
      { subject: "cc-so", semester: "2025.1", grade: 8.0, attendance: 85 },
    ];
    currentGrades.forEach((g) =>
      insGrade.run(currentStudentId, g.subject, g.semester, g.grade, g.attendance),
    );

    // Seed appointments (note: stored in dd/mm to match the UI format).
    const insAppt = db.prepare(`
      INSERT INTO appointments (id, student_id, professional_id, date, time, modality, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insAppt.run(
      "a1",
      currentStudentId,
      "pr1",
      "28/07",
      "14:00",
      "Online (Google Meet)",
      "confirmado",
    );
    insAppt.run(
      "a2",
      currentStudentId,
      "pr3",
      "30/07",
      "09:30",
      "Presencial na UNDF",
      "confirmado",
    );

    db.prepare("INSERT INTO meta (key, val) VALUES ('seed_version', ?)").run(String(SEED_VERSION));
  });

  tx();
}
