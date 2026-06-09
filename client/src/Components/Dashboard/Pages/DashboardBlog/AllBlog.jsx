import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBlogs,
  deleteBlog,
  selectBlogs,
  selectBlogLoading,
  selectSuccessMessage,
} from "../../../../redux-store/BlogSlice";
import {
  Plus, Search, Eye, Trash2, Pencil,
  BookOpen, Tag, Image as ImageIcon, User, ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BlogWritePage from "./Blogwritepage";

const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
};

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 relative overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full w-28" />
          <div className="h-2.5 bg-gray-100 dark:bg-gray-600 rounded-full w-20" />
        </div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4/5" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 w-14 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-5 w-16 bg-gray-100 dark:bg-gray-700 rounded-full" />
        <div className="h-5 w-12 bg-gray-100 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  </div>
);

const BlogViewPage = ({ item, onBack }) => (
  <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 dark:bg-gray-900">
    
    {/* Top Bar */}
    <div className="shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4 shadow-sm">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
    </div>

    {/* Scrollable Content */}
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">

        {/* Cover Image */}
        {item.coverImage && (
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-80 object-cover rounded-2xl border border-gray-200 dark:border-gray-700 shadow"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}

        {/* Author + Category */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {item.authorAvatar ? (
              <img
                src={item.authorAvatar}
                alt={item.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--edu-light)" }}
              >
                <User
                  className="w-6 h-6"
                  style={{ color: "var(--edu-primary)" }}
                />
              </div>
            )}

            <div>
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {item.author}
              </p>

              <p className="text-sm text-gray-400">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          <span
            className="ml-auto px-4 py-1.5 rounded-full text-sm font-bold text-white shadow"
            style={{ background: "var(--edu-primary)" }}
          >
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight break-words">
          {item.title}
        </h1>

        {/* Tags */}
        {parseTags(item.tags).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {parseTags(item.tags).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium break-words"
                style={{
                  background: "var(--edu-light)",
                  color: "var(--edu-primary)",
                }}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Blog Content */}
        <div
          className="
            prose prose-lg dark:prose-invert max-w-none
            text-gray-700 dark:text-gray-300
            leading-relaxed
            overflow-x-auto
            break-words
            whitespace-pre-wrap

            [&_*]:max-w-full
            [&_img]:w-full
            [&_img]:h-auto
            [&_img]:rounded-xl

            [&_pre]:overflow-x-auto
            [&_pre]:rounded-xl
            [&_pre]:p-4

            [&_code]:break-words

            [&_table]:block
            [&_table]:overflow-x-auto
            [&_table]:w-full

            [&_iframe]:w-full
          "
          dangerouslySetInnerHTML={{
            __html: item.content,
          }}
        />

        {/* Footer */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {item.views || 0} views
          </p>
        </div>
      </div>
    </div>
  </div>
);

function AllBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const blogs      = useSelector(selectBlogs) ?? [];
  const loading    = useSelector(selectBlogLoading);
  const successMsg = useSelector(selectSuccessMessage);

  const [showWrite,    setShowWrite]    = useState(false);
  const [editItem,     setEditItem]     = useState(null);
  const [viewItem,     setViewItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search,       setSearch]       = useState("");

  useEffect(() => { dispatch(fetchAllBlogs()); }, [dispatch]);

  useEffect(() => {
    if (!successMsg) return;
    dispatch(fetchAllBlogs());
  }, [successMsg, dispatch]);

  const openAdd    = ()  => { setEditItem(null); setShowWrite(true); };
  const openEdit   = (b) => { setEditItem(b);    setShowWrite(true); };
  const closeWrite = ()  => { setShowWrite(false); setEditItem(null); };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteBlog(deleteTarget._id));
    if (deleteBlog.fulfilled.match(result)) {
      toast.success("Blog deleted successfully");
      dispatch(fetchAllBlogs());
    } else {
      const errMsg = result?.payload ?? result?.error?.message ?? "Failed to delete blog";
      toast.error(errMsg);
    }
    setDeleteTarget(null);
  };

  const filtered = blogs.filter((b) =>
    (b?.title    || "").toLowerCase().includes(search.toLowerCase()) ||
    (b?.author   || "").toLowerCase().includes(search.toLowerCase()) ||
    (b?.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard/blogs")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--edu-primary)" }}>Blogs</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {loading ? "Loading…" : `${blogs.length} post${blogs.length !== 1 ? "s" : ""} total`}
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> Write Blog
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, or category…"
            className="edu-input w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition"
          />
        </div>
      </div>

      {/* ── BLOG GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {loading && blogs.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        }

        {!loading && filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--edu-light)" }}>
              <BookOpen className="w-10 h-10" style={{ color: "var(--edu-primary)", opacity: 0.4 }} />
            </div>
            <p className="text-lg font-semibold text-gray-500 dark:text-gray-400 mb-1">No blogs found</p>
            <p className="text-sm text-gray-400 mb-5">
              {search ? `No results for "${search}"` : "Start by writing your first blog post"}
            </p>
            {!search && (
              <button onClick={openAdd} className="edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
                <Plus className="w-4 h-4" /> Write First Blog
              </button>
            )}
          </div>
        )}

        {filtered.map((item) => (
          <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 group flex flex-col">
            {/* Cover */}
            <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden shrink-0">
              {item.coverImage ? (
                <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 opacity-20" style={{ color: "var(--edu-primary)" }} />
                </div>
              )}
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-sm" style={{ background: "var(--edu-primary)" }}>
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-3">
                {item.authorAvatar ? (
                  <img src={item.authorAvatar} alt={item.author} className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shrink-0" onError={(e) => { e.target.style.display = "none"; }} />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--edu-light)" }}>
                    <User className="w-4 h-4" style={{ color: "var(--edu-primary)" }} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{item.author}</p>
                  <p className="text-xs text-gray-400">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 flex-1">{item.title}</h3>

              {parseTags(item.tags).length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {parseTags(item.tags).slice(0, 3).map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}>
                      <Tag className="w-2.5 h-2.5" />{tag}
                    </span>
                  ))}
                  {parseTags(item.tags).length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "var(--edu-light)", color: "var(--edu-accent)" }}>
                      +{parseTags(item.tags).length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                <button onClick={() => setViewItem(item)} title="View" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button onClick={() => openEdit(item)} title="Edit" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setDeleteTarget(item)} title="Delete" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* BlogWrite */}
      {showWrite && (
        <div className="fixed inset-0 z-50">
          <BlogWritePage editItem={editItem} onClose={closeWrite} />
        </div>
      )}

      {/* BlogView */}
      {viewItem && (
        <BlogViewPage item={viewItem} onBack={() => setViewItem(null)} />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Blog?</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">"{deleteTarget.title}"</strong>?
              All associated images will also be removed.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition shadow-lg text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AllBlog;