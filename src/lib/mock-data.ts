export type Professional = {
  id: string;
  name: string;
  specialty: "Psicólogo(a)" | "Nutricionista";
  focus: string;
  initials: string;
  nextSlot: string;
  rating: number;
};

export type Appointment = {
  id: string;
  professionalId: string;
  professionalName: string;
  specialty: string;
  patientName: string;
  date: string;
  time: string;
};

export const professionals: Professional[] = [
  {
    id: "p1",
    name: "Dra. Ana Carolina Mendes",
    specialty: "Psicólogo(a)",
    focus: "Ansiedade · Terapia Cognitivo-Comportamental",
    initials: "AM",
    nextSlot: "Hoje, 16:00",
    rating: 4.9,
  },
  {
    id: "p2",
    name: "Dr. Rafael Souza",
    specialty: "Psicólogo(a)",
    focus: "Depressão · Adultos",
    initials: "RS",
    nextSlot: "Amanhã, 09:30",
    rating: 4.8,
  },
  {
    id: "p3",
    name: "Dra. Beatriz Almeida",
    specialty: "Nutricionista",
    focus: "Nutrição clínica · Diabetes",
    initials: "BA",
    nextSlot: "Hoje, 18:30",
    rating: 5.0,
  },
  {
    id: "p4",
    name: "Dr. Lucas Pereira",
    specialty: "Nutricionista",
    focus: "Reeducação alimentar",
    initials: "LP",
    nextSlot: "Quinta, 14:00",
    rating: 4.7,
  },
  {
    id: "p5",
    name: "Dra. Camila Rocha",
    specialty: "Psicólogo(a)",
    focus: "Luto · Acompanhamento familiar",
    initials: "CR",
    nextSlot: "Sexta, 10:00",
    rating: 4.9,
  },
  {
    id: "p6",
    name: "Dr. Felipe Nogueira",
    specialty: "Nutricionista",
    focus: "Esportiva · Vegetarianismo",
    initials: "FN",
    nextSlot: "Sábado, 11:00",
    rating: 4.8,
  },
];

export const upcomingAppointments: Appointment[] = [
  {
    id: "a1",
    professionalId: "p1",
    professionalName: "Dra. Ana Carolina Mendes",
    specialty: "Psicóloga",
    patientName: "Maria S.",
    date: "Hoje",
    time: "16:00",
  },
  {
    id: "a2",
    professionalId: "p3",
    professionalName: "Dra. Beatriz Almeida",
    specialty: "Nutricionista",
    patientName: "João P.",
    date: "Amanhã",
    time: "18:30",
  },
  {
    id: "a3",
    professionalId: "p2",
    professionalName: "Dr. Rafael Souza",
    specialty: "Psicólogo",
    patientName: "Carla T.",
    date: "23/06",
    time: "09:30",
  },
];

export const impactMetrics = {
  atendimentos: 1528,
  profissionais: 87,
  doadores: 412,
  cidades: 64,
};

export const donationAllocation = [
  { label: "Infraestrutura em nuvem", pct: 40, color: "var(--color-chart-1)" },
  { label: "Plataforma e tecnologia", pct: 25, color: "var(--color-chart-2)" },
  { label: "Suporte aos profissionais", pct: 20, color: "var(--color-chart-3)" },
  { label: "Operação e administração", pct: 15, color: "var(--color-chart-4)" },
];
