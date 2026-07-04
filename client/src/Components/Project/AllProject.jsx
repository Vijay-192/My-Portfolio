import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
} from "../../redux-store/Projectslice";
import { optimizeUrl } from "../../Utils/cloudinary";

const getImageUrl = (project) => {
  const rawUrl =
    project.images?.[0] || project.image || project.imageUrl ||
    project.thumbnail || project.img || project.coverImage || null;
  if (!rawUrl) return null;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    if (rawUrl.includes("cloudinary.com")) {
      return optimizeUrl(rawUrl, { width: 800, height: 500, quality: "auto", format: "auto", crop: "fill" });
    }
    return rawUrl;
  }
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  return `${BASE_URL}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
};

const AllProjectSkeleton = () => (
  <SkeletonTheme baseColor="#161616" highlightColor="#262626">
    <div className="min-h-screen bg-black font-JetBrainsMono px-6 md:px-16 py-10">
      {/* Back btn skeleton */}
      <div className="mb-12">
        <Skeleton width={80} height={14} borderRadius={4} />
      </div>

      {/* Heading skeleton */}
      <div className="mb-16">
        <Skeleton width="40%" height={52} borderRadius={8} />
        <div className="mt-4">
          <Skeleton width="30%" height={12} borderRadius={4} />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ opacity: 1 - i * 0.1 }}>
            <Skeleton height={240} borderRadius={12} style={{ animationDelay: `${i * 0.07}s` }} />
            <div className="mt-4 flex flex-col gap-2">
              <Skeleton width="60%" height={18} borderRadius={4} />
              <Skeleton width="40%" height={12} borderRadius={4} />
              <Skeleton width="80%" height={11} borderRadius={4} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </SkeletonTheme>
);

function AllProject() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);

  useEffect(() => {
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, projects.length]);

  const handleViewProject = (projectId) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    navigate(`/view-work/${projectId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <AllProjectSkeleton />;

  return (
    <div className="min-h-screen bg-black text-white font-JetBrainsMono px-6 md:px-16 py-10">

      {/* Back button — top left */}
      <button
        onClick={handleBack}
        className="group cursor-pointer text-[11px] tracking-widest uppercase text-white/20
              hover:text-white transition-colors duration-300 py-1 relative flex-shrink-0
              flex items-center gap-1.5"
      >
        <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white/10 group-hover:text-white">
          ←
        </span>
        <span className="relative after:block after:h-[1px] after:w-0 after:bg-white/20 after:transition-all after:duration-300 group-hover:after:w-full">Back</span>
      </button>

      {/* Heading */}
      <div className="mb-14">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight leading-none">
       Projects
        </h1>
        <p className="mt-4 text-white/40 text-sm">
          {projects.length} project{projects.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 mb-14" />

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex items-center justify-center h-60">
          <p className="text-white/20 text-sm uppercase tracking-widest">No projects found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {projects.map((project, index) => {
            const imageUrl = getImageUrl(project);
            const projectId = project._id ?? project.id;
            const deliverables = project.deliverables ?? [];

            return (
              <div
                key={projectId}
                onClick={() => handleViewProject(projectId)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-[220px] sm:h-[240px] rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.15);font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;">No image</div>`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-white/20 text-xs tracking-widest uppercase">No image</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-5 flex flex-col gap-3">

                  {/* Index + Title row */}
                  <div className="flex items-start gap-3">
                    <span className="text-[10px] border border-white/15 px-2 py-0.5 rounded-full text-white/30 mt-0.5 flex-shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-base sm:text-lg font-semibold uppercase leading-tight group-hover:text-white/70 transition-colors duration-300">
                      {project.title}
                    </h2>
                  </div>

                  {/* Industry + Year */}
                  <div className="flex items-center gap-4 text-[11px] text-white/30 uppercase tracking-widest">
                    {project.industry && <span>{project.industry}</span>}
                    {(project.publishYear || project.year) && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span>©{project.publishYear ?? project.year}</span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {project.description && (
                    <p className="text-white/35 text-xs leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  {/* Deliverable pills — max 2 */}
                  {deliverables.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {deliverables.slice(0, 2).map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] text-white/40 border border-white/10 rounded-full px-3 py-1 bg-white/5"
                        >
                          {d}
                        </span>
                      ))}
                      {deliverables.length > 2 && (
                        <span className="text-[10px] text-white/20 border border-white/5 rounded-full px-3 py-1">
                          +{deliverables.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* View link */}
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] uppercase tracking-widest text-white/30
                    group-hover:text-white transition-colors duration-300 w-fit
                    border-b border-white/10 group-hover:border-white/60 pb-0.5">
                    <span>View Project</span>
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-24" />
    </div>
  );
}

export default AllProject;