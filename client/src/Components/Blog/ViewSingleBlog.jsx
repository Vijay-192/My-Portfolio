import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlog,
  selectSelectedBlog,
  selectBlogLoading,
  clearSelectedBlog,
} from "../../redux-store/BlogSlice";
import { ArrowLeft } from "lucide-react";

const parseTags = (tags) => {
  const raw = Array.isArray(tags) ? tags.join(" ") : (tags || "");
  return raw.split(/[\s,]+/).map((t) => t.replace(/^#/, "").trim()).filter(Boolean);
};

const Skeleton = ({ style = {} }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.06)",
      borderRadius: 8,
      animation: "skpulse 1.6s ease-in-out infinite",
      ...style,
    }}
  />
);

export default function SingleBlog() {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blog     = useSelector(selectSelectedBlog);
  const loading  = useSelector(selectBlogLoading);

  useEffect(() => {
    if (id && id !== "all") dispatch(fetchBlog(id));
    return () => { dispatch(clearSelectedBlog()); };
  }, [id, dispatch]);

  if (id === "all") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <h1 className="text-2xl font-semibold">All Blogs Coming Soon</h1>
      </div>
    );
  }

  if (loading || !blog) {
    return (
      <section className="bg-[#0a0a0a] min-h-screen text-white">
        <style>{`@keyframes skpulse{0%,100%{opacity:.25}50%{opacity:.6}}`}</style>
        <div className="relative w-full" style={{ height: "clamp(280px,38vw,480px)", background: "#111" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,#0a0a0a 30%,transparent)" }} />
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
            <Skeleton style={{ width: 80, height: 22, borderRadius: 20 }} />
            <Skeleton style={{ width: "60%", height: 32 }} />
            <Skeleton style={{ width: "40%", height: 16 }} />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 min-w-0 px-6 lg:px-12 py-8 flex flex-col gap-4">
            {[100, 94, 97, 88, 100, 76].map((w, i) => (
              <Skeleton key={i} style={{ width: `${w}%`, height: 13 }} />
            ))}
          </div>
          <div className="w-full lg:w-60 px-6 lg:px-5 py-8 flex flex-col gap-3"
            style={{ borderLeft: "0.5px solid rgba(255,255,255,0.06)" }}>
            {[60, 80, 50, 70].map((w, i) => (
              <Skeleton key={i} style={{ width: w, height: 26, borderRadius: 20 }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const tags    = parseTags(blog.tags);
  const fmtDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "";
  const readMin = blog.content
    ? `${Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))} min read`
    : "";

  return (
    <section className="bg-[#0a0a0a] min-h-screen text-white" style={{ overflowX: "hidden" }}>
      <style>{`
        @keyframes skpulse { 0%,100%{opacity:.25} 50%{opacity:.6} }
        .blog-prose * { max-width:100% !important; overflow-wrap:break-word !important; word-break:break-word !important; }
        .blog-prose pre { overflow-x:auto !important; white-space:pre-wrap !important; }
        .blog-prose img { max-width:100% !important; height:auto !important; }
        .blog-prose table { display:block; overflow-x:auto; white-space:nowrap; }
        .blog-prose a { color:#60a5fa; }
        .blog-prose code { color:#f472b6; font-size:0.9em; }
        .blog-prose h1,.blog-prose h2,.blog-prose h3,.blog-prose h4 { color:#fff; font-weight:700; margin:1.4em 0 0.6em; line-height:1.3; }
        .blog-prose p { margin:0 0 1em; }
        .blog-prose ul,.blog-prose ol { padding-left:1.5em; margin:0 0 1em; }
        .blog-prose blockquote { border-left:3px solid rgba(255,255,255,0.2); margin:1.2em 0; padding:0.4em 1em; color:rgba(255,255,255,0.55); }
      `}</style>

      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: "clamp(280px,38vw,480px)" }}>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            style={{ width: "100%", height: "clamp(280px,38vw,480px)", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ height: "clamp(280px,38vw,480px)", background: "#111" }} />
        )}

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top,#0a0a0a 30%,rgba(10,10,10,0.55) 60%,transparent)" }}
        />

        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute", top: 20, left: 20,
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "rgba(255,255,255,0.65)",
            background: "rgba(0,0,0,0.45)",
            border: "0.5px solid rgba(255,255,255,0.15)",
            padding: "6px 14px", borderRadius: 8, cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>

        <div className="absolute bottom-0 left-0 right-0" style={{ padding: "0 24px 28px" }}>
          {blog.category && (
            <span style={{
              display: "inline-block", marginBottom: 12,
              padding: "3px 12px",
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: 20, fontSize: 11,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.7)",
            }}>
              {blog.category}
            </span>
          )}

          <h1 style={{
            fontSize: "clamp(20px,4vw,36px)", fontWeight: 700,
            lineHeight: 1.3, maxWidth: 820, marginBottom: 16,
            overflowWrap: "break-word", wordBreak: "break-word",
          }}>
            {blog.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#1a1a1a",
              border: "1.5px solid rgba(255,255,255,0.18)",
              overflow: "hidden", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)",
            }}>
              {blog.authorAvatar
                ? <img src={blog.authorAvatar} alt={blog.author} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (blog.author?.[0] ?? "A").toUpperCase()
              }
            </div>
            <div style={{ fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{blog.author}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>
                {fmtDate}{readMin && ` · ${readMin}`}
              </span>
            </div>
            {blog.views > 0 && (
              <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                {blog.views.toLocaleString()} views
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-col lg:flex-row" style={{ overflow: "hidden" }}>

        {/* Blog content */}
        <article
          className="flex-1 min-w-0"
          style={{ padding: "clamp(24px,5vw,48px) clamp(20px,6vw,64px)", overflow: "hidden", maxWidth: "100%" }}
        >
          <div
            className="blog-prose"
            style={{
              color: "rgba(255,255,255,0.82)",
              fontSize: "clamp(15px,1.6vw,17px)",
              lineHeight: 1.85,
              overflowWrap: "break-word",
              wordBreak: "break-word",
              overflow: "hidden",
              maxWidth: "100%",
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* ── SIDEBAR ── */}
        <aside
          className="w-full lg:w-56 xl:w-64 flex-shrink-0"
          style={{
            padding: "32px 20px",
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="hidden lg:block"
            style={{
              position: "sticky",
              top: 24,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {tags.length > 0 && (
              <div>
                <p style={{
                  fontSize: 10, letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)", marginBottom: 12,
                }}>
                  Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag, i) => (
                    <span key={i} style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.07)",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 20, fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

         
          </div>

          {/* Mobile — tags show inline below content */}
          <div className="lg:hidden">
            {tags.length > 0 && (
              <div>
                <p style={{
                  fontSize: 10, letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.3)", marginBottom: 12,
                }}>
                  Tags
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tags.map((tag, i) => (
                    <span key={i} style={{
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.07)",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      borderRadius: 20, fontSize: 12,
                      color: "rgba(255,255,255,0.65)",
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

      </div>
    </section>
  );
}