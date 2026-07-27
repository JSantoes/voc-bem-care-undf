import { useEffect, useRef, useState } from "react";

export function ImpactCounter({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border/60 bg-card p-6 text-center shadow-soft"
    >
      <div className="text-4xl font-bold tracking-tight text-primary">
        {n.toLocaleString("pt-BR")}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
