// SERVER-ONLY: typed queries over the SQLite database.
import "@tanstack/react-start/server-only";
import { getDb } from "./db";
import type {
  Appointment,
  Benefit,
  Course,
  Professional,
  RiskLevel,
  School,
  Student,
  StudentGrade,
  Subject,
} from "@/models/undf-data";

type StudentRow = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  matricula: string;
  turma: string;
  attendance: number;
  gpa: number;
  risk: RiskLevel;
  pcd: number;
  pcd_type: string | null;
  benefits: string | null;
  course_id: string;
  course_name: string;
  school_id: string;
};

function mapStudent(r: StudentRow): Student {
  let benefits: Benefit[] = [];
  try {
    benefits = r.benefits ? (JSON.parse(r.benefits) as Benefit[]) : [];
  } catch {
    benefits = [];
  }
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    cpf: r.cpf,
    matricula: r.matricula,
    courseId: r.course_id,
    course: r.course_name,
    schoolId: r.school_id,
    school: "",
    turma: r.turma,
    attendance: r.attendance,
    gpa: r.gpa,
    risk: r.risk,
    pcd: r.pcd === 1,
    pcdType: r.pcd_type ?? undefined,
    benefits,
  };
}

const STUDENT_JOIN = `
  SELECT s.*, c.id AS course_id, c.name AS course_name, c.school_id
  FROM students s
  JOIN courses c ON c.id = s.course_id
`;

const SCHOOL_BY_ID = new Map<string, School>();

export function getSchools(): School[] {
  if (SCHOOL_BY_ID.size === 0) {
    const rows = getDb().prepare("SELECT * FROM schools ORDER BY code").all() as School[];
    rows.forEach((s) => SCHOOL_BY_ID.set(s.id, s));
  }
  return Array.from(SCHOOL_BY_ID.values());
}

export function getCourses(): Course[] {
  return getDb()
    .prepare("SELECT id, school_id AS schoolId, name FROM courses ORDER BY name")
    .all() as Course[];
}

export function getSubjects(): Subject[] {
  return getDb()
    .prepare(
      "SELECT id, course_id AS courseId, name, semester FROM subjects ORDER BY semester, name",
    )
    .all() as Subject[];
}

export function getProfessionals(): Professional[] {
  const rows = getDb().prepare("SELECT * FROM professionals ORDER BY role, name").all() as Array<
    Omit<Professional, "crp"> & { crp: string | null }
  >;
  return rows.map((r) => ({ ...r, crp: r.crp ?? undefined }));
}

export function getStudents(): Student[] {
  const schools = getSchools();
  const rows = getDb().prepare(`${STUDENT_JOIN} ORDER BY s.name`).all() as StudentRow[];
  return rows.map((r) => {
    const s = mapStudent(r);
    s.school = schools.find((x) => x.id === r.school_id)?.name ?? "";
    return s;
  });
}

export function getCurrentStudent(): Student | null {
  const schools = getSchools();
  const row = getDb().prepare(`${STUDENT_JOIN} WHERE s.is_current = 1 LIMIT 1`).get() as
    StudentRow | undefined;
  if (!row) return null;
  const s = mapStudent(row);
  s.school = schools.find((x) => x.id === row.school_id)?.name ?? "";
  return s;
}

export function getStudentGrades(studentId: string): StudentGrade[] {
  const rows = getDb()
    .prepare(
      `SELECT g.subject_id AS subjectId, sub.name AS subject, g.semester, g.grade, g.attendance
       FROM grades g
       JOIN subjects sub ON sub.id = g.subject_id
       WHERE g.student_id = ?
       ORDER BY g.semester, sub.name`,
    )
    .all(studentId) as StudentGrade[];
  return rows;
}

export function getAppointments(studentId: string): Appointment[] {
  return getDb()
    .prepare(
      `SELECT id, student_id AS studentId, professional_id AS professionalId,
              date, time, modality, status
       FROM appointments
       WHERE student_id = ?
       ORDER BY date DESC, time DESC`,
    )
    .all(studentId) as Appointment[];
}

export type NewAppointmentInput = {
  studentId: string;
  professionalId: string;
  date: string;
  time: string;
  modality: Appointment["modality"];
};

export class AppointmentConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppointmentConflictError";
  }
}

export function createAppointment(input: NewAppointmentInput): Appointment {
  const db = getDb();
  // Normalize the date to dd/mm to match seeded records.
  const normalizedDate = normalizeDate(input.date);

  // Conflict prevention: same professional + same day + same time slot.
  const clash = db
    .prepare(
      "SELECT 1 FROM appointments WHERE professional_id = ? AND date = ? AND time = ? LIMIT 1",
    )
    .get(input.professionalId, normalizedDate, input.time);
  if (clash) {
    throw new AppointmentConflictError(
      "Já existe uma consulta agendada com este profissional neste dia e horário. Escolha outro horário ou data.",
    );
  }

  const id = `a${Date.now()}`;
  const appt: Appointment = {
    id,
    studentId: input.studentId,
    professionalId: input.professionalId,
    date: normalizedDate,
    time: input.time,
    modality: input.modality,
    status: "confirmado",
  };

  db.prepare(
    `INSERT INTO appointments (id, student_id, professional_id, date, time, modality, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    appt.id,
    appt.studentId,
    appt.professionalId,
    appt.date,
    appt.time,
    appt.modality,
    appt.status,
  );

  return appt;
}

// Accepts both ISO (yyyy-mm-dd) and already-formatted (dd/mm) dates.
function normalizeDate(date: string): string {
  if (date.includes("/")) return date;
  const [, m, d] = date.split("-");
  return `${d}/${m}`;
}
