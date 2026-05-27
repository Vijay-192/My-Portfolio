import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Trash2, X, Upload, Loader2, Zap } from "lucide-react";
import {
  selectActionLoading,
  fetchSkills, createSkill, deleteSkill, clearMessages,
  selectSkills, selectSkillLoading,
  selectError, selectActionError, selectSuccessMessage,
} from "../../../redux-store/SkillSlice";

const PRESET_COLORS = [
  { label: "React",   color: "#61dafb" },
  { label: "JS",      color: "#f7df1e" },
  { label: "TS",      color: "#3178c6" },
  { label: "Python",  color: "#3776ab" },
  { label: "Node",    color: "#83cd29" },
  { label: "HTML",    color: "#e34c26" },
  { label: "CSS",     color: "#264de4" },
  { label: "MongoDB", color: "#47a248" },
  { label: "MySQL",   color: "#fb8500" },
  { label: "Docker",  color: "#2496ed" },
  { label: "Git",     color: "#ff3e00" },
  { label: "Figma",   color: "#a259ff" },
  { label: "GraphQL", color: "#e535ab" },
  { label: "Redis",   color: "#dc382d" },
  { label: "AWS",     color: "#ff9900" },
  { label: "White",   color: "#ffffff" },
];

const initialForm = { title: "", percentage: "", icon: "", color: "#61dafb" };

const inputCls =
  "edu-input w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30 focus:border-[var(--edu-primary)]";

const TABLE_HEADERS = ["Skill", "Color", "Image", "Proficiency", "Progress", "Actions"];

