import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
} from "../../redux-store/Projectslice";

import NextProjectCarousel from "./NextProjectCarousel";
import Page404 from "../404/PageNotFound404";
import BookACall from "./BookACall";

gsap.registerPlugin(ScrollTrigger);

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col lg:flex-row px-4 sm:px-8 lg:px-20 animate-pulse">
      {/* Left panel skeleton */}
      <aside className="w-full lg:w-[40vw] lg:max-w-[520px] px-4 sm:px-8 lg:px-12 py-8 lg:py-12 space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-black/10" />
          <div className="h-5 w-40 bg-black/10 rounded" />
        </div>
        <div className="h-3 w-full bg-black/10 rounded" />
        <div className="h-3 w-3/4 bg-black/10 rounded" />
        {/* Meta */}
        <div className="grid grid-cols-2 gap-6 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 bg-black/10 rounded" />
              <div className="h-3 w-28 bg-black/8 rounded" />
            </div>
          ))}
        </div>
        {/* Problem / Solution */}
        <div className="space-y-4 pt-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-2.5 w-full bg-black/8 rounded" />
          ))}
        </div>
      </aside>

      {/* Right images skeleton */}
      <main className="w-full lg:w-[70%] mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-0 py-8">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="w-full rounded-3xl bg-black/10"
            style={{ height: "80vh" }}
          />
        ))}
      </main>
    </div>
  );
}

