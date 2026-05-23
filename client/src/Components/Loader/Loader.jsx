import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { fetchServices }     from "../../redux-store/ServiceSlice";
import { fetchProjects }     from "../../redux-store/Projectslice";
import { fetchSkills }       from "../../redux-store/SkillSlice";
import { fetchEducation }    from "../../redux-store/EducationSlice";
import { fetchAchievements } from "../../redux-store/AchievementSlice";
import { fetchBlog } from "../../redux-store/BlogSlice";

const MIN_SHOW_MS = 2000;  
const RETRY_MS    = 3500;   


const LABELS = ["Initializing", "Loading core", "Building assets", "Almost done", "Ready"];
const isActionSuccess = (dispatched) => {
  return dispatched?.type?.endsWith("/fulfilled");
};

function useISTClock() {
  const [time, setTime] = useState({ clock: "--:--:--", date: "--- -- ----" });
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 19800000);
      const p  = (v) => String(v).padStart(2, "0");
      const DD = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const MM = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      setTime({
        clock: `${p(ist.getHours())}:${p(ist.getMinutes())}:${p(ist.getSeconds())}`,
        date:  `${DD[ist.getDay()]} ${p(ist.getDate())} ${MM[ist.getMonth()]} ${ist.getFullYear()}`,
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Loader({ onLoadComplete }) {
  const dispatch = useDispatch();
  const { clock, date } = useISTClock();

  const [progress,    setProgress]    = useState(0);
  const [uiPhase,     setUiPhase]     = useState("animating"); 
  const [dataPhase,   setDataPhase]   = useState("loading");   
  const [dots,        setDots]        = useState("");
  const [retryCount,  setRetryCount]  = useState(0);

  const doneRef    = useRef(false);
  const startRef   = useRef(Date.now());
  const retryTimer = useRef(null);
  const dataReady  = useRef(false);

  const pct      = Math.floor(Math.min(progress, 100));
  const labelIdx = Math.min(Math.floor(pct / 25), 4);
  useEffect(() => {
    if (uiPhase !== "animating") return;
    const id = setTimeout(() => {
      setProgress((prev) => {
        if (prev >= 90 && !dataReady.current) {
          setUiPhase("paused");
          return 90;
        }
        if (prev >= 100) return 100;
        const rem   = 100 - prev;
        const speed = Math.max(0.06, rem * 0.014) + Math.random() * 0.2;
        return Math.min(prev + speed, dataReady.current ? 100 : 90);
      });
    }, 90);
    return () => clearTimeout(id);
  }, [progress, uiPhase]);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current   = true;
    dataReady.current = true;
    setDataPhase("done");
    setUiPhase("animating");

    const elapsed   = Date.now() - startRef.current;
    const remaining = Math.max(0, MIN_SHOW_MS - elapsed);

    setTimeout(() => {
      setProgress(100);
      setTimeout(onLoadComplete, 600);
    }, remaining);
  }, [onLoadComplete]);

  const attemptFetch = useCallback(async () => {
    clearTimeout(retryTimer.current);
    setDataPhase("loading");

    let anySuccess = false;
    try {
      const actions = await Promise.all([
        dispatch(fetchServices()),
        dispatch(fetchProjects()),
        dispatch(fetchSkills()),
        dispatch(fetchBlog()),
        dispatch(fetchEducation()),
        dispatch(fetchAchievements()),
      ]);
      anySuccess = actions.some(isActionSuccess);
    } catch {
      anySuccess = false;
    }

    if (anySuccess) {
      finish();
    } else {
      setDataPhase("waiting");
      setRetryCount((c) => c + 1);
      retryTimer.current = setTimeout(attemptFetch, RETRY_MS);
    }
  }, [dispatch, finish]);

  useEffect(() => {
    const onOnline = () => {
      if (doneRef.current) return;
      clearTimeout(retryTimer.current);
      attemptFetch();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [attemptFetch]);
  useEffect(() => {
    attemptFetch();
    return () => clearTimeout(retryTimer.current);
  }, []);
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    return () => clearInterval(id);
  }, []);

  const isWaiting = dataPhase === "waiting";
  const isDone    = dataPhase === "done";

  return (
    <div style={{
      position:        "fixed",
      inset:           0,
      zIndex:          9999,
      backgroundColor: "#080808",
      display:         "flex",
      flexDirection:   "column",
      overflow:        "hidden",
      fontFamily:      "'JetBrainsMono', 'Courier New', monospace",
      opacity:         isDone ? 0 : 1,
      transition:      isDone ? "opacity 0.55s ease" : "none",
      pointerEvents:   isDone ? "none" : "all",
    }}>
      <header style={{
        display:        "flex",
        alignItems:     "flex-start",
        justifyContent: "space-between",
        padding:        "clamp(22px, 4vw, 54px) clamp(20px, 4.5vw, 68px) 0",
      }}>

        {/* Left: VS branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{
            fontSize:      9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color:         "#3a3a3a",
          }}>
            Web Developer
          </span>

          <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginTop: 5 }}>
            <span style={{
              fontFamily:    "'Playfair Display', Georgia, serif",
              fontSize:      "clamp(26px, 4.8vw, 50px)",
              fontWeight:    700,
              color:         "#fff",
              letterSpacing: "-0.025em",
              lineHeight:    1,
            }}>
              VS
            </span>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize:   "clamp(18px, 3.2vw, 34px)",
              fontWeight: 400,
              fontStyle:  "italic",
              color:      "#2c2c2c",
              lineHeight: 1,
            }}>.</span>
          </div>

          {/* Connection status badge under VS */}
          <div style={{
            marginTop:   9,
            paddingTop:  9,
            borderTop:   "1px solid #181818",
            minHeight:   14,
            fontSize:    9,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            display:     "flex",
            alignItems:  "center",
            gap:         5,
          }}>
            {isWaiting ? (
              <>
                <span style={{
                  display:         "inline-block",
                  width:           5,
                  height:          5,
                  borderRadius:    "50%",
                  backgroundColor: "rgba(255,120,0,0.7)",
                  animation:       "pulse 1.2s ease-in-out infinite",
                  flexShrink:      0,
                }} />
                <span style={{ color: "rgba(255,120,0,0.5)" }}>
                  no connection{dots}
                </span>
              </>
            ) : (
              <>
                {/* Solid green dot */}
                <span style={{
                  display:         "inline-block",
                  width:           5,
                  height:          5,
                  borderRadius:    "50%",
                  backgroundColor: "rgba(60,200,100,0.6)",
                  flexShrink:      0,
                }} />
                <span style={{ color: "#282828" }}>online</span>
              </>
            )}
          </div>
        </div>

        {/* Right: IST clock */}
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{
            fontSize:           "clamp(15px, 2.4vw, 23px)",
            color:              "#fff",
            fontVariantNumeric: "tabular-nums",
            fontWeight:         300,
            letterSpacing:      "0.08em",
          }}>
            {clock}
          </span>
          <span style={{
            fontSize:      9,
            letterSpacing: "0.22em",
            color:         "#2e2e2e",
            textTransform: "uppercase",
            marginTop:     2,
          }}>
            {date} · IST
          </span>
        </div>
      </header>
      <main style={{
        flex:           "1 1 auto",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        userSelect:     "none",
        padding:        "0 20px",
        position:       "relative",
      }}>
        <div style={{
          position:   "absolute",
          inset:      0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 59px, #111 59px, #111 60px)",
          opacity:    0.25,
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", textAlign: "center" }}>
          {/* Giant number */}
          <div style={{
            fontFamily:    "'Playfair Display', Georgia, serif",
            fontSize:      "clamp(88px, 23vw, 230px)",
            fontWeight:    700,
            color:         isWaiting ? "#1a1a1a" : "#fff",
            letterSpacing: "-0.04em",
            lineHeight:    1,
            transition:    "color 0.6s ease",
          }}>
            {isWaiting ? "—" : pct}
            {!isWaiting && (
              <span style={{
                fontFamily:    "'Playfair Display', Georgia, serif",
                fontSize:      "0.42em",
                fontWeight:    400,
                fontStyle:     "italic",
                color:         "#252525",
                verticalAlign: "super",
                letterSpacing: 0,
              }}>%</span>
            )}
          </div>

          {/* Label below number */}
          <p style={{
            fontSize:      10,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color:         isWaiting ? "rgba(255,120,0,0.4)" : "#2a2a2a",
            marginTop:     "clamp(10px, 2vw, 24px)",
            transition:    "color 0.4s ease",
          }}>
            {isWaiting ? `retrying${dots}` : LABELS[labelIdx]}
          </p>

          {/* Retry attempt count */}
          {isWaiting && retryCount > 1 && (
            <p style={{
              fontSize:      9,
              letterSpacing: "0.2em",
              color:         "#242424",
              textTransform: "uppercase",
              marginTop:     6,
            }}>
              attempt {retryCount}
            </p>
          )}
        </div>
      </main>

      <footer style={{
        padding:       "0 clamp(20px, 4.5vw, 68px) clamp(22px, 4vw, 54px)",
        display:       "flex",
        flexDirection: "column",
        gap:           9,
      }}>

        {/* Progress track */}
        <div style={{
          width:           "100%",
          height:          1,
          backgroundColor: "#161616",
          position:        "relative",
          overflow:        "hidden",
        }}>
          {/* Normal fill */}
          {!isWaiting && (
            <div style={{
              position:        "absolute",
              top:             0, left: 0,
              height:          "100%",
              width:           `${pct}%`,
              backgroundColor: "#fff",
              transition:      "width 0.35s cubic-bezier(0.16,1,0.3,1)",
            }} />
          )}

          {isWaiting && (
            <>
              {/* Faint base segments */}
              {[0, 18, 36, 54, 72, 90].map((l) => (
                <div key={l} style={{
                  position:        "absolute",
                  top:             0,
                  left:            `${l}%`,
                  width:           "8%",
                  height:          "100%",
                  backgroundColor: "rgba(255,100,0,0.15)",
                }} />
              ))}
              {/* Slow moving scanner */}
              <div style={{
                position:        "absolute",
                top:             0,
                height:          "100%",
                width:           "25%",
                background:      "linear-gradient(to right, transparent, rgba(255,100,0,0.4), transparent)",
                animation:       "scanRetry 2.2s ease-in-out infinite",
              }} />
            </>
          )}
        </div>

        {/* Bottom labels */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontSize:      9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color:         isWaiting ? "rgba(255,100,0,0.35)" : "#222",
            transition:    "color 0.3s",
          }}>
            {isWaiting
              ? "waiting for connection"
              : pct >= 75 ? "almost ready" : "please wait"
            }
          </span>
          <span style={{
            fontSize:           9,
            letterSpacing:      "0.15em",
            color:              isWaiting ? "#222" : "#272727",
            fontVariantNumeric: "tabular-nums",
          }}>
            {isWaiting ? "--" : `${pct}%`}
          </span>
        </div>
      </footer>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1);   }
          50%      { opacity:.4; transform: scale(1.5); }
        }
        @keyframes scanRetry {
          0%   { left: -26%; }
          100% { left: 105%; }
        }
      `}</style>

      {/* Google font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap"
      />
    </div>
  );
}