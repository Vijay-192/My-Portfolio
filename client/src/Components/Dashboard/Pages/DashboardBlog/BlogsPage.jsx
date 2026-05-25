import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllBlogs,
  clearMessages,
  selectBlogs,
  selectBlogLoading,
  selectActionError,
  selectSuccessMessage,
} from "../../../../redux-store/BlogSlice";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Pencil,
  X,
  Loader2,
  BookOpen,
  Tag,
  Image as ImageIcon,
  User,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  FileText,
  LayoutGrid,
} from "lucide-react";
import { toast } from "react-hot-toast";
const LS_KEY = "blogspage_added_ids";
const parseTags = (t) => {
  if (!t) return [];
  if (Array.isArray(t)) return t.filter(Boolean);
  return t.split(",").map((s) => s.trim()).filter(Boolean);
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const AddBlogPopup = ({ allBlogs, addedIds, onAdd, onClose }) => {
  const [search, setSearch] = useState("");

  const available = allBlogs.filter(
    (b) =>
      !addedIds.has(b._id) &&
      [b.title, b.author, b.category].some((f) =>
        (f || "").toLowerCase().includes(search.toLowerCase())
      )
  );
  const alreadyAdded = allBlogs.filter((b) => addedIds.has(b._id));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Plus className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
              Add Blog to Table
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {allBlogs.length} total · {alreadyAdded.length} added · {available.length} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* search */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, author, category…"
              className="edu-input w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
        </div>

        {/* list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {allBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <BookOpen className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No blogs found from backend</p>
            </div>
          ) : available.length === 0 && search === "" ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <CheckCircle2
                className="w-12 h-12 mb-3 opacity-30"
                style={{ color: "var(--edu-primary)" }}
              />
              <p className="text-sm font-medium">All blogs already added</p>
            </div>
          ) : available.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Search className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No results found</p>
            </div>
          ) : (
            available.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  {blog.coverImage ? (
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                    {blog.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{blog.author}</span>
                    {blog.category && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ background: "var(--edu-primary)" }}
                      >
                        {blog.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {fmtDate(blog.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => onAdd(blog)}
                  className="flex-shrink-0 px-5 py-2 rounded-lg text-sm font-semibold text-white transition shadow-sm hover:opacity-90"
                  style={{ background: "var(--edu-primary)" }}
                >
                  + Add
                </button>
              </div>
            ))
          )}

          {/* already added section */}
          {alreadyAdded.length > 0 && search === "" && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Already Added ({alreadyAdded.length})
              </p>
              {alreadyAdded.map((blog) => (
                <div
                  key={blog._id}
                  className="flex items-center gap-3 p-3 rounded-xl opacity-50"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 dark:text-gray-300 truncate text-sm">
                      {blog.title}
                    </p>
                    <p className="text-xs text-gray-400">{blog.author}</p>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-900/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Added
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const BlogViewFullScreen = ({ blog, onClose }) => (
  
  <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Blogs
      </button>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <BookOpen className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
        Blog Preview
      </h1>
      <div className="w-28" />
    </div>
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      {blog.coverImage && (
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-2xl"
        />
      )}
      <div className="flex items-center gap-3">
        {blog.authorAvatar ? (
          <img
            src={blog.authorAvatar}
            alt={blog.author}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--edu-light)" }}
          >
            <User className="w-6 h-6" style={{ color: "var(--edu-primary)" }} />
          </div>
        )}
        <div>
          <p className="font-bold text-gray-900 dark:text-gray-100">{blog.author}</p>
          <p className="text-xs text-gray-500">{fmtDate(blog.createdAt)}</p>
        </div>
        <span
          className="ml-auto px-3 py-1 rounded-full text-sm font-bold text-white"
          style={{ background: "var(--edu-primary)" }}
        >
          {blog.category}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{blog.title}</h1>
      {parseTags(blog.tags).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {parseTags(blog.tags).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium"
              style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
            >
              <Tag className="w-3 h-3" />#{tag}
            </span>
          ))}
        </div>
      )}
      <div
        className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-400 flex items-center gap-2">
          <Eye className="w-4 h-4" /> {blog.views || 0} views
        </p>
      </div>
    </div>
  </div>
);
const DeleteModal = ({ target, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Remove from Table?
          </h3>
          <p className="text-sm text-gray-500">Blog will only be removed from table</p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-2">
        Remove{" "}
        <strong className="text-gray-900 dark:text-gray-100">"{target.title}"</strong>?
      </p>
      <p className="text-xs text-gray-400 mb-6">
        Blog won't be deleted — you can re-add it anytime via "Add Blog".
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
);
const BlogsPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const allBlogs   = useSelector(selectBlogs) ?? [];
  const loading    = useSelector(selectBlogLoading);
  const actionError= useSelector(selectActionError);
  const successMsg = useSelector(selectSuccessMessage);
  const [addedIds, setAddedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [viewItem,     setViewItem]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search,       setSearch]       = useState("");
  const [showPopup,    setShowPopup]    = useState(false);
  useEffect(() => { dispatch(fetchAllBlogs()); }, [dispatch]);
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify([...addedIds]));
  }, [addedIds]);
  useEffect(() => {
    if (successMsg) { toast.success(successMsg); dispatch(clearMessages()); }
  }, [successMsg, dispatch]);

  useEffect(() => {
    if (actionError) { toast.error(actionError); dispatch(clearMessages()); }
  }, [actionError, dispatch]);
  const handleAdd = useCallback((blog) => {
    setAddedIds((prev) => {
      if (prev.has(blog._id)) return prev;
      const next = new Set(prev);
      next.add(blog._id);
      return next;
    });
    toast.success(`"${blog.title}" added to table!`);
  }, []);

  const handleRemove = useCallback(() => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget._id);
      return next;
    });
    toast.success(`"${deleteTarget.title}" removed from table`);
    setDeleteTarget(null);
  }, [deleteTarget]);
  const tableBlogs = allBlogs.filter((b) => addedIds.has(b._id));

  const filteredTable = tableBlogs.filter((b) =>
    [b?.title, b?.author, b?.category].some((f) =>
      (f || "").toLowerCase().includes(search.toLowerCase())
    )
  );
  return (
    <>
      {viewItem && (
        <BlogViewFullScreen blog={viewItem} onClose={() => setViewItem(null)} />
      )}
      <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${viewItem ? "hidden" : ""}`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--edu-primary)" }}>
              Blog Management
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Create, manage, and publish your blog posts
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setShowPopup(true)}
              className="cursor-pointer edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Blog
            </button>
            <button
              onClick={() => navigate("/dashboard/writing-blogs")}
              className="cursor-pointer edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition font-semibold text-sm"
            >
              <FileText className="w-4 h-4" /> Writing Blog
            </button>
          </div>
        </div>
        <div className="mb-5 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="edu-input w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-6 rounded-full"
              style={{ background: "var(--edu-primary)" }}
            />
            <LayoutGrid className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
              All Blogs
            </h2>
          </div>
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {filteredTable.length} record{filteredTable.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── TABLE ── */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2
              className="w-6 h-6 animate-spin"
              style={{ color: "var(--edu-primary)" }}
            />
            <span>Loading blogs…</span>
          </div>
        ) : filteredTable.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-24 text-gray-400">
            <BookOpen className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No blogs in table</p>
            <p className="text-sm mt-1">Use "Add Blog" to add blogs here</p>
            <button
              onClick={() => setShowPopup(true)}
              className="mt-5 edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow"
            >
              <Plus className="w-4 h-4" /> Add Blog
            </button>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--edu-primary)" }}>
                  {["Blog", "Author", "Tags", "Date", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3.5 font-semibold text-white uppercase tracking-wide text-xs ${
                        h === "Actions" ? "text-center" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filteredTable.map((item) => {
                  const tags = parseTags(item.tags);
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50/70 dark:hover:bg-gray-700/30 transition"
                    >
                      {/* blog */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                            {item.coverImage ? (
                              <img
                                src={item.coverImage}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px]">
                              {item.title}
                            </p>
                            <span
                              className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                              style={{ background: "var(--edu-primary)" }}
                            >
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* author */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          {item.authorAvatar ? (
                            <img
                              src={item.authorAvatar}
                              alt={item.author}
                              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "var(--edu-light)" }}
                            >
                              <User
                                className="w-4 h-4"
                                style={{ color: "var(--edu-primary)" }}
                              />
                            </div>
                          )}
                          <span className="font-medium text-gray-800 dark:text-gray-200">
                            {item.author}
                          </span>
                        </div>
                      </td>

                      {/* tags */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background: "var(--edu-light)",
                                color: "var(--edu-primary)",
                              }}
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {tag}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                background: "var(--edu-light)",
                                color: "var(--edu-accent)",
                              }}
                            >
                              +{tags.length - 2}
                            </span>
                          )}
                          {tags.length === 0 && (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </div>
                      </td>

                      {/* date */}
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {fmtDate(item.createdAt)}
                        </span>
                      </td>

                      {/* actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewItem(item)}
                            title="View"
                            className="p-2 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition"
                          >
                            <Eye className="w-4 h-4 cursor-pointer" />
                          </button>
                    
                          <button
                            onClick={() => setDeleteTarget(item)}
                            title="Remove from table"
                            className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                          >
                            <Trash2 className="w-4 h-4 cursor-pointer" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showPopup && (
        <AddBlogPopup
          allBlogs={allBlogs}
          addedIds={addedIds}
          onAdd={handleAdd}
          onClose={() => setShowPopup(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          target={deleteTarget}
          onConfirm={handleRemove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
};

export default BlogsPage;