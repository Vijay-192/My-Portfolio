import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllBlogs,
  selectBlogs,
  selectBlogLoading,
} from "../../redux-store/BlogSlice";
// update blog part 
const SkeletonCard = ({ flex }) => (
  <motion.div
    layout
    animate={{ flex }}
    transition={{ type: "spring", stiffness: 200, damping: 25 }}
    className="relative rounded-sm overflow-hidden min-w-[260px] sm:min-w-[320px] lg:min-w-0 flex-shrink-0 lg:flex-1"
    style={{ height: "420px" }}
  >
    <div className="w-full h-full bg-neutral-800 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
          animation: "shimmer 1.6s infinite",
        }}
      />
    </div>
    {/* tag pills placeholder */}
    <div className="absolute top-4 left-4 flex gap-2">
      {[40, 56, 48].map((w, i) => (
        <div
          key={i}
          className="h-5 rounded-full bg-neutral-700"
          style={{
            width: w,
            animation: "skpulse 1.6s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
    {/* author placeholder */}
    <div className="absolute bottom-6 left-4 flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-full bg-neutral-700"
        style={{ animation: "skpulse 1.6s ease-in-out infinite" }}
      />
      <div
        className="h-3 w-20 rounded-full bg-neutral-700"
        style={{ animation: "skpulse 1.6s ease-in-out infinite" }}
      />
    </div>
    <style>{`
      @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      @keyframes skpulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
    `}</style>
  </motion.div>
);

const parseTags = (tags) => {
  const raw = Array.isArray(tags) ? tags.join(" ") : tags || "";
  return raw
    .split(/[\s,]+/)
    .map((t) => t.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
};

const AuthorBadge = ({ author, avatar }) => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 rounded-full bg-black border border-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center">
      {avatar ? (
        <img src={avatar} alt={author} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white text-[10px] font-bold uppercase">
          {author?.[0] ?? "A"}
        </span>
      )}
    </div>
    <span className="text-white/80 text-xs font-medium truncate max-w-[120px]">
      {author}
    </span>
  </div>
);


export default function BlogSection() {
  const [active, setActive]         = useState(null);
  const [cursorText, setCursorText] = useState("");
  const [mouse, setMouse]           = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allBlogs = useSelector(selectBlogs) ?? [];
  const loading  = useSelector(selectBlogLoading);


  useEffect(() => {
    dispatch(fetchAllBlogs());
  }, [dispatch]);


  const displayBlogs = allBlogs.slice(0, 3);


  useEffect(() => {
    if (!loading && displayBlogs.length > 0 && active === null) {
      setActive(displayBlogs[0]._id);
    }
  }, [loading, displayBlogs.length]);


  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX - 40, y: e.clientY - 40 });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Custom Cursor */}
      {cursorText && (
        <div
          className="fixed z-[999] pointer-events-none"
          style={{ left: mouse.x, top: mouse.y }}
        >
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
            {cursorText}
          </div>
        </div>
      )}

      <section className="bg-black min-h-screen font-JetBrainsMono px-4 sm:px-6 lg:px-16 py-16 sm:py-20 lg:py-24 cursor-none overflow-hidden">

        {/* ── Title ── */}
        <h1 className="text-white text-[9em] sm:text-[4em] lg:text-[15em] flex justify-center leading-none py-4 sm:py-5 mt-30">
          Blogs
        </h1>

        {/* ── Subtitle ── */}
        <h2 className="text-white text-base sm:text-xl md:text-2xl lg:text-[3em] px-4 sm:px-10 lg:px-24 py-8 sm:py-12 lg:py-20 text-center lg:text-left">
          Stories and insights on digital experiences that push boundaries and deliver excellence
        </h2>

        {/* ── Blog Cards Wrapper ── */}
        <div className="max-w-7xl mx-auto lg:flex lg:items-end lg:h-[520px]">
          <div className="flex gap-3 flex-1 lg:h-full overflow-x-auto lg:overflow-visible scrollbar-hide">

            {loading ? (
              <>
                {[4, 2, 2].map((flex, i) => (
                  <SkeletonCard key={i} flex={flex} />
                ))}
                {/* "All Blogs" skeleton */}
                <motion.div
                  layout
                  animate={{ flex: 2, height: "420px", backgroundColor: "#ffffff10" }}
                  className="relative rounded-sm flex items-center justify-center min-w-[260px] sm:min-w-[320px] lg:min-w-0 flex-shrink-0 lg:flex-1 overflow-hidden"
                >
                  <div
                    className="h-5 w-24 rounded-full bg-neutral-700"
                    style={{ animation: "skpulse 1.6s ease-in-out infinite" }}
                  />
                </motion.div>
              </>
            ) : (
              <>
                
                {displayBlogs.map((work) => {
                  const isActive = active === work._id;
                  const tags = parseTags(work.tags);

                  return (
                    <motion.div
                      key={work._id}
                      layout
                      onMouseEnter={() => { setActive(work._id); setCursorText("View"); }}
                      onMouseLeave={() => { setActive(displayBlogs[0]?._id ?? null); setCursorText(""); }}
                      onClick={() => navigate(`/view-blog/${work._id}`)}
                      animate={{
                        flex: isActive ? 4 : 2,
                        height: isActive ? "520px" : "420px",
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className="relative rounded-sm overflow-hidden cursor-none min-w-[260px] sm:min-w-[320px] lg:min-w-0 h-[360px] sm:h-[420px] lg:h-auto flex-shrink-0 lg:flex-1"
                    >
          
                      <motion.img
                        src={work.coverImage}
                        alt={work.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.12 }}
                        animate={{ scale: isActive ? 1.0 : 1.08 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

                      {/* Tags — top left */}
                      <div className="absolute top-4 left-4 z-10">
                        <p className="text-[14px] font-semibold text-white tracking-wide leading-none drop-shadow-md">
                          {tags.map((tag, i) => (
                            <span key={i}>
                              <span className="opacity-40">#</span>
                              {tag}
                              {i < tags.length - 1 ? (
                                <span className="opacity-40 mx-1">,</span>
                              ) : null}
                            </span>
                          ))}
                        </p>
                      </div>

           
                      <div className="absolute bottom-5 left-4 right-4 z-10 flex flex-col gap-2">
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="text-white font-semibold text-lg leading-snug line-clamp-2"
                          >
                            {work.title}
                          </motion.p>
                        )}
                        <AuthorBadge author={work.author} avatar={work.authorAvatar} />
                      </div>
                    </motion.div>
                  );
                })}

              
                <motion.div
                  layout
                  onMouseEnter={() => { setActive(999); setCursorText("All Blogs"); }}
                  onMouseLeave={() => { setActive(displayBlogs[0]?._id ?? null); setCursorText(""); }}
                  onClick={() => navigate("/view-blog/all")}
                  animate={{
                    flex: active === 999 ? 4 : 2,
                    height: active === 999 ? "520px" : "420px",
                    backgroundColor: active === 999 ? "#FF2A00" : "#ffffff20",
                  }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="relative rounded-sm flex items-center justify-center text-white font-semibold cursor-none text-xl sm:text-2xl lg:text-3xl min-w-[260px] sm:min-w-[320px] lg:min-w-0 h-[360px] sm:h-[420px] lg:h-auto flex-shrink-0 lg:flex-1"
                >
                  All Blogs
                </motion.div>
              </>
            )}

          </div>
        </div>
      </section>
    </>
  );
}