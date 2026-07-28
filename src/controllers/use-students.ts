// CONTROLLER: filtering + metrics for the manager dashboard
import { useMemo } from "react";
import { students, evasionByCourse, type Course, type Turma } from "@/models/undf-data";

export function useFilteredStudents(course: Course | "todos", turma: Turma | "todos") {
  return useMemo(
    () =>
      students.filter(
        (s) => (course === "todos" || s.course === course) && (turma === "todos" || s.turma === turma),
      ),
    [course, turma],
  );
}

export function useEvasionMetrics(course: Course | "todos", turma: Turma | "todos") {
  const filtered = useFilteredStudents(course, turma);
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