function TestimonialSection({ project }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".testi-item"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const testimonial = project?.testimonial;
  if (!testimonial?.name && !testimonial?.description) return null;

  const testimonialImage = testimonial?.profileImage || null;

  return (
    <section
      ref={sectionRef}
      className="flex justify-center py-24 px-6 bg-gray-200 text-black border-t border-black/10"
    >
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-12">
        {/* IMAGE */}
        <div className="testi-item flex-shrink-0">
          <div className="relative w-56 h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10">
            {testimonialImage ? (
              <img
                src={testimonialImage}
                alt={testimonial?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-black/8 flex items-center justify-center">
                <span className="font-JetBrainsMono text-black/30 text-xs tracking-widest uppercase">
                  No photo
                </span>
              </div>
            )}
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white p-4">
              <p className="font-semibold text-sm leading-tight">
                {testimonial?.name}
              </p>
              <p className="text-xs opacity-75 mt-0.5">{testimonial?.post}</p>
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div className="testi-item max-w-xl font-JetBrainsMono">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-px bg-black/40" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-black/50 font-medium">
              Testimonial
            </p>
          </div>
          {/* Large quote mark */}
          <div className="text-6xl text-black/15 font-serif leading-none mb-2 select-none">
            &ldquo;
          </div>
          <blockquote className="text-[13px] md:text-[16px] leading-relaxed text-gray-800 font-light italic">
            {testimonial?.description}
          </blockquote>
          <div className="text-6xl text-black/15 font-serif leading-none mt-2 text-right select-none">
            &rdquo;
          </div>
        </div>
      </div>
    </section>
  );
}


function AutoplayVideo({ src }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => { });
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center snap-start mt-5
                 max-sm:h-[70vh] sm:h-[80vh] lg:h-[95vh]
                 max-sm:rounded-xl sm:rounded-3xl overflow-hidden shadow-lg"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}


function ViewWork() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const leftRef = useRef(null);
  const [activeTab, setActiveTab] = useState("about"); // "about" | "media"

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (!loading && leftRef.current) {
      gsap.fromTo(
        leftRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [loading]);

  if (loading) return <LoadingSkeleton />;

  const project = projects.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  if (!project) return <Page404 />;

  const allImages =
    project.images?.length > 0
      ? project.images
      : project.image
        ? [project.image]
        : [];

  const videoSrc = project.video || null;
  const hasMedia = allImages.length > 0 || videoSrc;

  return (
    <>
      <div
        className="min-h-screen flex flex-col lg:flex-row font-JetBrainsMono
                    px-4 sm:px-8 lg:px-20
                    bg-gray-200 text-black"
      >
        <aside
          ref={leftRef}
          className="
            w-full
            lg:w-[40vw] lg:max-w-[520px]
            lg:sticky lg:top-0
            lg:h-screen
            z-30
            overflow-y-auto
          "
        >
          <div className="flex flex-col justify-between w-full
                          px-4 sm:px-8 lg:px-12
                          py-8 lg:py-12">
            <div className="space-y-10 lg:space-y-14">

              {/* BRAND */}
              <div className="space-y-4 lg:space-y-5">
                <div className="flex items-center gap-3">
                  {project.projectIcon ? (
                    <img
                      src={project.projectIcon}
                      alt="icon"
                      className="w-7 h-7 rounded object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 lg:w-7 lg:h-7 rounded bg-black" />
                  )}
                  <h1 className="text-lg lg:text-xl font-semibold tracking-tight">
                    {project.title}
                  </h1>
                </div>
                <p className="text-sm text-black/50 leading-relaxed max-w-full lg:max-w-sm">
                  {project.description}
                </p>
              </div>

              {/* MOBILE TAB TOGGLE */}
              <div className="flex lg:hidden gap-2 border border-black/10 rounded-xl p-1 w-fit">
                {["about", "media"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      px-5 py-2 rounded-lg text-xs uppercase tracking-widest font-medium transition-all
                      ${activeTab === tab
                        ? "bg-black text-white"
                        : "text-black/40 hover:text-black"}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* META GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 sm:gap-y-10 gap-x-10 lg:gap-x-14 text-sm">
                <div className="space-y-6 lg:space-y-7">
                  <div className="grid grid-cols-2 gap-x-10 lg:grid-cols-1 lg:gap-x-0 lg:space-y-7">
                    <div>
                      <p className="font-medium text-[11px] tracking-widest uppercase text-black/40 mb-1">
                        Industry
                      </p>
                      <p className="text-sm">{project.industry}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[11px] tracking-widest uppercase text-black/40 mb-1">
                        Published
                      </p>
                      <p className="text-sm">© {project.publishYear ?? project.year}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[11px] tracking-widest uppercase text-black/40 mb-1">
                      Live Site
                    </p>
                    <a
                      href={project.liveLink || project.site}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-700 transition-colors duration-300"
                    >
                      <span>
                        {(project.liveLink || project.site)
                          ?.replace("https://", "")
                          .replace("http://", "")
                          .replace("www.", "")}
                      </span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 17L17 7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7 7h10v10"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-[11px] tracking-widest uppercase text-black/40 mb-4 lg:mb-5">
                    Deliverables
                  </p>
                  <ul className="space-y-2">
                    {(project.deliverables ?? []).map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs uppercase tracking-wide text-black/60"
                      >
                        <span className="w-1 h-1 rounded-full bg-black/30 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* DIVIDER */}
              <div className="w-full h-px bg-black/10" />

              {/* PROBLEM / SOLUTION */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
                    Problem
                  </h3>
                  <p className="text-xs leading-relaxed text-black/60">
                    {project.problemStatement ?? project.problem}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
                    Solution
                  </h3>
                  <p className="text-xs leading-relaxed text-black/60">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* TECH STACK */}
              {project.techStack?.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40 mb-3">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full border border-black/15 text-[10px] tracking-wider uppercase text-black/60 hover:bg-black hover:text-white transition-all cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* ── RIGHT MEDIA SCROLL ── */}
        <main
          className={`
            w-full lg:w-[70%] mx-auto
            flex flex-col items-center justify-center gap-6
            px-4 sm:px-6 lg:px-0
            max-lg:overflow-y-auto max-lg:snap-y max-lg:snap-mandatory
            max-lg:h-screen
            ${activeTab === "about" ? "max-lg:hidden" : ""}
          `}
        >
          {/* Show on mobile only if 'media' tab active */}
          {/* On LG always visible */}

          {hasMedia ? (
            <>
              {/* Images */}
              {allImages.map((src, i) => (
                <div
                  key={i}
                  className="
                    w-full flex justify-center items-center
                    snap-start mt-5
                    max-sm:h-[70vh] sm:h-[80vh] lg:h-[95vh]
                    max-sm:rounded-xl sm:rounded-3xl overflow-hidden
                    shadow-lg group
                  "
                >
                  <img
                    src={src}
                    alt={`Project image ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              ))}

              {/* Video — autoplay on scroll into view */}
              {videoSrc && (
                <>
                  {/* Label */}
                  <div className="w-full flex items-center gap-3 px-2 mt-4">
                    <div className="flex-1 h-px bg-black/10" />
                    <span className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-medium whitespace-nowrap">
                      Project Video
                    </span>
                    <div className="flex-1 h-px bg-black/10" />
                  </div>
                  <AutoplayVideo src={videoSrc} />
                </>
              )}
            </>
          ) : (
            <div className="w-full h-[60vh] flex items-center justify-center">
              <p className="font-JetBrainsMono text-black/30 tracking-widest uppercase text-sm">
                No media available
              </p>
            </div>
          )}
        </main>


      </div>

      {/* ── TESTIMONIAL ── */}
      <TestimonialSection project={project} />

      {/* ── NEXT PROJECT CAROUSEL ── */}
      <NextProjectCarousel />

      <BookACall />

    </>
  );
}

export default ViewWork;