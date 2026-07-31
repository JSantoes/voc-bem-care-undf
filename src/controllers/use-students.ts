// CONTROLLER: filtering + metrics for the manager dashboard.
// Data is passed in from the route loader (sourced from SQLite); this file is
// pure presentation logic and holds no data of its own.
import { useMemo } from "react";
import { evasionByCourse, type Student } from "@/models/undf-data";

export const ALL = "todos";

export type Filters = {
  school: string; // schoolId | "todos"
  course: string; // courseId | "todos"
  turma: string; // turma | "todos"
};

export function filterStudents(students: Student[], f: Filters): Student[] {
  return students.filter(
    (s) =>
      (f.school === ALL || s.schoolId === f.school) &&
      (f.course === ALL || s.courseId === f.course) &&
      (f.turma === ALL || s.turma === f.turma),
  );
}

export function useEvasionMetrics(students: Student[], f: Filters) {
  const filtered = useMemo(() => filterStudents(students, f), [students, f]);
  return useMemo(() => {
    const total = filtered.length || 1;
    const alto = filtered.filter((s) => s.risk === "alto").length;
    const medio = filtered.filter((s) => s.risk === "medio").length;
    const baixo = filtered.filter((s) => s.risk === "baixo").length;
    const pcd = filtered.filter((s) => s.pcd).length;
    const beneficiados = filtered.filter((s) => s.benefits.length > 0).length;
    const avgAttendance = Math.round(filtered.reduce((a, s) => a + s.attendance, 0) / total);
    return {
      filtered,
      total: filtered.length,
      alto,
      medio,
      baixo,
      pcd,
      beneficiados,
      avgAttendance,
      byCourse: evasionByCourse(filtered),
      riskShare: [
        { name: "Alto risco", value: alto, key: "alto" },
        { name: "Médio risco", value: medio, key: "medio" },
        { name: "Baixo risco", value: baixo, key: "baixo" },
      ],
    };
  }, [filtered]);
}
