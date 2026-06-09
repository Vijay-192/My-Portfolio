import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
  selectError,
} from "../../redux-store/Projectslice";
import { optimizeUrl, buildSrcSet } from "../../Utils/cloudinary";

gsap.registerPlugin(ScrollTrigger);
const ProjectSkeleton = () => (
  <section id="work" className="bg-black text-white">
    <div className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center gap-5 px-4">
      <div className="sk h-[72px] w-[45%] rounded-2xl" />
      <div className="sk h-3 w-[35%] rounded-lg" />
    </div>
    <div className="max-w-7xl mx-auto px-4 mb-24 flex justify-center gap-6 flex-wrap">
      {[80, 110, 75, 95, 85].map((w, i) => (
        <div
          key={i}
          className="sk h-3 rounded-lg"
          style={{ width: w, animationDelay: `${i * 0.08}s` }}
        />
      ))}
    </div>
    <div className="max-w-7xl mx-auto px-4 flex flex-col gap-40 pb-32">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="flex flex-col lg:flex-row gap-20 items-start"
          style={{ opacity: i === 1 ? 0.45 : 1 }}
        >
          <div
            className="sk hidden lg:block rounded-2xl flex-shrink-0"
            style={{ width: "60%", height: 520, animationDelay: `${i * 0.12}s` }}
          />
          <div
            className="sk block lg:hidden w-full rounded-2xl"
            style={{ height: 300, animationDelay: `${i * 0.12}s` }}
          />
          <div className="w-full lg:w-[45%] flex flex-col gap-4 pt-2 font-JetBrainsMono">
            <div className="flex items-center gap-4">
              <div className="sk h-7 w-10 rounded-full" />
              <div className="sk h-8 w-[55%] rounded-lg" />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="sk h-3 w-full rounded-lg" />
              <div className="sk h-3 w-[88%] rounded-lg" style={{ animationDelay: "0.06s" }} />
              <div className="sk h-3 w-[72%] rounded-lg" style={{ animationDelay: "0.12s" }} />
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <div className="sk h-2.5 w-14 rounded" />
              <div className="sk h-3 w-40 rounded-lg" style={{ animationDelay: "0.05s" }} />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="sk h-2.5 w-20 rounded" />
              <div className="sk h-3 w-28 rounded-lg" style={{ animationDelay: "0.05s" }} />
              <div className="sk h-3 w-24 rounded-lg" style={{ animationDelay: "0.10s" }} />
              <div className="sk h-3 w-20 rounded-lg" style={{ animationDelay: "0.15s" }} />
            </div>
            <div className="sk h-2.5 w-24 rounded mt-5" />
          </div>
        </div>
      ))}
    </div>
  </section>
);

