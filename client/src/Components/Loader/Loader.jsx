import { useEffect, useState, useCallback } from "react";

const LABELS = ["Initializing", "Loading core", "Building assets", "Almost done", "Ready"];

function useISTClock() {
  const [time, setTime] = useState({ clock: "--:--:--", date: "--- -- ----" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 19800000);
      const p = (v) => String(v).padStart(2, "0");
      const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      setTime({
        clock: `${p(ist.getHours())}:${p(ist.getMinutes())}:${p(ist.getSeconds())}`,
        date: `${days[ist.getDay()]} ${p(ist.getDate())} ${months[ist.getMonth()]} ${ist.getFullYear()}`,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Loader({ onLoadComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("loading"); // "loading" | "done"
  const { clock, date } = useISTClock();

  const pct = Math.floor(Math.min(progress, 100));
  const labelIdx = Math.min(Math.floor(pct / 25), 4);

  // Smooth slow progress — eased increments
  useEffect(() => {
    if (phase !== "loading") return;
    const id = setTimeout(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPhase("done");
          return 100;
        }
        // Slow down as it approaches 100
        const remaining = 100 - prev;
        const speed = Math.max(0.08, remaining * 0.012) + Math.random() * 0.15;
        return Math.min(prev + speed, 100);
      });
    }, 120);
    return () => clearTimeout(id);
  }, [progress, phase]);

  // Auto fire onLoadComplete once phase is done
  useEffect(() => {
    if (phase === "done") {
      onLoadComplete?.();
    }
  }, [phase, onLoadComplete]);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ backgroundColor: "#0a0a0a" }}
    >

      {/* ── HEADER ── */}
      <header className="flex items-start justify-between px-6 pt-8 sm:px-10 sm:pt-10 lg:px-16 lg:pt-14">
        <div className="flex flex-col gap-1">
          <span
            className="text-[10px] sm:text-[11px] tracking-[4px] uppercase"
            style={{ fontFamily: "inherit", color: "#444", letterSpacing: "0.25em" }}
          >
           Web Developer
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(28px, 5vw, 52px)",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
              className="font-Centrion-Regular"
            >
             VS
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(20px, 3.5vw, 36px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#333",
                lineHeight: 1,
              }}
            >
              .
            </span>
          </div>
          <span
            className="text-[9px] sm:text-[10px] uppercase mt-2 pt-2"
            style={{ color: "#2a2a2a", letterSpacing: "0.3em", borderTop: "1px solid #1c1c1c" }}
          >
            
          </span>
        </div>

        <div className="text-right flex flex-col gap-1">
          <span
            className="tabular-nums font-light tracking-widest"
            style={{
              fontSize: "clamp(16px, 2.5vw, 24px)",
              color: "#ffffff",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {clock}
          </span>
          <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "#333", textTransform: "uppercase" }}>
            {date} IST
          </span>
        </div>
      </header>

      {/* ── CENTER — Giant number ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 select-none">
        <div
          className="tabular-nums leading-none"
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(80px, 22vw, 220px)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            transition: "color 0.3s ease",
          }}
        >
          {pct}
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.45em",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#2a2a2a",
              verticalAlign: "super",
              letterSpacing: 0,
            }}
          >
            %
          </span>
        </div>

        <p
          style={{
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "#333",
            textTransform: "uppercase",
            marginTop: "clamp(16px, 3vw, 32px)",
            transition: "opacity 0.5s ease",
          }}
        >
          {LABELS[labelIdx]}
        </p>
      </main>

      {/* ── FOOTER — single hairline progress ── */}
      <footer className="px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16 lg:pb-14 flex flex-col gap-3">
        <div className="w-full relative overflow-hidden" style={{ height: 1, backgroundColor: "#1a1a1a" }}>
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${pct}%`,
              backgroundColor: "#ffffff",
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 10, letterSpacing: "0.3em", color: "#2a2a2a", textTransform: "uppercase" }}>
            {pct >= 75 ? "Almost ready" : "Please wait"}
          </span>
          <span className="tabular-nums" style={{ fontSize: 10, letterSpacing: "0.15em", color: "#2a2a2a" }}>
            {pct}%
          </span>
        </div>
      </footer>
    </div>
  );
}