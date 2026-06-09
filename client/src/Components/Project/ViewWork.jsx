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
    <div className="min-h-screen bg-gray-200 animate-pulse">
      <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-20">
        <aside className="w-full lg:w-[40vw] lg:max-w-[520px] px-4 sm:px-8 lg:px-12 py-8 lg:py-12 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-black/10" />
            <div className="h-5 w-40 bg-black/10 rounded" />
          </div>
          <div className="h-3 w-full bg-black/10 rounded" />
          <div className="h-3 w-3/4 bg-black/10 rounded" />
          <div className="grid grid-cols-2 gap-6 pt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-20 bg-black/10 rounded" />
                <div className="h-3 w-28 bg-black/10 rounded" />
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-2.5 w-full bg-black/10 rounded" />
            ))}
          </div>
        </aside>
        <main className="w-full lg:w-[70%] mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-0 py-8">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="w-full rounded-3xl bg-black/10 aspect-video"
            />
          ))}
        </main>
      </div>
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
        { y: -50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
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
      className="flex justify-center py-16 sm:py-24 px-4 sm:px-6 bg-gray-200 text-black border-t border-black/10"
    >
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-8 sm:gap-12">
        <div className="testi-item flex-shrink-0 w-full md:w-auto flex justify-center md:justify-start">
          <div className="relative w-48 h-64 sm:w-56 sm:h-72 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/10">
            {testimonialImage ? (
              <img
                src={testimonialImage}
                alt={testimonial?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-black/10 flex items-center justify-center">
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
        <div className="testi-item max-w-xl font-JetBrainsMono w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-px bg-black/40" />
            <p className="text-[11px] tracking-[0.3em] uppercase text-black/50 font-medium">
              Testimonial
            </p>
          </div>
          <div className="text-5xl sm:text-6xl text-black/15 font-serif leading-none mb-2 select-none">
            &ldquo;
          </div>
          <blockquote className="text-[13px] sm:text-[15px] md:text-[16px] leading-relaxed text-gray-800 font-light italic">
            {testimonial?.description}
          </blockquote>
          <div className="text-5xl sm:text-6xl text-black/15 font-serif leading-none mt-2 text-right select-none">
            &rdquo;
          </div>
        </div>
      </div>
    </section>
  );
}

function AutoplayVideo({ src, isVisible }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isVisible) {
      videoRef.current?.pause();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isVisible) {
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
     
      className="w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg"
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

function MediaImage({ src, index }) {
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { y: -40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          delay: index * 0.08,
          scrollTrigger: { trigger: imgRef.current, start: "top 88%" },
        }
      );
    });
    return () => ctx.revert();
  }, [index]);

  return (
    <div
      ref={imgRef}
    
      className="w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group"
    >
      <img
        src={src}
        alt={`Project image ${index + 1}`}
       
        className="w-full h-auto block object-contain bg-black/5 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
}
function MobileTabBar({ activeTab, onChange }) {
  const indicatorRef = useRef(null);
  const aboutBtnRef = useRef(null);
  const mediaBtnRef = useRef(null);

  useEffect(() => {
    const activeEl =
      activeTab === "about" ? aboutBtnRef.current : mediaBtnRef.current;
    if (!activeEl || !indicatorRef.current) return;
    const { offsetLeft, offsetWidth } = activeEl;
    gsap.to(indicatorRef.current, {
      x: offsetLeft,
      width: offsetWidth,
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [activeTab]);

  return (
    <div className="lg:hidden sticky top-0 z-40 bg-gray-200/95 backdrop-blur-sm border-b border-black/8 px-4 sm:px-8 py-3">
      <div className="relative flex gap-1 bg-black/6 rounded-xl p-1 w-full max-w-xs">
        <div
          ref={indicatorRef}
          className="absolute top-1 left-1 h-[calc(100%-8px)] bg-black rounded-lg pointer-events-none"
          style={{ width: "50%" }}
        />
        <button
          ref={aboutBtnRef}
          onClick={() => onChange("about")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
            activeTab === "about" ? "text-white" : "text-black/50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
          </svg>
          About
        </button>
        <button
          ref={mediaBtnRef}
          onClick={() => onChange("media")}
          className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
            activeTab === "media" ? "text-white" : "text-black/50"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-3.5 h-3.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" strokeLinecap="round" />
          </svg>
          Media
        </button>
      </div>
    </div>
  );
}
function AboutContent({ project, headerRef, metaRef, detailRef }) {
  return (
    <div className="flex flex-col gap-8 lg:gap-10 w-full">
      <div ref={headerRef} className="space-y-3">
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
          <h1 className="text-xl sm:text-2xl lg:text-xl font-semibold tracking-tight leading-tight">
            {project.title}
          </h1>
        </div>
        <p className="text-sm text-black/55 leading-relaxed">
          {project.description}
        </p>
      </div>

      <div ref={metaRef} className="grid grid-cols-2 gap-y-7 gap-x-6 text-sm">
        <div>
          <p className="font-medium text-[10px] tracking-widest uppercase text-black/40 mb-1.5">
            Industry
          </p>
          <p className="text-sm font-medium">{project.industry}</p>
        </div>
        <div>
          <p className="font-medium text-[10px] tracking-widest uppercase text-black/40 mb-1.5">
            Published
          </p>
          <p className="text-sm font-medium">
            © {project.publishYear ?? project.year}
          </p>
        </div>
        <div className="col-span-2">
          <p className="font-medium text-[10px] tracking-widest uppercase text-black/40 mb-1.5">
            Live Site
          </p>
          <a
            href={project.liveLink || project.site}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-black/60 transition-colors duration-300 group"
          >
            <span className="group-hover:underline underline-offset-4">
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
              className="w-3.5 h-3.5 flex-shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 7h10v10"
              />
            </svg>
          </a>
        </div>
        <div className="col-span-2">
          <p className="font-medium text-[10px] tracking-widest uppercase text-black/40 mb-3">
            Deliverables
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2.5">
            {(project.deliverables ?? []).map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-black/60"
              >
                <span className="w-1 h-1 rounded-full bg-black/35 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full h-px bg-black/10" />

      <div ref={detailRef} className="space-y-7">
        {(project.problemStatement ?? project.problem) && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
              Problem
            </h3>
            <p className="text-[13px] leading-relaxed text-black/65">
              {project.problemStatement ?? project.problem}
            </p>
          </div>
        )}
        {project.solution && (
          <div className="space-y-2">
            <h3 className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40">
              Solution
            </h3>
            <p className="text-[13px] leading-relaxed text-black/65">
              {project.solution}
            </p>
          </div>
        )}
        {project.techStack?.length > 0 && (
          <div>
            <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-black/40 mb-3">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full border border-black/15 text-[10px] tracking-wider uppercase text-black/60 hover:bg-black hover:text-white transition-all duration-200 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaContent({ allImages, videoSrc, hasMedia, isVisible }) {
  const mediaRef = useRef(null);
  useEffect(() => {
    if (!isVisible || !mediaRef.current) return;
    gsap.fromTo(
      mediaRef.current.querySelectorAll(".media-item"),
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, [isVisible]);

  if (!hasMedia) {
    return (
      <div className="w-full flex items-center justify-center py-24">
        <p className="font-JetBrainsMono text-black/30 tracking-widest uppercase text-sm">
          No media available
        </p>
      </div>
    );
  }

  return (
   
    <div
      ref={mediaRef}
      className="flex flex-col gap-5 sm:gap-6 w-full pb-8 lg:pb-12 pt-2 lg:pt-6"
    >
      {allImages.map((src, i) => (
        <div key={i} className="media-item">
          <MediaImage src={src} index={i} />
        </div>
      ))}

      {videoSrc && (
        <>
          <div className="media-item w-full flex items-center gap-3 px-1 mt-3">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-black/30 font-medium whitespace-nowrap">
              Project Video
            </span>
            <div className="flex-1 h-px bg-black/10" />
          </div>
          <div className="media-item">
            <AutoplayVideo src={videoSrc} isVisible={isVisible} />
          </div>
        </>
      )}
    </div>
  );
}
function ViewWork() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const [activeTab, setActiveTab] = useState("about");

  const headerRef = useRef(null);
  const metaRef = useRef(null);
  const detailRef = useRef(null);
  const aboutPanelRef = useRef(null);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);
  useEffect(() => {
    if (loading) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current)
      tl.fromTo(
        headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 },
        0.05
      );
    if (metaRef.current)
      tl.fromTo(
        metaRef.current,
        { y: -35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.2
      );
    if (detailRef.current)
      tl.fromTo(
        detailRef.current,
        { y: -25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        0.35
      );
  }, [loading]);
  useEffect(() => {
    if (activeTab !== "about" || !aboutPanelRef.current) return;
    gsap.fromTo(
      aboutPanelRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [activeTab]);

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
      <div className="min-h-screen bg-gray-200 text-black font-JetBrainsMono">
        <MobileTabBar activeTab={activeTab} onChange={setActiveTab} />
        <div className="flex flex-col lg:flex-row px-4 sm:px-8 lg:px-20">
          <aside
            className={`
              w-full
              lg:w-[40vw] lg:max-w-[520px]
              lg:sticky lg:top-0
              lg:h-screen lg:overflow-y-auto
              z-20
              px-0 sm:px-2 lg:px-12
              py-6 lg:py-12
              ${activeTab === "media" ? "hidden lg:block" : "block"}
            `}
          >
            <div ref={aboutPanelRef}>
              <AboutContent
                project={project}
                headerRef={headerRef}
                metaRef={metaRef}
                detailRef={detailRef}
              />
            </div>
          </aside>
          <main
            className={`
              w-full lg:flex-1
              flex flex-col
              px-0 sm:px-2 lg:px-6
              ${activeTab === "about" ? "hidden lg:flex" : "flex"}
            `}
          >
            <MediaContent
              allImages={allImages}
              videoSrc={videoSrc}
              hasMedia={hasMedia}
              isVisible={activeTab === "media"}
            />
          </main>
        </div>
      </div>

      <TestimonialSection project={project} />
      <NextProjectCarousel />
      <BookACall />
    </>
  );
}

export default ViewWork;