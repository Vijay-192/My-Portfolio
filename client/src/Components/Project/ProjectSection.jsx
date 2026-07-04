import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
} from "../../redux-store/Projectslice";
import { optimizeUrl, buildSrcSet } from "../../Utils/cloudinary";
import CustomCursor from "./CustomeCursor";

gsap.registerPlugin(ScrollTrigger);

const ProjectSkeleton = () => (
  <SkeletonTheme baseColor="#161616" highlightColor="#262626">
    <section id="work" className="bg-black text-white font-JetBrainsMono">
      <div className="h-[60vh] md:h-[70vh]" />
      <div className="w-[90%] md:w-[85%] mx-auto px-4 mb-24 flex justify-center gap-8">
        {[100, 130, 90, 110].map((w, i) => (
          <Skeleton key={i} width={w} height={12} borderRadius={4} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
      <div className="w-[90%] md:w-[85%] mx-auto px-4 flex flex-col gap-36 pb-32">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start" style={{ opacity: i === 1 ? 0.45 : 1 }}>
            <div className="w-full lg:w-[55%] flex-shrink-0">
              <Skeleton height={500} borderRadius={16} />
            </div>
            <div className="w-full lg:w-[45%] flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <Skeleton width={36} height={28} borderRadius={999} />
                <Skeleton width="55%" height={32} borderRadius={8} />
              </div>
              <Skeleton count={3} height={12} borderRadius={4} />
              <div className="flex gap-8 mt-2">
                <Skeleton width={80} height={14} borderRadius={4} />
                <Skeleton width={60} height={14} borderRadius={4} />
              </div>
              <div className="flex gap-2">
                <Skeleton width={100} height={30} borderRadius={999} />
                <Skeleton width={90} height={30} borderRadius={999} />
              </div>
              <Skeleton width={120} height={12} borderRadius={4} />
            </div>
          </div>
        ))}
      </div>
    </section>
  </SkeletonTheme>
);

