
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  selectProjects,
  selectProjectLoading,
} from "../../redux-store/Projectslice";
import { useEffect } from "react";

export default function Testimonial() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const loading = useSelector(selectProjectLoading);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const project = projects.find(
    (p) => String(p._id) === String(id) || String(p.id) === String(id)
  );

  if (loading || !project) return null;

  // Backend mein testimonial object ke andar data hai
  const testimonial = project.testimonial;
  if (!testimonial?.name && !testimonial?.description) return null;

  const testimonialImage =
    testimonial?.profileImage ||
    project.testimonialImage ||
    null;

  return (
    <section className="flex justify-center py-30 px-6 bg-gray-200 text-black">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-start gap-12">

        {/* IMAGE */}
        <div className="flex-shrink-0">
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-lg">
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
            <div className="absolute bottom-0 w-full bg-black/70 text-white p-4">
              <p className="font-semibold">
                {testimonial?.name || project.testimonialName}
              </p>
              <p className="text-sm opacity-80">
                {testimonial?.post || project.testimonialRole}
              </p>
            </div>
          </div>
        </div>

        {/* TEXT */}
        <div className="max-w-xl font-JetBrainsMono">
          <p className="text-[18px] tracking-widest uppercase text-gray-700 mb-6">
            Testimonial
          </p>
          <blockquote className="text-[12px] md:text-[17px] leading-relaxed text-gray-900">
            {testimonial?.description || project.blockquote}
          </blockquote>
          <p className="mt-8 text-[15px] leading-relaxed text-gray-900">
            {project.dislaimer}
          </p>
        </div>
      </div>
    </section>
  );
}