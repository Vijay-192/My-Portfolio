import React, { useRef } from "react";
import gsap from "gsap";

function CenterSphere() {
  const sphereRef = useRef(null);

  return (
    <div
      className="
        w-full 
        lg:w-1/3 
        flex 
        justify-center 
        relative
        -translate-y-[40%] 
        sm:translate-y-0
      "
    >
      <div
        className="
          relative 
          w-[220px] 
          sm:w-[280px] 
          lg:w-[320px] 
          h-[220px] 
          sm:h-[280px] 
          lg:h-[320px]
        "
        ref={sphereRef}
      >
        {/* OUTER SOFT GLOW */}
        <div className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-50 bg-[radial-gradient(circle,#a5f3fc,#60a5fa,transparent_70%)]" />

        {/* SPHERE BODY */}
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,#000000_0%,#050505_30%,transparent_65%)]" />

          {/* INNER LIQUID FLOW */}
          <div
            className="absolute inset-[-40%] animate-spin-slow opacity-90"
            style={{
              background: `conic-gradient(
                from 120deg,
                #7dd3fc,
                #e879f9,
                #5eead4,
                #93c5fd,
                #7dd3fc
              )`,
              maskImage:
                "radial-gradient(circle at center, black 35%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(circle at center, black 35%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />

          {/* HIGHLIGHT */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_50%)]" />

          {/* BORDER */}
          <div className="absolute inset-0 rounded-full border border-white/30" />
        </div>

        {/* REFLECTION / SHADOW */}
        <div className="absolute top-full mt-4 sm:mt-8 w-full h-full rounded-full scale-y-[-1] opacity-20 sm:opacity-30 blur-xl sm:blur-2xl bg-[radial-gradient(circle,#7dd3fc,#e879f9,#5eead4,transparent_70%)]" />
      </div>
    </div>
  );
}

export default CenterSphere;
