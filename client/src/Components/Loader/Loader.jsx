import "./Lod.css";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import { motion }      from "framer-motion";
import { gsap }        from "gsap";
import { fetchServices }     from "../../redux-store/ServiceSlice";
import { fetchProjects }     from "../../redux-store/Projectslice";
import { fetchSkills }       from "../../redux-store/SkillSlice";
import { fetchEducation }    from "../../redux-store/EducationSlice";
import { fetchAchievements } from "../../redux-store/AchievementSlice";
import { fetchDocuments }    from "../../redux-store/ResumeSlice";
import { fetchBlog }         from "../../redux-store/BlogSlice";

const MIN_SHOW_MS = 1100;  
const RETRY_MS    = 2500;
const MAX_DPR     = 2; 

const STAGES = [
  "Initializing",
  "Loading modules",
  "Building assets",
  "Almost ready",
  "Ready",
];

const PHASES = ["Core", "Assets", "Render"];
const BAR_WIDTHS = [22, 38, 54, 32, 16];
const isSuccess = (d) => d?.type?.endsWith("/fulfilled");

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const useISTClock = () => {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const pad  = (v) => String(v).padStart(2, "0");
    const tick = () => {
      const now    = new Date();
      const offset = now.getTimezoneOffset() * 60_000 + 19_800_000; // +5:30
      const ist    = new Date(now.getTime() + offset);
      setClock(`${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return clock;
};

const useStarField = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf;
    let W, H, dpr;
    let stars = [];
    let nebulaCache = null;
    const reduced = prefersReducedMotion();

    const LAYERS = [
      { count: 280, r: 0.40, alpha: 0.30 }, 
      { count: 120, r: 0.75, alpha: 0.55 }, 
      { count:  55, r: 1.20, alpha: 0.80 },
    ];

    const buildNebula = () => {
      const nb = document.createElement("canvas");
      nb.width  = W * dpr;
      nb.height = H * dpr;
      const nc  = nb.getContext("2d");
      nc.scale(dpr, dpr);

      const blobs = [
        { x: W * 0.18, y: H * 0.28, rx: W * 0.22, ry: H * 0.28, r: 15, g: 22, b: 38, a: 0.06 },
        { x: W * 0.76, y: H * 0.62, rx: W * 0.20, ry: H * 0.25, r: 28, g: 10, b: 42, a: 0.05 },
        { x: W * 0.50, y: H * 0.10, rx: W * 0.30, ry: H * 0.18, r: 10, g: 18, b: 30, a: 0.04 },
      ];

      blobs.forEach(({ x, y, rx, ry, r, g, b, a }) => {
        const grad = nc.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        nc.save();
        nc.scale(1, ry / rx);
        nc.beginPath();
        nc.arc(x, y * (rx / ry), rx, 0, Math.PI * 2);
        nc.fillStyle = grad;
        nc.fill();
        nc.restore();
      });

      return nb;
    };

    const seed = () => {
      stars = [];
      LAYERS.forEach(({ count, r, alpha }) => {
        for (let i = 0; i < count; i++) {
          stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r,
            baseAlpha: alpha * (0.6 + Math.random() * 0.4),
            twinkle:   Math.random() * Math.PI * 2,
            tSpeed:    reduced ? 0 : 0.004 + Math.random() * 0.008,
          });
        }
      });
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      W   = canvas.offsetWidth;
      H   = canvas.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nebulaCache = buildNebula();
      seed();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const paintStatic = () => {
      ctx.clearRect(0, 0, W, H);
      if (nebulaCache) ctx.drawImage(nebulaCache, 0, 0, W, H);
      stars.forEach((s) => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.baseAlpha})`;
        ctx.fill();
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (nebulaCache) ctx.drawImage(nebulaCache, 0, 0, W, H);

      stars.forEach((s) => {
        s.twinkle += s.tSpeed;
        const alpha = s.baseAlpha * (0.72 + 0.28 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    if (reduced) {
      paintStatic();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef]);
};

const OrbitMark = () => (
  <svg
    viewBox="0 0 140 140"
    width="128"
    height="128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g className="ld-ring-outer">
      <circle
        cx="70" cy="70" r="63"
        stroke="rgba(184,144,90,0.16)"
        strokeWidth="0.5"
        strokeDasharray="3 9"
      />
      <rect x="69.4" y="5"    width="1.2" height="5" rx="0.6" fill="rgba(184,144,90,0.55)" />
      <rect x="69.4" y="130"  width="1.2" height="5" rx="0.6" fill="rgba(184,144,90,0.55)" />
      <rect x="5"    y="69.4" width="5"   height="1.2" rx="0.6" fill="rgba(184,144,90,0.55)" />
      <rect x="130"  y="69.4" width="5"   height="1.2" rx="0.6" fill="rgba(184,144,90,0.55)" />
    </g>

    <circle
      cx="70" cy="70" r="46"
      stroke="rgba(255,255,255,0.04)"
      strokeWidth="0.5"
    />

    <g className="ld-ring-inner">
      <circle
        cx="70" cy="70" r="30"
        stroke="rgba(184,144,90,0.10)"
        strokeWidth="0.5"
        strokeDasharray="1.5 5"
      />
      <polygon points="70,38 72,40 70,42 68,40" fill="rgba(184,144,90,0.52)" />
      <polygon points="70,98 72,100 70,102 68,100" fill="rgba(184,144,90,0.52)" />
      <polygon points="38,70 40,72 42,70 40,68"   fill="rgba(184,144,90,0.52)" />
      <polygon points="98,70 100,72 102,70 100,68" fill="rgba(184,144,90,0.52)" />
    </g>

    <line x1="70" y1="63" x2="70" y2="77" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
    <line x1="63" y1="70" x2="77" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />

    <circle cx="70" cy="70" r="4"   fill="#b8905a" className="ld-core-dot" />
    <circle cx="70" cy="70" r="1.8" fill="#ffffff" />
  </svg>
);

const SideBars = ({ pct }) => (
  <div
    aria-hidden="true"
    className="ld-sidebars absolute z-[3] flex flex-col"
    style={{
      left:      "clamp(20px, 4.5vw, 52px)",
      top:       "50%",
      transform: "translateY(-50%)",
    }}
  >
    {BAR_WIDTHS.map((base, i) => (
      <div
        key={i}
        className="ld-bar"
        style={{
          width:   `${(pct / 100) * base}px`,
          opacity: 0.35 + (pct / 100) * 0.45,
        }}
      />
    ))}
  </div>
);


const GridRules = () => (
  <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
    <div className="ld-h-rule absolute" style={{ top:  "10%" }} />
    <div className="ld-h-rule absolute" style={{ top:  "90%" }} />
    <div className="ld-v-rule absolute" style={{ left: "30%" }} />
    <div className="ld-v-rule absolute" style={{ left: "70%" }} />
  </div>
);

const CornerMarks = () => (
  <>
    <div className="ld-corner ld-corner-tl absolute pointer-events-none z-[4]" aria-hidden="true" />
    <div className="ld-corner ld-corner-tr absolute pointer-events-none z-[4]" aria-hidden="true" />
    <div className="ld-corner ld-corner-bl absolute pointer-events-none z-[4]" aria-hidden="true" />
    <div className="ld-corner ld-corner-br absolute pointer-events-none z-[4]" aria-hidden="true" />
  </>
);


const ProgressBar = ({ pct }) => (
  <div className="ld-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
    <div className="ld-fill" style={{ width: `${pct}%` }}>
      <div className="ld-shimmer" />
    </div>
  </div>
);


const PhaseRow = ({ pct }) => {
  const phaseIdx = pct < 33 ? 0 : pct < 66 ? 1 : 2;
  return (
    <div className="flex items-center gap-5 mt-[14px]">
      {PHASES.map((phase, i) => (
        <div
          key={phase}
          className={`ld-phase ${
            i < phaseIdx ? "is-done" : i === phaseIdx ? "is-active" : ""
          }`}
        >
          <span className="ld-phase-pip" />
          {phase}
        </div>
      ))}
    </div>
  );
};


const Loader = ({ onLoadComplete = () => {} }) => {
  const dispatch = useDispatch();
  const clock    = useISTClock();
  const [progress,   setProgress]   = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [dots,       setDots]       = useState("");
  const rootRef      = useRef(null); 
  const canvasRef    = useRef(null);   
  const orbitRef     = useRef(null);   
  const doneRef      = useRef(false);  
  const startRef     = useRef(Date.now());
  const retryTimer   = useRef(null);
  const dataReadyRef = useRef(false);


  useStarField(canvasRef);
  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      420,
    );
    return () => clearInterval(id);
  }, []);


  useEffect(() => {
    if (!orbitRef.current || prefersReducedMotion()) return;
    const tw = gsap.to(orbitRef.current, {
      y:        -11,
      duration: 4.6,
      ease:     "sine.inOut",
      yoyo:     true,
      repeat:   -1,
    });
    return () => tw.kill();
  }, []);

  useEffect(() => {
    let raf;
    let last = performance.now();

    const tick = (now) => {
      const dt = now - last;
      last = now;

      setProgress((prev) => {
        if (prev >= 100) return 100;
        const ceiling = dataReadyRef.current ? 100 : 94;
        if (prev >= ceiling) return ceiling;
        const gap    = ceiling - prev;
        const frames = dt / 16.67; // normalize to a 60fps step
        const speed  = (Math.max(0.10, gap * 0.05) + Math.random() * 0.35) * frames;
        return Math.min(prev + speed, ceiling);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);


  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current      = true;
    dataReadyRef.current = true;
    setIsRetrying(false);

    const elapsed   = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        if (rootRef.current) {
          gsap.to(rootRef.current, {
            opacity:    0,
            scale:      1.012,
            duration:   0.4,
            ease:       "expo.out",
            onComplete: onLoadComplete,
          });
        } else {
          onLoadComplete();
        }
      }, 220);
    }, remaining);
  }, [onLoadComplete]);

  const attemptFetch = useCallback(async () => {
    clearTimeout(retryTimer.current);
    setIsRetrying(false);

    const actions = [
      fetchServices(),
      fetchProjects(),
      fetchSkills(),
      fetchDocuments("resume"),
      fetchDocuments("cv"),
      fetchEducation(),
      fetchAchievements(),
      fetchBlog(),
    ];

    let anySuccess = false;
    try {
      const results = await Promise.allSettled(
        actions.map((action) => dispatch(action)),
      );
      anySuccess = results.some(
        (r) => r.status === "fulfilled" && isSuccess(r.value),
      );
    } catch {
      anySuccess = false;
    }

    if (anySuccess) {
      finish();
    } else {
      setIsRetrying(true);
      setRetryCount((c) => c + 1);
      retryTimer.current = setTimeout(attemptFetch, RETRY_MS);
    }
  }, [dispatch, finish]);

  useEffect(() => {
    const handle = () => {
      if (doneRef.current) return;
      clearTimeout(retryTimer.current);
      attemptFetch();
    };
    window.addEventListener("online", handle);
    return () => window.removeEventListener("online", handle);
  }, [attemptFetch]);

  useEffect(() => {
    attemptFetch();
    return () => clearTimeout(retryTimer.current);
  }, []);
  const pct      = Math.floor(Math.min(progress, 100));
  const stageIdx = Math.min(Math.floor(pct / 25), 4);
  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="ld-root fixed inset-0 z-[9999] flex flex-col overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />
      <GridRules />
      <div
        aria-hidden="true"
        className="ld-vignette absolute inset-0 pointer-events-none z-[2]"
      />
      <div
        aria-hidden="true"
        className="ld-scan absolute pointer-events-none z-[3]"
      />
      <div
        aria-hidden="true"
        className="ld-ghost-pct absolute z-[3] pointer-events-none"
        style={{
          right:     "clamp(20px, 4.5vw, 52px)",
          top:       "50%",
          transform: "translateY(-50%)",
          fontSize:  "clamp(68px, 10.5vw, 102px)",
        }}
      >
        {String(pct).padStart(2, "0")}
      </div>

      <SideBars pct={pct} />
      <CornerMarks />
      <header
        className="ld-header relative z-10 flex items-center justify-between"
        style={{ padding: "clamp(18px,3vw,34px) clamp(20px,4.5vw,52px) 0" }}
      >
        <span className="ld-mono" style={{ letterSpacing: "0.32em" }}>
          VS — Portfolio
        </span>
        {isRetrying && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="ld-label"
          >
            Reconnecting{dots}
            {retryCount > 1 && (
              <span className="ml-2 opacity-40">×{retryCount}</span>
            )}
          </motion.span>
        )}

        <span className="ld-mono">
          {clock}&nbsp;
          <span className="opacity-40">IST</span>
        </span>
      </header>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">

        <div ref={orbitRef}>
          <OrbitMark />
        </div>

        <p
          className="ld-tagline mt-7"
          style={{
            opacity:   pct > 35 ? 1 : 0,
            transform: pct > 35 ? "translateY(0)" : "translateY(8px)",
          }}
        >
          Web Developer · Creative Engineer
        </p>

        <div
          aria-hidden="true"
          className="ld-gold-line absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{ width: `${pct * 0.28}%` }}
        />
      </main>
      <footer
        className="ld-footer relative z-10"
        style={{ padding: "0 clamp(20px,4.5vw,52px) clamp(18px,3vw,34px)" }}
      >
        <div className="flex justify-between items-center mb-[10px]">
          <span className="ld-label">
            {isRetrying ? `Establishing connection${dots}` : STAGES[stageIdx]}
          </span>
          <span className="ld-mono">
            {pct}
            <span className="opacity-40">%</span>
          </span>
        </div>

        <ProgressBar pct={pct} />
        <PhaseRow pct={pct} />
      </footer>

    </div>
  );
};

export default Loader;