const getImageUrl = (project) => {
  const rawUrl =
    project.images?.[0] ||
    project.image ||
    project.imageUrl ||
    project.thumbnail ||
    project.img ||
    project.coverImage ||
    null;

  if (!rawUrl) return null;

  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    if (rawUrl.includes("cloudinary.com")) {

      return optimizeUrl(rawUrl, {
        width: 1200,
        height: 520,
        quality: "auto",
        format: "auto",
        crop: "fill",
      });
    }
    return rawUrl; 
  }

  // Relative URL — prepend base
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return `${BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};


const ProjectSection = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const projects  = useSelector(selectProjects);
  const loading   = useSelector(selectProjectLoading);
  const error     = useSelector(selectError);        
  const projectRefs = useRef([]);


  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);


  useEffect(() => {
    if (projects.length === 0) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".project").forEach((project) => {
        gsap.fromTo(
          project,
          { opacity: 0, y: -120 },
          {
            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: project,
              start: "top 80%",
              scrub: true,
            },
          }
        );
      });
    });
    return () => ctx.revert();
  }, [projects]);

  const scrollToProject = (index) => {
    projectRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleViewProject = (e, projectId) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/view-work/${projectId}`);
  };

  if (loading) return <ProjectSkeleton />;

  return (
    <section id="work" className="bg-black text-white">

      {/* ── Hero ── */}
      <div className="h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-[20vw] md:text-[12vw] font-extrabold leading-none font-JetBrainsMono">
          work
        </h1>
        <p className="mt-6 max-w-3xl text-white/70 font-JetBrainsMono">
          Every piece of work we create carries intention, impact, and imagination.
        </p>
      </div>

      {/* ── Project Nav ── */}
      <div className="max-w-7xl mx-auto px-4 mb-24 font-JetBrainsMono">
        <div className="flex justify-center gap-4 flex-nowrap">
          {projects.map((p, i) => (
            <button
              key={p._id ?? i}
              onClick={() => scrollToProject(i)}
              className="cursor-pointer relative flex-shrink
                text-[12px] tracking-widest uppercase
                text-gray-700 dark:text-gray-300
                px-4 sm:px-6 md:px-28 py-1
                after:block after:h-[2px] after:w-0 after:bg-white/50 after:transition-all after:duration-300
                hover:after:w-full truncate"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── Project List ── */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-40 pb-32">
        {projects.map((project, index) => {
          const imageUrl = getImageUrl(project);
          const projectId = project._id ?? project.id;

          return (
            <div
              key={projectId}
              ref={(el) => (projectRefs.current[index] = el)}
              className="project flex flex-col lg:flex-row gap-20 items-start"
            >
              {/* ── Image ── */}
              <div className="w-full lg:w-[60%] h-[300px] lg:h-[520px] rounded-2xl overflow-hidden bg-white/5 flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    
                    srcSet={
                      imageUrl.includes("cloudinary.com")
                        ? buildSrcSet(
                     
                            project.images?.[0] ||
                            project.image ||
                            project.imageUrl ||
                            project.thumbnail ||
                            project.img ||
                            project.coverImage,
                            [400, 800, 1200]
                          )
                        : undefined
                    }
                    sizes="(max-width: 768px) 100vw, 60vw"
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
                          color:rgba(255,255,255,0.2);font-family:monospace;font-size:12px;
                          letter-spacing:2px;text-transform:uppercase;">
                          Image not found
                        </div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="font-JetBrainsMono text-white/20 text-xs tracking-widest uppercase">
                      No image
                    </p>
                  </div>
                )}
              </div>

              {/* ── Details ── */}
              <div className="w-full lg:w-[45%] font-JetBrainsMono">
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs border border-white/30 px-3 py-1 rounded-full">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-semibold uppercase">
                      {project.title}
                    </h2>
                  </div>
                  <p className="text-white/50 max-w-lg line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-16">
                  <div className="flex-1 space-y-10">
                    {/* Live Site */}
                    <div>
                      <p className="text-white/40 uppercase tracking-widest mb-2 text-xs">
                        Live Site
                      </p>
                      <a
                        href={project.liveLink || project.site}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm hover:underline"
                      >
                        {(project.liveLink || project.site)?.replace("https://", "")}
                      </a>
                    </div>

                    {/* Deliverables */}
                    <div>
                      <p className="text-white/40 uppercase tracking-widest mb-3 text-xs">
                        Deliverables
                      </p>
                      <ul className="space-y-1 text-sm">
                        {(project.deliverables ?? []).map((item, i) => (
                          <li key={i} className="break-words whitespace-normal">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* View Project link */}
                    <a
                      href={`/view-work/${projectId}`}
                      onClick={(e) => handleViewProject(e, projectId)}
                      className="uppercase cursor-pointer tracking-widest text-xs border-b border-white/60 pb-1 hover:opacity-70 transition inline-block"
                    >
                      View Project
                    </a>
                  </div>

                  {/* Industry + Year */}
                  <div className="w-full sm:w-[180px] ml-auto sm:ml-0 -mt-74 sm:mt-0 text-right sm:text-left space-y-8 font-JetBrainsMono">
                    <div className="ml-auto text-right">
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
                        Industry
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {project.industry}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
                        Published
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed">
                        ©{project.publishYear ?? project.year}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectSection;