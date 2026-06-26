import { useEffect, useRef, useState } from "react";
export default function ScrollIndicator() {
  const pathRef  = useRef(null);
  const rafRef   = useRef(null);
  const timerRef = useRef(null);

  const [state, setState] = useState({
    visible  : false,
    drawn    : 0,
    totalLen : 1,
    tip      : null,
  });

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const H      = window.innerHeight;
    const RIGHT  = 14;
    const LEFT   = 38;
    const BEND_Y = H * 0.40;
    const BEND_E = BEND_Y + 26;
    const init = requestAnimationFrame(() => {
      const path = pathRef.current;
      if (!path) return;
      const totalLen = path.getTotalLength();

      function update() {
        const firstEl = document.getElementById("/");
        const lastEl  = document.getElementById("/");
        let pct = 0;
        let shouldShow = false;

        if (firstEl && lastEl) {
          const firstRect = firstEl.getBoundingClientRect();
          const lastRect  = lastEl.getBoundingClientRect();
          const started   = firstRect.top  <= H * 0.65;
          const ended     = lastRect.bottom <= H * 0.35;
          const homeEl = document.getElementById("home");
          const inHome = homeEl
            ? homeEl.getBoundingClientRect().bottom > H * 0.5
            : window.scrollY < 60;

          shouldShow = started && !ended && !inHome;

          if (shouldShow) {
            const rangeTop    = firstEl.offsetTop - H * 0.65;
            const rangeBottom = lastEl.offsetTop + lastEl.offsetHeight - H * 0.35;
            pct = Math.min(Math.max((window.scrollY - rangeTop) / (rangeBottom - rangeTop), 0), 1);
          }
        } else {
          const docH = document.documentElement.scrollHeight - H;
          pct = docH > 0 ? Math.min(window.scrollY / docH, 1) : 0;
          shouldShow = window.scrollY > 60;
        }

        const drawn = pct * totalLen;
        const tip   = drawn > 2 ? path.getPointAtLength(drawn) : null;

        clearTimeout(timerRef.current);
        if (shouldShow) {
          setState({ visible: true, drawn, totalLen, tip });
          timerRef.current = setTimeout(
            () => setState(s => ({ ...s, visible: false })),
            1400
          );
        } else {
          setState({ visible: false, drawn: 0, totalLen, tip: null });
        }
      }

      function onScroll() {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(update);
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      update();

      return () => {
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timerRef.current);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    });

    return () => cancelAnimationFrame(init);
  }, []);

  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;

  const H     = typeof window !== "undefined" ? window.innerHeight : 800;
  const RIGHT = 14;
  const LEFT  = 38;
  const BEND_Y = H * 0.40;
  const BEND_E = BEND_Y + 26;
  const D = `M ${RIGHT} 0 L ${RIGHT} ${BEND_Y} L ${LEFT} ${BEND_E} L ${LEFT} ${H}`;

  const { visible, drawn, totalLen, tip } = state;

  return (
    <div style={{
      position      : "fixed",
      top           : 0,
      right         : 0,
      width         : "60px",
      height        : "100vh",
      zIndex        : 99999,
      pointerEvents : "none",
      opacity       : visible ? 1 : 0,
      transition    : "opacity 0.8s ease",
    }}>
      <svg
        width="60"
        height={H}
        viewBox={`0 0 60 ${H}`}
        style={{ overflow: "visible", display: "block" }}
      >
        <defs>
          <linearGradient id="lx-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="1"   />
            <stop offset="30%"  stopColor="#f0eeea" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#c8c4bc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6b6762" stopOpacity="0.1" />
          </linearGradient>

          <filter id="f-line" x="-500%" y="-2%" width="1100%" height="104%">
            <feGaussianBlur stdDeviation="1.8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="f-bloom" x="-1000%" y="-2%" width="2100%" height="104%">
            <feGaussianBlur stdDeviation="5"/>
          </filter>
          <filter id="f-tip" x="-1200%" y="-1200%" width="2500%" height="2500%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="f-halo" x="-2500%" y="-2500%" width="5100%" height="5100%">
            <feGaussianBlur stdDeviation="9"/>
          </filter>
        </defs>

        {/* Ghost full path — always visible faintly */}
        <path d={D} fill="none"
          stroke="rgba(200,196,188,0.1)"
          strokeWidth="1"
          strokeLinecap="round" strokeLinejoin="round"
        />

        {/* Bloom */}
        <path d={D} fill="none"
          stroke="rgba(240,238,232,0.15)"
          strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#f-bloom)"
          strokeDasharray={`${drawn} ${totalLen + 10}`}
          strokeDashoffset="0"
        />

        {/* Main line */}
        <path
          ref={pathRef}
          d={D}
          fill="none"
          stroke="url(#lx-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#f-line)"
          strokeDasharray={`${drawn} ${totalLen + 10}`}
          strokeDashoffset="0"
        />

        {/* Tip glow */}
        {tip && <>
          <circle cx={tip.x} cy={tip.y} r="12"
            fill="rgba(240,238,232,0.07)" filter="url(#f-halo)"/>
          <circle cx={tip.x} cy={tip.y} r="5"
            fill="rgba(255,253,248,0.3)"  filter="url(#f-tip)"/>
          <circle cx={tip.x} cy={tip.y} r="2"
            fill="#ffffff"               filter="url(#f-tip)"/>
          <circle cx={tip.x} cy={tip.y} r="4"
            fill="none" stroke="rgba(200,196,188,0.45)" strokeWidth="0.5"/>
        </>}
      </svg>
    </div>
  );
}