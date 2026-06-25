import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
} from "../../redux-store/Projectslice";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function CarouselSkeleton() {
  return (
    <SkeletonTheme baseColor="#161616" highlightColor="#262626">
      <section className="overflow-hidden bg-black text-white py-12 border-t border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-8 sm:px-14 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-4 h-px bg-white/30" />
            <p className="font-JetBrainsMono text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium">
              Next Projects
            </p>
          </div>
        </div>

        {/* Cards row */}
        <div className="flex justify-center">
          <div className="relative w-[92%] overflow-hidden">
            <div className="flex gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[380px] max-w-[380px] h-[420px]">
                  <Skeleton height="100%" width="100%" borderRadius={16} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SkeletonTheme>
  );
}

function NextProjectCarousel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);
  const containerRef = useRef(null);
  const scrollX = useAnimation();
  const [duration, setDuration] = useState(30);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const currentIndex = projects.findIndex(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  useEffect(() => {
    const updateDuration = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setDuration(width / 40);
      }
    };
    updateDuration();
    window.addEventListener("resize", updateDuration);
    return () => window.removeEventListener("resize", updateDuration);
  }, []);

  useEffect(() => {
    if (isPaused) {
      scrollX.stop();
      return;
    }
    scrollX.start({
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration,
          ease: "linear",
        },
      },
    });
  }, [scrollX, duration, isPaused]);

  if (loading) return <CarouselSkeleton />;
  if (currentIndex === -1) return null;

  const nextProjects = [
    ...projects.slice(currentIndex + 1),
    ...projects.slice(0, currentIndex + 1),
  ];
  const marqueeProjects = [...nextProjects, ...nextProjects];

  const getImage = (project) =>
    project.images?.[0] || project.image || project.imageUrl || null;

  const getTags = (project) =>
    project.deliverables?.length > 0
      ? project.deliverables
      : project.techStack?.length > 0
        ? project.techStack
        : project.tags ?? [];

  return (
    <section className="overflow-hidden bg-black text-white py-12 border-t border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between px-8 sm:px-14 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-4 h-px bg-white/30" />
          <p className="font-JetBrainsMono text-[11px] tracking-[0.3em] uppercase text-white/40 font-medium">
            Next Projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Pause / Play pill */}
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="font-JetBrainsMono text-[10px] tracking-[0.2em] uppercase
                       border border-white/15 rounded-full px-4 py-1.5
                       text-white/40 hover:text-white hover:border-white/40
                       transition-all duration-200"
          >
            {isPaused ? "Play" : "Pause"}
          </button>
        </div>
      </div>

      {/* Marquee */}
      <div className="flex justify-center">
        <div
          ref={containerRef}
          className="relative w-[92%] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <motion.div animate={scrollX} className="flex gap-5">
            {marqueeProjects.map((project, index) => {
              const imageUrl = getImage(project);
              const projectId = project._id ?? project.id;
              const tags = getTags(project);

              return (
                <ProjectCard
                  key={index}
                  project={project}
                  projectId={projectId}
                  imageUrl={imageUrl}
                  tags={tags}
                  navigate={navigate}
                />
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, projectId, imageUrl, tags, navigate }) {
  const [hovered, setHovered] = useState(false);

  const goToProject = () => {
    if (!projectId) return;
    navigate(`/view-work/${projectId}`);
  };

  return (
    <div
      onClick={goToProject}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
        min-w-[380px] max-w-[380px]
        rounded-2xl overflow-hidden
        bg-white/5 border border-white/8
        cursor-pointer
        transition-all duration-300
        hover:shadow-xl hover:shadow-white/10
        hover:-translate-y-1
        select-none
      "
    >
      {/* IMAGE */}
      <div className="relative h-[240px] overflow-hidden bg-white/5">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className={`
              w-full h-full object-cover
              transition-transform duration-700 ease-out
              ${hovered ? "scale-105" : "scale-100"}
            `}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-JetBrainsMono text-white/20 text-xs tracking-widest uppercase">
              No image
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className={`
            absolute inset-0 bg-black/60
            flex items-center justify-center
            transition-opacity duration-300
            ${hovered ? "opacity-100" : "opacity-0"}
          `}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToProject();
            }}
            className="
              w-20 h-20 rounded-full
              bg-white text-black
              flex flex-col items-center justify-center gap-0.5
              font-JetBrainsMono text-[9px] tracking-[0.2em] uppercase
              shadow-lg
              hover:bg-gray-200 transition-colors
              cursor-pointer
            "
          >
            <span className="text-base leading-none">↗</span>
            <span>View</span>
          </button>
        </div>

        {/* Category badge */}
        {project.category && (
          <div className="absolute top-3 left-3">
            <span className="
              font-JetBrainsMono text-[9px] tracking-[0.2em] uppercase
              bg-black/80 text-white/80 rounded-full px-3 py-1
              border border-white/10
            ">
              {project.category}
            </span>
          </div>
        )}

        {/* Year badge */}
        {(project.publishYear || project.year) && (
          <div className="absolute top-3 right-3">
            <span className="
              font-JetBrainsMono text-[9px] tracking-[0.2em]
              bg-white/90 text-black/80 rounded-full px-3 py-1
            ">
              {project.publishYear ?? project.year}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="px-5 py-4 space-y-3">
        {/* Title + arrow */}
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-JetBrainsMono font-semibold text-[15px] leading-snug text-white">
            {project.title}
          </h2>
          <span
            className={`
              text-white/30 text-lg leading-none flex-shrink-0 mt-0.5
              transition-all duration-300
              ${hovered ? "text-white translate-x-0.5 -translate-y-0.5" : ""}
            `}
          >
            ↗
          </span>
        </div>

        {/* Description — 2 lines max */}
        {project.description && (
          <p className="font-JetBrainsMono text-[11px] leading-relaxed text-white/45 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-white/8" />

        {/* Tech / Deliverable Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="
                  font-JetBrainsMono
                  text-[9px] tracking-[0.15em] uppercase
                  border border-white/12 rounded-full
                  px-2.5 py-1
                  text-white/50
                  bg-white/3
                  hover:bg-white hover:text-black hover:border-white
                  transition-all duration-200
                "
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="
                font-JetBrainsMono text-[9px] tracking-[0.15em] uppercase
                border border-white/12 rounded-full px-2.5 py-1
                text-white/30
              ">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default NextProjectCarousel;