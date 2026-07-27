import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, MicOff, Video, VideoOff, MessageSquare, PhoneOff, Lock } from "lucide-react";

export const Route = createFileRoute("/consulta/$id")({
  head: () => ({
    meta: [
      { title: "Sala de Atendimento · VocêBem" },
      { name: "description", content: "Consulta online segura e gratuita." },
    ],
  }),
  component: TeleRoom,
});

function TeleRoom() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const end = () => {
    setToast("Sessão encerrada com segurança");
    setTimeout(() => navigate({ to: "/paciente" }), 900);
  };

  return (
    <div className="flex h-screen flex-col bg-foreground text-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-background/10 px-6 py-3 text-sm">
        <div className="flex items-center gap-2 font-semibold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          AO VIVO · 00:12:45
        </div>
        <div className="flex items-center gap-2 text-background/70">
          <Lock className="h-3.5 w-3.5" />
          Conexão criptografada de ponta a ponta
        </div>
      </header>

      {/* Stage */}
      <main className="relative flex-1 overflow-hidden">
        {/* Main video (professional) */}
        <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary/40 via-foreground to-secondary/30">
          <div className="text-center">
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-primary/30 text-5xl font-bold text-background backdrop-blur-md">
              AM
            </div>
            <p className="mt-5 text-xl font-semibold">Dra. Ana Carolina Mendes</p>
            <p className="text-sm text-background/70">Psicóloga · falando…</p>
          </div>
        </div>

        {/* PiP (patient) */}
        <div className="absolute bottom-8 right-8 h-44 w-64 overflow-hidden rounded-2xl border-2 border-background/20 bg-background/10 shadow-2xl backdrop-blur-md">
          {camOff ? (
            <div className="flex h-full flex-col items-center justify-center text-background/70">
              <VideoOff className="h-8 w-8" />
              <span className="mt-2 text-xs">Câmera desligada</span>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-secondary/40 to-primary/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/60 text-2xl font-bold">
                MS
              </div>
            </div>
          )}
          <span className="absolute bottom-2 left-2 rounded-md bg-foreground/60 px-2 py-0.5 text-xs">
            Você {muted && "· 🔇"}
          </span>
        </div>

        {/* Side chat panel */}
        {showChat && (
          <aside className="absolute right-8 top-8 bottom-56 w-80 rounded-2xl border border-background/15 bg-background/10 p-4 backdrop-blur-md">
            <h3 className="text-sm font-semibold">Anotações da sessão</h3>
            <textarea
              placeholder="Pontos importantes…"
              className="mt-3 h-48 w-full rounded-xl border border-background/20 bg-foreground/40 p-3 text-sm text-background placeholder:text-background/50 outline-none focus:border-primary"
            />
            <p className="mt-3 text-xs text-background/60">
              <Lock className="mr-1 inline h-3 w-3" />
              Visível apenas para o profissional. Criptografado.
            </p>
          </aside>
        )}
      </main>

      {/* Controls */}
      <footer className="flex items-center justify-center gap-3 border-t border-background/10 px-6 py-5">
        <ControlBtn active={!muted} onClick={() => setMuted((v) => !v)} label={muted ? "Ativar áudio" : "Mutar"}>
          {muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </ControlBtn>
        <ControlBtn active={!camOff} onClick={() => setCamOff((v) => !v)} label={camOff ? "Ligar câmera" : "Desligar câmera"}>
          {camOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </ControlBtn>
        <ControlBtn active={showChat} onClick={() => setShowChat((v) => !v)} label="Anotações">
          <MessageSquare className="h-5 w-5" />
        </ControlBtn>
        <button
          onClick={end}
          className="ml-2 inline-flex items-center gap-2 rounded-full bg-destructive px-6 py-3.5 font-semibold text-destructive-foreground shadow-elegant transition-transform hover:scale-105"
        >
          <PhoneOff className="h-5 w-5" />
          Encerrar Sessão
        </button>
      </footer>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-elegant">
          {toast}
        </div>
      )}
    </div>
  );
}

function ControlBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
        active ? "bg-background/15 text-background hover:bg-background/25" : "bg-background text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
