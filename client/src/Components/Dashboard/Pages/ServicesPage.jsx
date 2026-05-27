import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  clearMessages,
  selectServices,
  selectServiceLoading,
  selectActionLoading,
  selectError,
  selectActionError,
  selectSuccessMessage,
} from "../../../redux-store/ServiceSlice";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Pencil,
  X,
  Upload,
  Loader2,
  FolderKanban,
} from "lucide-react";

const initialForm = { title: "", description: "" };

const inputCls =
  "edu-input w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30 focus:border-[var(--edu-primary)]";
const TABLE_HEADERS = ["Service", "Description", "Images", "Date", "Actions"];
const MobileServiceCard = ({ item, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
    <div className="flex items-start justify-between gap-2 mb-2">
      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight">
        {item.title}
      </p>
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onView(item)}
          className="p-1.5 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg transition text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-1.5 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
      {item.description}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {item.images?.slice(0, 2).map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
            alt=""
          />
        ))}
      </div>
      <span className="text-xs text-gray-400">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
    </div>
  </div>
);
const ServicesPage = () => {
  const dispatch = useDispatch();
  const services = useSelector(selectServices) ?? [];
  const loading = useSelector(selectServiceLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectError);
  const actionError = useSelector(selectActionError);
  const successMsg = useSelector(selectSuccessMessage);

  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);
  useEffect(() => {
    if (error || actionError) dispatch(clearMessages());
  }, [error, actionError, dispatch]);
  useEffect(() => {
    if (successMsg) {
      dispatch(clearMessages());
      resetModal();
    }
  }, [successMsg, dispatch]);

  const resetModal = () => {
    setShowModal(false);
    setEditItem(null);
    setForm(initialForm);
    setImage1(null);
    setImage2(null);
    setPreview1(null);
    setPreview2(null);
    setSubmitting(false);
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(initialForm);
    setPreview1(null);
    setPreview2(null);
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title || "", description: item.description || "" });
    setPreview1(item.images?.[0] || null);
    setPreview2(item.images?.[1] || null);
    setImage1(null);
    setImage2(null);
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile1 = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage1(f);
    setPreview1(URL.createObjectURL(f));
  };
  const handleFile2 = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage2(f);
    setPreview2(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) {
      alert("Title and description are required");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (image1) fd.append("images", image1);
    if (image2) fd.append("images", image2);
    try {
      if (editItem)
        await dispatch(
          updateService({ id: editItem._id, formData: fd }),
        ).unwrap();
      else await dispatch(createService(fd)).unwrap();
      resetModal();
    } catch {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteService(deleteTarget._id));
    setDeleteTarget(null);
  };

  const filtered = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-8">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--edu-primary)" }}
          >
            Services
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your offered services
          </p>
        </div>
        <button
          onClick={openAdd}
          className="edu-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* ── SEARCH ── */}
      <div className="mb-5 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="edu-input w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30 max-w-md"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "var(--edu-primary)" }}
          />
          <span className="text-sm">Loading services…</span>
        </div>
      ) : (
        <section>
          <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
            <div className="edu-accent-bar" />
            <FolderKanban
              className="w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "var(--edu-primary)" }}
            />
            All Services
            <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
              {filtered.length} record{filtered.length !== 1 && "s"}
            </span>
          </h2>

          {/* Mobile: cards */}
          <div className="grid gap-3 sm:hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                <FolderKanban className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No services found</p>
              </div>
            ) : (
              filtered.map((item) => (
                <MobileServiceCard
                  key={item._id}
                  item={item}
                  onView={setViewItem}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              ))
            )}
          </div>

          {/* Desktop: table */}
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
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={TABLE_HEADERS.length}
                        className="p-10 text-center text-gray-400"
                      >
                        <FolderKanban className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No services found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                      >
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                          {item.title}
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs">
                          <p className="line-clamp-2 text-sm">
                            {item.description}
                          </p>
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
                            {(!item.images || item.images.length === 0) && (
                              <span className="text-gray-300 dark:text-gray-600 text-sm">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
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
                                onClick={() => setDeleteTarget(item)}
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
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editItem ? "Update Service" : "Add Service"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Service Title *
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title of the Service"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description of the Service"
                    rows={3}
                    className={inputCls + " resize-none"}
                  />
                </div>

                {/* Image uploads — responsive grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      label: "Image 1",
                      preview: preview1,
                      handler: handleFile1,
                    },
                    {
                      label: "Image 2",
                      preview: preview2,
                      handler: handleFile2,
                    },
                  ].map(({ label, preview, handler }) => (
                    <div key={label}>
                      <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 sm:mb-2">
                        {label}
                      </p>
                      <label className="cursor-pointer block">
                        <div
                          className={`edu-upload-zone border-2 border-dashed rounded-xl overflow-hidden ${preview ? "border-[var(--edu-primary)]/30" : "border-gray-200 dark:border-gray-700"}`}
                        >
                          {preview ? (
                            <img
                              src={preview}
                              className="w-full h-24 sm:h-32 object-cover rounded"
                              alt=""
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-24 sm:h-32 text-gray-400 gap-1">
                              <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                              <span className="text-xs">Click to upload</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handler}
                        />
                      </label>
                    </div>
                  ))}
                </div>

                {editItem && (preview1 || preview2) && !image1 && !image2 && (
                  <p className="text-xs text-gray-400">
                    Current images shown — upload new ones to replace them.
                  </p>
                )}
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
                  "Update Service"
                ) : (
                  "Create Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {viewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Service Details
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
              <div className="space-y-5">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--edu-primary)" }}
                >
                  <FolderKanban className="w-3.5 h-3.5" /> Service
                </span>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Title
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">
                    {viewItem.title}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {viewItem.description}
                  </p>
                </div>
                {viewItem.images?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Images
                    </p>
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                      {viewItem.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          className="w-full h-36 sm:h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                          alt={`img-${i}`}
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
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl p-5 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                  Delete Service?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {deleteTarget.title}
              </strong>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
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

export default ServicesPage;