const getImageUrl = (project) => {
  const rawUrl =
    project.images?.[0] || project.image || project.imageUrl ||
    project.thumbnail || project.img || project.coverImage || null;
  if (!rawUrl) return null;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    if (rawUrl.includes("cloudinary.com")) {
      return optimizeUrl(rawUrl, { width: 1200, height: 520, quality: "auto", format: "auto", crop: "fill" });
    }
    return rawUrl;
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return `${BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};

const formatLiveLink = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname;
    return `${u.hostname}${path}`;
  } catch {
    return url;
  }
};

const ProjectSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const projectRefs = useRef([]);

  // Cursor state — kept at top level, outside section
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicked, setCursorClicked] = useState(false);

  // Stable callbacks — no re-render flicker
  const handleMouseEnter = useCallback(() => setCursorVisible(true), []);
  const handleMouseLeave = useCallback(() => {
    setCursorVisible(false);
    setCursorClicked(false);
  }, []);
  const handleMouseDown = useCallback(() => setCursorClicked(true), []);
  const handleMouseUp = useCallback(() => setCursorClicked(false), []);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  useEffect(() => {
    if (projects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".project").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: -80 },
          {
            opacity: 1, y: 0, duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%", scrub: true },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [projects]);

  const scrollToProject = (index) => {
    projectRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewProject = useCallback((projectId) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/view-work/${projectId}`);
  }, [navigate]);

  const navProjects = projects.slice(0, 4);

  if (loading) return <ProjectSkeleton />;

  return (
    <>
      {/* CustomCursor — OUTSIDE section, at fragment root
          createPortal renders to document.body so no parent
          transform/overflow/z-index can affect it */}
      <CustomCursor visible={cursorVisible} clicked={cursorClicked} />

      <section id="work" className="bg-black text-white">

        {/* Hero */}
        <div className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-JetBrainsMono font-extrabold tracking-tight text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none">
            work
          </h1>
          <p className="mt-6 max-w-3xl text-white/70 font-JetBrainsMono text-sm sm:text-base">
            Every piece of work we create carries intention, impact, and imagination.
          </p>
        </div>

        {/* Nav */}
        <div className="w-full mb-20 font-JetBrainsMono">
          <div className="flex items-center justify-start md:justify-center gap-6 md:gap-10 overflow-x-auto px-6 md:px-0 pb-2 scrollbar-none">
            {navProjects.map((p, i) => (
              <button
                key={p._id ?? i}
                onClick={() => scrollToProject(i)}
                className="group cursor-pointer text-[11px] tracking-widest uppercase text-white/40
                  hover:text-white transition-colors duration-300 py-1 relative flex-shrink-0
                  flex items-center gap-1.5"
              >
                <span className="relative after:block after:h-[1px] after:w-0 after:bg-white/50 after:transition-all after:duration-300 group-hover:after:w-full">
                  {p.title}
                </span>
              </button>
            ))}
            <button
              onClick={() => navigate("/all-work")}
              className="group cursor-pointer text-[11px] tracking-widest uppercase text-white/20
                hover:text-white transition-colors duration-300 py-1 relative flex-shrink-0
                flex items-center gap-1.5"
            >
              <span className="relative after:block after:h-[1px] after:w-0 after:bg-white/20 after:transition-all after:duration-300 group-hover:after:w-full">
                All
              </span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white/10 group-hover:text-white">
                ↗
              </span>
            </button>
          </div>
        </div>

        {/* Project List */}
        <div className="w-[90%] md:w-[85%] mx-auto px-4 flex flex-col gap-36 pb-32">
          {projects.map((project, index) => {
            const imageUrl = getImageUrl(project);
            const projectId = project._id ?? project.id;
            const liveUrl = project.liveLink || project.site;
            const deliverables = project.deliverables ?? [];

            return (
              <div
                key={projectId}
                ref={(el) => (projectRefs.current[index] = el)}
                className="project flex flex-col lg:flex-row gap-10 lg:gap-16 items-start"
              >
                {/* Image — cursor zone ONLY here */}
                <div
                  className="w-full lg:w-[55%] h-[260px] sm:h-[360px] lg:h-[500px] rounded-2xl overflow-hidden bg-white/5 flex-shrink-0"
                  style={{ cursor: cursorVisible ? "none" : "auto" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onClick={() => handleViewProject(projectId)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      srcSet={
                        imageUrl.includes("cloudinary.com")
                          ? buildSrcSet(
                              project.images?.[0] || project.image || project.imageUrl ||
                              project.thumbnail || project.img || project.coverImage,
                              [400, 800, 1200]
                            )
                          : undefined
                      }
                      sizes="(max-width: 768px) 100vw, 55vw"
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);font-family:monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Image not found</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="font-JetBrainsMono text-white/20 text-xs tracking-widest uppercase">No image</p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="w-full lg:w-[45%] font-JetBrainsMono flex flex-col gap-6">
                  <div>
                    <span className="text-[10px] border border-white/20 px-3 py-1 rounded-full text-white/40 mb-4 inline-block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold uppercase mt-3 leading-tight">
                      {project.title}
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed mt-3 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="w-full h-[1px] bg-white/10" />

                  <div className="flex gap-10 flex-wrap">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Industry</p>
                      <p className="text-sm text-white/80">{project.industry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Published</p>
                      <p className="text-sm text-white/80">©{project.publishYear ?? project.year}</p>
                    </div>
                  </div>

                  {deliverables.length > 0 && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">Deliverables</p>
                      <div className="flex flex-wrap gap-2">
                        {deliverables.slice(0, 2).map((item, i) => (
                          <span key={i} className="text-xs text-white border border-white/20 rounded-full px-4 py-1.5 bg-white/5">
                            {item}
                          </span>
                        ))}
                        {deliverables.length > 2 && (
                          <span className="text-xs text-white/30 border border-white/10 rounded-full px-4 py-1.5">
                            +{deliverables.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {liveUrl && (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Live Site</p>
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0 animate-pulse" />
                        <span className="group-hover:underline underline-offset-4 truncate max-w-[220px]">
                          {formatLiveLink(liveUrl)}
                        </span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => handleViewProject(projectId)}
                    className="cursor-pointer group uppercase tracking-widest text-xs text-white/50 hover:text-white
                      transition-all duration-200 inline-flex items-center gap-1.5 w-fit mt-1
                      border-b border-white/20 hover:border-white pb-1"
                  >
                    <span>View Project</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ProjectSection;