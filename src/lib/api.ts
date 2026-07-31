// SERVER FUNCTIONS (RPC bridge): the only entry point client code uses to reach
// the SQLite layer. This file is intentionally OUTSIDE src/server/ because the
// Lovable import-protection rule denies client imports of **/server/**. The
// createServerFn handlers run exclusively on the server; on the client these
// are compiled to lightweight RPC stubs, so the protected src/server/* imports
// never enter the client bundle.
import { createServerFn } from "@tanstack/react-start";
import {
  AppointmentConflictError,
  createAppointment,
  getAppointments,
  getCourses,
  getCurrentStudent,
  getProfessionals,
  getSchools,
  getStudentGrades,
  getStudents,
  getSubjects,
  type NewAppointmentInput,
} from "@/server/queries";
import type {
  Appointment,
  Course,
  Professional,
  School,
  Student,
  StudentGrade,
  Subject,
} from "@/models/undf-data";

export type DashboardData = {
  schools: School[];
  courses: Course[];
  subjects: Subject[];
  professionals: Professional[];
  students: Student[];
  currentStudent: Student | null;
  currentGrades: StudentGrade[];
  currentAppointments: Appointment[];
};

// Single server round-trip that hydrates the whole app from the database.
export const fetchDashboardData = createServerFn({ method: "GET" }).handler(
  async (): Promise<DashboardData> => {
    const currentStudent = getCurrentStudent();
    return {
      schools: getSchools(),
      courses: getCourses(),
      subjects: getSubjects(),
      professionals: getProfessionals(),
      students: getStudents(),
      currentStudent,
      currentGrades: currentStudent ? getStudentGrades(currentStudent.id) : [],
      currentAppointments: currentStudent ? getAppointments(currentStudent.id) : [],
    };
  },
);

export const createAppointmentFn = createServerFn({ method: "POST" })
  .validator((input: NewAppointmentInput) => input)
  .handler(async ({ data }): Promise<Appointment> => {
    try {
      return createAppointment(data);
    } catch (err) {
      if (err instanceof AppointmentConflictError) throw err;
      throw new Error("Não foi possível agendar a consulta. Tente novamente.");
    }
  });
