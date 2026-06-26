import React, { forwardRef } from "react";
const CenterSphere = forwardRef(function CenterSphere(props, ref) {
  return (
    <div
      ref={ref}
      className="
        relative
        w-[220px]  sm:w-[280px]  lg:w-[320px]
        h-[220px]  sm:h-[280px]  lg:h-[320px]
        flex-shrink-0
      "
    >
      {/* OUTER SOFT GLOW */}
      <div className="absolute inset-0 rounded-full blur-2xl sm:blur-3xl opacity-50 bg-[radial-gradient(circle,#a5f3fc,#60a5fa,transparent_70%)]" />

      {/* SPHERE BODY */}
      <div className="relative w-full h-full rounded-full overflow-hidden">
        {/* Dark center core */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,#000000_0%,#050505_30%,transparent_65%)]" />

        {/* Liquid conic spin */}
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
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6),transparent_50%)]" />


        <div className="absolute inset-0 rounded-full border border-white/30" />
      </div>

      <div className="absolute top-full mt-4 sm:mt-8 w-full h-full rounded-full scale-y-[-1] opacity-20 sm:opacity-30 blur-xl sm:blur-2xl bg-[radial-gradient(circle,#7dd3fc,#e879f9,#5eead4,transparent_70%)]" />
    </div>
  );
});

export default CenterSphere;