// ── MOBILE CARD ──
const MobileSkillCard = ({ item, onDelete }) => (
  <div
    className="
      bg-white dark:bg-gray-800
      rounded-xl
      border border-gray-200 dark:border-gray-700
      p-4
      shadow-sm
      hover:shadow-lg
      hover:-translate-y-0.5
      hover:border-indigo-300 dark:hover:border-indigo-500
      transition-all duration-300
    "
  >
    <div className="flex items-center gap-3">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-10 h-10 rounded-lg object-contain border border-gray-200 dark:border-gray-600 flex-shrink-0"
        />
      ) : (
        <div
          className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg"
          style={{ background: `${item.color}22`, border: `2px solid ${item.color}` }}
        >
          {item.icon || <Zap className="w-4 h-4" style={{ color: item.color }} />}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p
            className="font-semibold text-gray-900 dark:text-gray-100 text-sm capitalize truncate"
            title={item.title}
          >
            {item.title}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
              style={{ background: item.color || "#ffffff" }}
            />
            <span className="edu-badge text-xs">{item.percentage}%</span>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${item.percentage || 0}%`, background: item.color || "var(--edu-primary)" }}
          />
        </div>
      </div>
      <button
        onClick={() => onDelete(item)}
        className="
          p-2 rounded-lg
          text-red-600 dark:text-red-400
          hover:bg-red-50 dark:hover:bg-red-900/20
          transition-all duration-200
          flex-shrink-0
        "
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);


const SkillsPage = () => {
  const dispatch = useDispatch();
  const skills        = useSelector(selectSkills)       || [];
  const loading       = useSelector(selectSkillLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error         = useSelector(selectError);
  const actionError   = useSelector(selectActionError);
  const successMsg    = useSelector(selectSuccessMessage);

  const [showModal,    setShowModal]    = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search,       setSearch]       = useState("");
  const [form,         setForm]         = useState(initialForm);
  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { dispatch(fetchSkills()); }, [dispatch]);
  useEffect(() => { if (error || actionError) dispatch(clearMessages()); }, [error, actionError, dispatch]);
  useEffect(() => {
    if (successMsg) { dispatch(clearMessages()); setShowModal(false); resetForm(); }
  }, [successMsg, dispatch]);

  const resetForm = () => { setForm(initialForm); setImageFile(null); setImagePreview(null); };
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile   = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setImageFile(file); setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!form.title || !form.percentage) { alert("Title and percentage are required"); return; }
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append("image", imageFile);
    dispatch(createSkill(fd));
  };

  const filtered = skills.filter((s) => s.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--edu-primary)" }}>Skills</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your technical &amp; professional skills
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="edu-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Skill
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="mb-5 sm:mb-6">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills…"
            className="edu-input w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30"
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--edu-primary)" }} />
          <span className="text-sm">Loading skills…</span>
        </div>
      ) : (
        <section>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <div className="edu-accent-bar" />
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--edu-primary)" }} />
            All Skills
            <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
              {filtered.length} record{filtered.length !== 1 && "s"}
            </span>
          </h2>

          {/* ── MOBILE: vertically scrollable stack of cards ── */}
          <div className="sm:hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                <Zap className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No skills found</p>
              </div>
            ) : (
              <div
                className="flex flex-col gap-2.5 overflow-y-auto pr-1"
                style={{ maxHeight: "60vh", WebkitOverflowScrolling: "touch" }}
              >
                {filtered.map((item) => (
                  <MobileSkillCard key={item._id} item={item} onDelete={setDeleteTarget} />
                ))}
              </div>
            )}
          </div>

          {/* ── DESKTOP: table ── */}
          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="edu-table-header">
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={TABLE_HEADERS.length} className="p-10 text-center text-gray-400">
                        <Zap className="w-10 h-10 mx-auto mb-2 opacity-30" />No skills found
                      </td>
                    </tr>
                  ) : filtered.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100 capitalize">{item.title}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg border border-white/20 shadow-sm flex-shrink-0"
                            style={{ background: item.color || "#ffffff" }} />
                          <span className="text-xs text-gray-400 font-mono">{item.color || "#fff"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {item.image ? (
                          <img src={item.image} alt={item.title}
                            className="w-10 h-10 rounded-lg object-contain border border-gray-200 dark:border-gray-600" />
                        ) : (
                          <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                        )}
                      </td>
                      <td className="p-4"><span className="edu-badge">{item.percentage}%</span></td>
                      <td className="p-4 min-w-[160px]">
                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all"
                            style={{ width: `${item.percentage || 0}%`, background: item.color || "var(--edu-primary)" }} />
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="edu-tooltip-wrap">
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <span className="edu-tooltip-box">
                            <span className="edu-tooltip-label">Delete</span>
                            <span className="edu-tooltip-arrow" />
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ── ADD SKILL MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">

            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Add Skill</h2>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-y-auto">
              <div className="space-y-4">

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Skill Title *
                  </label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g., React.js" className={inputCls} />
                </div>

                {/* Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Proficiency % *
                  </label>
                  <input name="percentage" type="number" min="0" max="100"
                    value={form.percentage} onChange={handleChange}
                    placeholder="e.g., 85" className={inputCls} />
                  {form.percentage && (
                    <div className="mt-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(form.percentage, 100)}%`, background: form.color || "var(--edu-primary)" }} />
                    </div>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Skill Color <span className="font-normal text-gray-400">(circle color on hover)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_COLORS.map(({ label, color }) => (
                      <button key={color} type="button" onClick={() => setForm((p) => ({ ...p, color }))} title={label}
                        className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${form.color === color ? "border-white scale-110 shadow-lg ring-2 ring-offset-1 ring-gray-400" : "border-transparent"}`}
                        style={{ background: color }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input type="color" value={form.color}
                      onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-700 p-0.5 bg-transparent flex-shrink-0" />
                    <input name="color" value={form.color} onChange={handleChange}
                      placeholder="#61dafb" className={inputCls + " font-mono"} maxLength={7} />
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-gray-200 dark:border-gray-700"
                      style={{ background: form.color }} />
                  </div>
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Icon text <span className="font-normal text-gray-400">(optional emoji/label)</span>
                  </label>
                  <input name="icon" value={form.icon} onChange={handleChange}
                    placeholder="e.g., ⚛️" className={inputCls} />
                </div>

                {/* Image upload */}
                <div>
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Skill Image <span className="text-gray-400 font-normal">(SVG / PNG recommended)</span>
                  </p>
                  <label className="cursor-pointer block">
                    <div className={`edu-upload-zone border-2 border-dashed rounded-xl overflow-hidden ${imagePreview ? "border-[var(--edu-primary)]/30" : "border-gray-200 dark:border-gray-700"}`}>
                      {imagePreview ? (
                        <div className="flex items-center justify-center h-24 sm:h-28 p-4 relative">
                          <img src={imagePreview} className="h-full object-contain rounded" alt="preview" />
                          <button type="button"
                            onClick={(e) => { e.preventDefault(); setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 sm:h-28 text-gray-400">
                          <Upload className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-xs">Click to upload skill icon</span>
                          <span className="text-xs mt-1 text-gray-300">SVG, PNG, WebP</span>
                        </div>
                      )}
                    </div>
                    <input type="file" hidden accept="image/*" onChange={handleFile} />
                  </label>
                </div>

              </div>
            </div>

            <div className="edu-modal-footer border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
              <button type="button" disabled={actionLoading} onClick={handleSubmit}
                className="edu-btn-primary w-full py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm">
                {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : "Create Skill"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-5 sm:p-6">
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Delete Skill?</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">{deleteTarget.title}</strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm">
                Cancel
              </button>
              <button
                onClick={() => { dispatch(deleteSkill(deleteTarget._id)); setDeleteTarget(null); }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPage;