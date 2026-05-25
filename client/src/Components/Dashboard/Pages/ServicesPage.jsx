
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
  Plus, Search, Eye, Trash2, Pencil, X,
  Upload, Loader2, FolderKanban,
} from "lucide-react";
const initialForm = { title: "", description: "" };
const inputCls =
  "edu-input w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition";
const TABLE_HEADERS = ["Service", "Description", "Images", "Date", "Actions"];
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

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

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
    setImage1(null); setImage2(null);
    setPreview1(null); setPreview2(null);
    setSubmitting(false);
  };

  const openAdd = () => { setEditItem(null); setForm(initialForm); setPreview1(null); setPreview2(null); setShowModal(true); };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title || "", description: item.description || "" });
    setPreview1(item.images?.[0] || null);
    setPreview2(item.images?.[1] || null);
    setImage1(null); setImage2(null);
    setShowModal(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile1 = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setImage1(f); setPreview1(URL.createObjectURL(f));
  };
  const handleFile2 = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setImage2(f); setPreview2(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) { alert("Title and description are required"); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    if (image1) fd.append("images", image1);
    if (image2) fd.append("images", image2);
    try {
      if (editItem) await dispatch(updateService({ id: editItem._id, formData: fd })).unwrap();
      else await dispatch(createService(fd)).unwrap();
      resetModal();
    } catch { setSubmitting(false); }
  };

  const handleDelete = async () => {
    await dispatch(deleteService(deleteTarget._id));
    setDeleteTarget(null);
  };

  const filtered = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--edu-primary)" }}>
            Services
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your offered services
          </p>
        </div>
        <button onClick={openAdd} className="edu-btn-primary flex items-center gap-2 px-5 py-3 rounded-lg">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="edu-input w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--edu-primary)" }} />
          <span>Loading services…</span>
        </div>
      ) : (
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
            <div className="edu-accent-bar" />
            <FolderKanban className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
            All Services
            <span className="ml-auto text-sm font-normal text-gray-400">
              {filtered.length} record{filtered.length !== 1 && "s"}
            </span>
          </h2>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="edu-table-header">
                  <tr>{TABLE_HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={TABLE_HEADERS.length} className="p-10 text-center text-gray-400">
                        <FolderKanban className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        No services found
                      </td>
                    </tr>
                  ) : filtered.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">

                      {/* Title */}
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.title}</td>

                      {/* Description */}
                      <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs">
                        <p className="line-clamp-2">{item.description}</p>
                      </td>

                      {/* Images */}
                      <td className="p-4">
                        <div className="flex gap-2">
                          {item.images?.slice(0, 2).map((img, i) => (
                            <img key={i} src={img}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                              alt="" />
                          ))}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex gap-1">
                          <span className="edu-tooltip-wrap">
                            <button onClick={() => setViewItem(item)} className="p-2 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20">
                              <Eye className="w-4 h-4" />
                            </button>
                            <span className="edu-tooltip-box"><span className="edu-tooltip-label">View Details</span><span className="edu-tooltip-arrow" /></span>
                          </span>
                          <span className="edu-tooltip-wrap">
                            <button onClick={() => openEdit(item)} className="p-2 rounded-lg transition text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <span className="edu-tooltip-box"><span className="edu-tooltip-label">Edit</span><span className="edu-tooltip-arrow" /></span>
                          </span>
                          <span className="edu-tooltip-wrap">
                            <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="edu-tooltip-box"><span className="edu-tooltip-label">Delete</span><span className="edu-tooltip-arrow" /></span>
                          </span>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">

            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editItem ? "Update Service" : "Add Service"}
                </h2>
              </div>
              <button onClick={resetModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body">
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Title *</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="Title of the Service" className={inputCls} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange}
                    placeholder="Description of the Service" rows={3}
                    className={inputCls + " resize-none"} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image 1</p>
                    <label className="cursor-pointer block">
                      <div className={`edu-upload-zone ${preview1 ? "has-image" : ""}`}>
                        {preview1 ? (
                          <img src={preview1} className="w-full h-32 object-cover rounded" alt="" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                            <Upload className="w-8 h-8 mb-2" /><span className="text-xs">Click to upload</span>
                          </div>
                        )}
                      </div>
                      <input type="file" hidden accept="image/*" onChange={handleFile1} />
                    </label>
                  </div>
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image 2</p>
                    <label className="cursor-pointer block">
                      <div className={`edu-upload-zone ${preview2 ? "has-image" : ""}`}>
                        {preview2 ? (
                          <img src={preview2} className="w-full h-32 object-cover rounded" alt="" />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-32 text-gray-400">
                            <Upload className="w-8 h-8 mb-2" /><span className="text-xs">Click to upload</span>
                          </div>
                        )}
                      </div>
                      <input type="file" hidden accept="image/*" onChange={handleFile2} />
                    </label>
                  </div>
                </div>

                {editItem && (preview1 || preview2) && !image1 && !image2 && (
                  <p className="text-xs text-gray-400">Current images shown — upload new ones to replace them.</p>
                )}

              </div>
            </div>

            <div className="edu-modal-footer border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="edu-btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" />{editItem ? "Updating…" : "Creating…"}</>
                  : editItem ? "Update Service" : "Create Service"}
              </button>
            </div>

          </div>
        </div>
      )}


      {viewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">

            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Service Details</h2>
              </div>
              <button onClick={() => setViewItem(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body">
              <div className="space-y-6">

                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--edu-primary)" }}>
                  <FolderKanban className="w-3.5 h-3.5" /> Service
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{viewItem.title}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{viewItem.description}</p>
                  </div>
                </div>

                {viewItem.images?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Images</p>
                    <div className="grid grid-cols-2 gap-4">
                      {viewItem.images.map((img, i) => (
                        <img key={i} src={img}
                          className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                          alt={`img-${i}`} />
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Service?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">{deleteTarget.title}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold"
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