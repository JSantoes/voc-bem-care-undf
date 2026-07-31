// Client-side PDF report generation (jsPDF). Builds a clean, branded document
// from already-filtered data coming from the database.
import { jsPDF } from "jspdf";

export type ReportScope = {
  school: string; // display label
  course: string; // display label
  turma: string; // display label
};

export type ReportStats = {
  total: number;
  alto: number;
  pctAlto: number;
  avgAttendance: number;
  avgGpa: number;
  pcd: number;
  beneficiados: number;
  recommendation: string;
};

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

export function generateReportPdf(scope: ReportScope, stats: ReportStats) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = 24;

  // Header band
  doc.setFillColor(50, 109, 178); // UNDF institutional blue
  doc.rect(0, 0, PAGE_W, 14, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("OrientaAI · Universidade do Distrito Federal (UNDF)", MARGIN, 9.5);

  // Title
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  y = wrap(doc, "Relatório de Permanência Estudantil", MARGIN, y, CONTENT_W, 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(90, 90, 90);
  y += 1;
  y = wrap(
    doc,
    `Escola: ${scope.school}   |   Curso: ${scope.course}   |   Turma: ${scope.turma}`,
    MARGIN,
    y,
    CONTENT_W,
    6,
  );
  y = wrap(
    doc,
    `Gerado em ${new Date().toLocaleString("pt-BR")} · Fonte: banco de dados OrientaAI (tempo real)`,
    MARGIN,
    y + 1,
    CONTENT_W,
    6,
  );

  // Divider
  y += 4;
  doc.setDrawColor(210, 215, 220);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 8;

  // Stats grid (2 columns)
  const rows: Array<[string, string]> = [
    ["Estudantes analisados", String(stats.total)],
    ["Frequência média", `${stats.avgAttendance}%`],
    ["Nota média (0–10)", stats.avgGpa.toFixed(1)],
    ["Alto risco de evasão", `${stats.alto} (${stats.pctAlto}%)`],
    ["Estudantes PCD", String(stats.pcd)],
    ["Contemplados PAE", String(stats.beneficiados)],
  ];

  const colW = CONTENT_W / 2;
  const rowH = 14;
  doc.setFontSize(10);
  rows.forEach((r, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = MARGIN + col * colW;
    const ry = y + row * rowH;
    doc.setFillColor(246, 248, 250);
    doc.roundedRect(x + 1, ry, colW - 4, rowH - 3, 2, 2, "F");
    doc.setTextColor(110, 116, 124);
    doc.setFont("helvetica", "bold");
    doc.text(r[0].toUpperCase(), x + 4, ry + 5);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13);
    doc.text(r[1], x + 4, ry + 10.5);
    doc.setFontSize(10);
  });
  y += Math.ceil(rows.length / 2) * rowH + 4;

  // Recommendation
  doc.setDrawColor(210, 215, 220);
  doc.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Recomendação", MARGIN, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(70, 70, 70);
  y = wrap(doc, stats.recommendation, MARGIN, y, CONTENT_W, 5.5);

  // Footer
  doc.setDrawColor(210, 215, 220);
  doc.line(MARGIN, PAGE_H - 16, PAGE_W - MARGIN, PAGE_H - 16);
  doc.setFontSize(8.5);
  doc.setTextColor(140, 145, 150);
  doc.text(
    "OrientaAI · Núcleo de Permanência Estudantil da UNDF · Documento gerado automaticamente (MVP demonstrativo).",
    MARGIN,
    PAGE_H - 11,
  );

  doc.save(`relatorio-orientaai-${Date.now()}.pdf`);
}

// Word-wrapped text helper that advances the y cursor.
function wrap(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const lines = doc.splitTextToSize(text, maxW) as string[];
  lines.forEach((ln) => {
    doc.text(ln, x, y);
    y += lineH;
  });
  return y;
}
