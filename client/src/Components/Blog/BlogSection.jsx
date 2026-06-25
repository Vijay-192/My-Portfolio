import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchAllBlogs,
  selectBlogs,
  selectBlogLoading,
} from "../../redux-store/BlogSlice";

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
  const [active, setActive] = useState(null);
  const [cursorText, setCursorText] = useState("");
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allBlogs = useSelector(selectBlogs) ?? [];
  const loading = useSelector(selectBlogLoading);

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

      <section className="bg-black text-white min-h-screen font-JetBrainsMono px-4 sm:px-6 lg:px-56 py-16 sm:py-20 lg:py-24 cursor-none overflow-hidden">
        <div className="relative flex flex-col items-center justify-center text-center h-[65vh] sm:h-[60vh] px-4 overflow-hidden">
          <h1 className="font-JetBrainsMono font-extrabold tracking-tight text-[20vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] leading-none">
            Blogs
          </h1>
          <p className="mt-6 max-w-3xl text-white/70">
            Stories and insights on digital experiences that push boundaries and
            deliver excellence
          </p>
        </div>

        <div className="max-w-7xl mx-auto lg:flex lg:items-end lg:h-[520px]">
          {loading ? (
            <SkeletonTheme baseColor="#161616" highlightColor="#262626">
              <div className="flex gap-3 flex-1 lg:h-full overflow-x-auto lg:overflow-visible scrollbar-hide">
                {[4, 2, 2, 2].map((flex, i) => (
                  <motion.div
                    layout
                    key={i}
                    animate={{ flex }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="relative rounded-sm overflow-hidden min-w-[260px] sm:min-w-[320px] lg:min-w-0 flex-shrink-0 lg:flex-1"
                    style={{ height: "420px" }}
                  >
                    <Skeleton height="100%" width="100%" borderRadius={4} />

                    {/* tag pills */}
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <Skeleton width={40} height={20} borderRadius={9999} />
                      <Skeleton width={56} height={20} borderRadius={9999} />
                      <Skeleton width={48} height={20} borderRadius={9999} />
                    </div>

                    {/* author badge */}
                    <div className="absolute bottom-6 left-4 flex items-center gap-2 z-10">
                      <Skeleton circle width={28} height={28} />
                      <Skeleton width={80} height={12} borderRadius={9999} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </SkeletonTheme>
          ) : (
            <div className="flex gap-3 flex-1 lg:h-full overflow-x-auto lg:overflow-visible scrollbar-hide">
              {displayBlogs.map((work) => {
                const isActive = active === work._id;
                const tags = parseTags(work.tags);

                return (
                  <motion.div
                    key={work._id}
                    layout
                    onMouseEnter={() => {
                      setActive(work._id);
                      setCursorText("View");
                    }}
                    onMouseLeave={() => {
                      setActive(displayBlogs[0]?._id ?? null);
                      setCursorText("");
                    }}
                    onClick={() => navigate(`/view-blog/${work._id}`)}
                    animate={{
                      flex: isActive ? 4 : 2,
                      height: isActive ? "520px" : "420px",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 25,
                    }}
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

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
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
                      <AuthorBadge
                        author={work.author}
                        avatar={work.authorAvatar}
                      />
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                layout
                onMouseEnter={() => {
                  setActive(999);
                  setCursorText("All Blogs");
                }}
                onMouseLeave={() => {
                  setActive(displayBlogs[0]?._id ?? null);
                  setCursorText("");
                }}
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
            </div>
          )}
        </div>
      </section>
    </>
  );
}