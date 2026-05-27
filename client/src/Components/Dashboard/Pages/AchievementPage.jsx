import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../../../redux-store/AchievementSlice";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Pencil,
  X,
  Upload,
  Loader2,
  Trophy,
  Tag,
} from "lucide-react";

const initialForm = {
  title: "",
  year: "",
  category: "",
  description: "",
  tags: "",
};

const inputCls =
  "edu-input w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition";

const FORM_FIELDS = [
  {
    name: "title",
    label: "Title *",
    placeholder: "e.g., National Hackathon Winner",
    required: true,
    col: "full",
  },
  {
    name: "year",
    label: "Year *",
    placeholder: "e.g., 2023",
    required: true,
    col: "half",
  },
  {
    name: "category",
    label: "Category *",
    placeholder: "e.g., Technical, Sports, Cultural",
    required: true,
    col: "half",
  },
  {
    name: "tags",
    label: "Tags",
    placeholder: "comma-separated: AI, ML, Open Source",
    col: "full",
  },
];

const TABLE_HEADERS = [
  "Title",
  "Year",
  "Category",
  "Tags",
  "Images",
  "Actions",
];

const parseTags = (item) => {
  if (Array.isArray(item.tags)) return item.tags.filter(Boolean);
  return (item.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const MobileAchievementCard = ({ item, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300">
    <div className="flex items-start justify-between gap-2 mb-2">
      <p
        className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug flex-1"
        title={item.title}
      >
        {item.title}
      </p>
      <span className="edu-badge text-xs flex-shrink-0">{item.year}</span>
    </div>

    {/* Category */}
    <div className="flex items-center gap-1.5 mb-2">
      <Trophy
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: "var(--edu-primary)" }}
      />
      <span
        className="text-xs font-medium"
        style={{ color: "var(--edu-primary)" }}
      >
        {item.category}
      </span>
    </div>

    {/* Tags */}
    {parseTags(item).length > 0 && (
      <div className="flex flex-wrap gap-1 mb-3">
        {parseTags(item)
          .slice(0, 3)
          .map((tag, i) => (
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
        {parseTags(item).length > 3 && (
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: "var(--edu-light)",
              color: "var(--edu-accent)",
            }}
          >
            +{parseTags(item).length - 3}
          </span>
        )}
      </div>
    )}

    {item.images?.length > 0 && (
      <div className="flex gap-2 mb-3">
        {item.images.slice(0, 2).map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
            alt=""
          />
        ))}
        {item.images.length > 2 && (
          <div
            className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-semibold"
            style={{
              background: "var(--edu-light)",
              color: "var(--edu-primary)",
            }}
          >
            +{item.images.length - 2}
          </div>
        )}
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-3">
      <button
        onClick={() => onView(item)}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 border border-sky-100 dark:border-sky-900/30 transition"
      >
        <Eye className="w-3.5 h-3.5" /> View
      </button>
      <button
        onClick={() => onEdit(item)}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 transition"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>
      <button
        onClick={() => onDelete(item)}
        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/30 transition"
      >
        <Trash2 className="w-3.5 h-3.5" /> Delete
      </button>
    </div>
  </div>
);

const AchievementPage = () => {
  const dispatch = useDispatch();
  const achievements = useSelector((s) => s.achievements?.achievements ?? []);
  const loading = useSelector((s) => s.achievements?.loading);

  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [imgs, setImgs] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    dispatch(fetchAchievements());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList);
    setImgs(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const resetModal = useCallback(() => {
    setShowModal(false);
    setEditItem(null);
    setForm(initialForm);
    setImgs([]);
    setPreviews([]);
    setSubmitting(false);
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(initialForm);
    setImgs([]);
    setPreviews([]);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || "",
      year: item.year || "",
      category: item.category || "",
      description: item.description || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
    });
    setPreviews(item.images || []);
    setImgs([]);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.year || !form.category) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    imgs.forEach((f) => fd.append("images", f));
    try {
      if (editItem)
        await dispatch(
          updateAchievement({ id: editItem._id, formData: fd }),
        ).unwrap();
      else await dispatch(createAchievement(fd)).unwrap();
      resetModal();
    } catch {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteAchievement(deleteItem._id));
    setDeleteItem(null);
  };

  const filtered = achievements?.filter(
    (a) =>
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-8">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--edu-primary)" }}
          >
            Achievements
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your awards &amp; accomplishments
          </p>
        </div>
        <button
          onClick={openAdd}
          className="edu-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Achievement
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5 sm:mb-6">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or category…"
            className="edu-input w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition"
          />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "var(--edu-primary)" }}
          />
          <span className="text-sm">Loading records…</span>
        </div>
      ) : (
        <section>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <div className="edu-accent-bar" />
            <Trophy
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "var(--edu-primary)" }}
            />
            All Achievements
            <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
              {filtered?.length} record{filtered?.length !== 1 && "s"}
            </span>
          </h2>

          <div className="sm:hidden">
            {filtered?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                <Trophy className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No achievements found</p>
              </div>
            ) : (
              <div
                className="flex flex-col gap-2.5 overflow-y-auto pr-1"
                style={{ maxHeight: "60vh", WebkitOverflowScrolling: "touch" }}
              >
                {filtered.map((item) => (
                  <MobileAchievementCard
                    key={item._id}
                    item={item}
                    onView={setViewItem}
                    onEdit={openEdit}
                    onDelete={setDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="edu-table-header">
                  <tr>
                    {TABLE_HEADERS.map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="p-10 text-center text-gray-400"
                      >
                        <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No achievements found
                      </td>
                    </tr>
                  ) : (
                    filtered?.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                      >
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                          {item.title}
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">
                          {item.year}
                        </td>
                        <td className="p-4">
                          <span className="edu-badge">{item.category}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {parseTags(item)
                              .slice(0, 3)
                              .map((tag, i) => (
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
                            {parseTags(item).length > 3 && (
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  background: "var(--edu-light)",
                                  color: "var(--edu-accent)",
                                }}
                              >
                                +{parseTags(item).length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {item.images?.slice(0, 2).map((img, i) => (
                              <img
                                key={i}
                                src={img}
                                className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                alt=""
                              />
                            ))}
                            {item.images?.length > 2 && (
                              <div
                                className="w-12 h-12 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-semibold"
                                style={{
                                  background: "var(--edu-light)",
                                  color: "var(--edu-primary)",
                                }}
                              >
                                +{item.images.length - 2}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <span className="edu-tooltip-wrap">
                              <button
                                onClick={() => setViewItem(item)}
                                className="p-2 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <span className="edu-tooltip-box">
                                <span className="edu-tooltip-label">
                                  View Details
                                </span>
                                <span className="edu-tooltip-arrow" />
                              </span>
                            </span>
                            <span className="edu-tooltip-wrap">
                              <button
                                onClick={() => openEdit(item)}
                                className="p-2 rounded-lg transition text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <span className="edu-tooltip-box">
                                <span className="edu-tooltip-label">Edit</span>
                                <span className="edu-tooltip-arrow" />
                              </span>
                            </span>
                            <span className="edu-tooltip-wrap">
                              <button
                                onClick={() => setDeleteItem(item)}
                                className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <span className="edu-tooltip-box">
                                <span className="edu-tooltip-label">
                                  Delete
                                </span>
                                <span className="edu-tooltip-arrow" />
                              </span>
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editItem ? "Update Achievement" : "Add Achievement"}
                </h2>
              </div>
              <button
                onClick={resetModal}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FORM_FIELDS.map(
                    ({ name, label, placeholder, required, col }) => (
                      <div
                        key={name}
                        className={col === "full" ? "md:col-span-2" : ""}
                      >
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                          {label}
                        </label>
                        <input
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className={inputCls}
                          required={required}
                        />
                      </div>
                    ),
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your achievement…"
                    rows={3}
                    className={inputCls + " resize-none"}
                  />
                </div>
                <div>
                  <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Images{" "}
                    {!editItem && (
                      <span className="text-gray-400 font-normal">
                        (optional)
                      </span>
                    )}
                  </p>
                  <label className="cursor-pointer block">
                    <div
                      className={`edu-upload-zone ${previews.length ? "has-image" : ""}`}
                    >
                      {previews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {previews.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              className="w-full h-24 sm:h-28 object-cover rounded"
                              alt={`preview-${i}`}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-24 sm:h-28 text-gray-400">
                          <Upload className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
                          <span className="text-xs">
                            Click to upload images
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.length) handleFiles(e.target.files);
                      }}
                    />
                  </label>
                  {editItem && previews.length > 0 && imgs.length === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Current images shown — upload new ones to replace them.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="edu-modal-footer border-t border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3 sm:py-4 flex-shrink-0">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="edu-btn-primary w-full py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {editItem ? "Updating…" : "Creating…"}
                  </>
                ) : editItem ? (
                  "Update Achievement"
                ) : (
                  "Create Achievement"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Achievement Details
                </h2>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-y-auto">
              <div className="space-y-5 sm:space-y-6">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white capitalize"
                  style={{ background: "var(--edu-primary)" }}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  {viewItem.category}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Title
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                      {viewItem.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Year
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {viewItem.year}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Category
                    </p>
                    <span className="edu-badge">{viewItem.category}</span>
                  </div>
                  {viewItem.description && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {viewItem.description}
                      </p>
                    </div>
                  )}
                </div>
                {parseTags(viewItem).length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Tags
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parseTags(viewItem).map((tag, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: "var(--edu-light)",
                            color: "var(--edu-primary)",
                          }}
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {viewItem.images?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Documents / Images
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {viewItem.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="w-full h-36 sm:h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                          alt={`doc-${i}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-5 sm:p-6">
            <div className="sm:hidden w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Delete Achievement?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {deleteItem.title}
              </strong>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteItem(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementPage;
