import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSkills,
  selectSkills,
  selectSkillLoading,
} from "../../redux-store/SkillSlice";


const SkillSkeleton = () => {
  const tileClass =
    "sk rounded-2xl w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] md:w-[84px] md:h-[84px] lg:w-[96px] lg:h-[96px]";

  return (
    <section
      id="skills"
      className="relative w-full min-h-screen bg-black overflow-hidden py-20 font-JetBrainsMono"
    >
      {/* Title skeleton */}
      <div className="relative z-10 mb-14 w-full px-20 sm:px-8 md:px-26 lg:px-44 xl:px-57">
        <div className="sk h-10 w-28 rounded-lg" />
      </div>

      {/* Tiles skeleton grid */}
      <div
        className="relative z-10 mx-auto grid gap-5
          grid-cols-4
          sm:grid-cols-5
          md:grid-cols-6
          lg:grid-cols-8
          xl:grid-cols-10
          w-fit"
      >
        {Array(28)
          .fill(0)
          .map((_, idx) => (
            <div
              key={idx}
              className={tileClass}
              style={{ animationDelay: `${idx * 0.04}s` }}
            />
          ))}
      </div>
    </section>
  );
};


const SkillSection = () => {
  const dispatch = useDispatch();
  const skills = useSelector(selectSkills) ?? [];
  const loading = useSelector(selectSkillLoading);

  const tilesRef = useRef([]);
  const progressRef = useRef([]);
  const iconRef = useRef([]);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  useEffect(() => {
    if (!skills.length) return;

    const cleanups = [];

    tilesRef.current.forEach((tile, idx) => {
      if (!tile) return;

      const progressCircle = progressRef.current[idx];
      const icon = iconRef.current[idx];
      if (!progressCircle || !icon) return;

      const color = tile.dataset.color || "#ffffff";
      const percent = Number(tile.dataset.percent) || 0;

      const circle = progressCircle.querySelector(".fg");
      if (!circle) return;

      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;

      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;

      const onEnter = () => {
        gsap.to(tile, { scale: 1.12, boxShadow: `0 0 35px ${color}`, duration: 0.3 });
        gsap.to(progressCircle, { opacity: 1, duration: 0.3 });
        gsap.to(circle, {
          strokeDashoffset: circumference * (1 - percent / 100),
          duration: 0.6,
          ease: "power2.out",
        });
        gsap.to(icon, { filter: "blur(1px)", opacity: 0.85, duration: 0.3 });
      };

      const onLeave = () => {
        gsap.to(tile, { scale: 1, boxShadow: "none", duration: 0.3 });
        gsap.to(progressCircle, { opacity: 0, duration: 0.3 });
        gsap.to(circle, {
          strokeDashoffset: circumference,
          duration: 0.6,
          ease: "power2.in",
        });
        gsap.to(icon, { filter: "blur(0)", opacity: 1, duration: 0.3 });
      };

      tile.addEventListener("mouseenter", onEnter);
      tile.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        tile.removeEventListener("mouseenter", onEnter);
        tile.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [skills]);
  const totalTiles = Math.max(skills.length, 28);
  if (loading) return <SkillSkeleton />;

  return (
    <section
      id="skills"
      className="relative w-full min-h-screen bg-black overflow-hidden py-20 font-JetBrainsMono"
    >
      {/* Title */}
      <div className="relative z-10 mb-14 w-full">
        <h2
          className="text-white/50 tracking-tight
            text-4xl sm:text-5xl md:text-6xl
            text-left
            px-20 sm:px-8 md:px-26 lg:px-44 xl:px-57"
        >
          skills
        </h2>
      </div>

      {/* Side fades */}
      <div className="hidden sm:block pointer-events-none absolute left-0 inset-y-0 w-32 bg-gradient-to-r from-black to-transparent z-20" />
      <div className="hidden sm:block pointer-events-none absolute right-0 inset-y-0 w-32 bg-gradient-to-l from-black to-transparent z-20" />

      {/* Grid */}
      <div
        className="relative z-10 mx-auto grid gap-5
          grid-cols-4
          sm:grid-cols-5
          md:grid-cols-6
          lg:grid-cols-8
          xl:grid-cols-10
          w-fit"
      >
        {Array(totalTiles)
          .fill(0)
          .map((_, idx) => {
            const skill = skills[idx];

            if (!skill) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="rounded-2xl bg-[#111]/60 border border-white/10
                    w-[68px] h-[68px]
                    sm:w-[76px] sm:h-[76px]
                    md:w-[84px] md:h-[84px]
                    lg:w-[96px] lg:h-[96px]"
                />
              );
            }

            const color = skill.color || "#ffffff";
            const imageUrl = skill.image || null;

            return (
              <div
                key={skill._id}
                ref={(el) => (tilesRef.current[idx] = el)}
                data-color={color}
                data-percent={skill.percentage}
                className="relative flex items-center justify-center rounded-2xl
                  bg-[#111]/80 backdrop-blur-xl border border-white/10 cursor-pointer
                  w-[68px] h-[68px]
                  sm:w-[76px] sm:h-[76px]
                  md:w-[84px] md:h-[84px]
                  lg:w-[96px] lg:h-[96px]"
              >
                {/* Progress ring */}
                <svg
                  ref={(el) => (progressRef.current[idx] = el)}
                  className="absolute inset-0 w-full h-full opacity-0"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50" cy="50" r="45"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    className="fg"
                    cx="50" cy="50" r="45"
                    stroke={color}
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>

                {/* Icon */}
                {imageUrl ? (
                  <img
                    ref={(el) => (iconRef.current[idx] = el)}
                    src={imageUrl}
                    alt={skill.title}
                    className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 object-contain relative z-10"
                  />
                ) : (
                  <span
                    ref={(el) => (iconRef.current[idx] = el)}
                    className="text-base font-bold relative z-10 select-none"
                    style={{ color }}
                  >
                    {skill.title?.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default SkillSection;