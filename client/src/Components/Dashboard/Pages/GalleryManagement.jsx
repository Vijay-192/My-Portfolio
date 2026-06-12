import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  ChevronLeft,
  ChevronRight,
  Image,
  Video,
  X,
  Check,
  AlertCircle,
  Loader2,
  PackageOpen,
} from "lucide-react";
import {
  fetchGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  clearGalleryError,
  selectGallery,
  selectGalleryLoading,
  selectActionLoading,
  selectGalleryError,
  selectActionError,
  selectSuccessMessage,
} from "../../../redux-store/GallerySlice";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  tags: "",
  isFeatured: false,
  order: 0,
};

function GallerySkeleton({ view }) {
  if (view === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="sk w-14 h-14 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="sk h-3.5 w-1/3" />
              <div className="sk h-2.5 w-1/4" />
            </div>
            <div className="sk h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
        >
          <div className="sk aspect-square" />
          <div className="p-3 space-y-2 bg-white dark:bg-gray-900">
            <div className="sk h-3 w-3/4" />
            <div className="sk h-2.5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl fade-up text-sm font-medium ${
        type === "success"
          ? "bg-[--edu-primary] text-white"
          : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <Check className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}

function MediaThumb({ item, allowNav = false }) {
  const [index, setIndex] = useState(0);
  const media = item?.media || [];
  const total = media.length;
  const current = media[index];

  const goPrev = (e) => {
    e.stopPropagation();
    setIndex((i) => (i - 1 + total) % total);
  };
  const goNext = (e) => {
    e.stopPropagation();
    setIndex((i) => (i + 1) % total);
  };

  if (!current?.url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
        <Image className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-900 overflow-hidden">
      {current.type === "video" ? (
        <video
          src={current.url}
          className="relative w-full h-full object-contain"
          muted
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      ) : (
        <img
          src={current.url}
          alt=""
          className="relative w-full h-full object-contain"
        />
      )}

      {allowNav && total > 1 && (
        <>
          <span className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full tabular-nums">
            {index + 1}/{total}
          </span>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous media"
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
              bg-black/40 hover:bg-[--edu-primary] text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next media"
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
              bg-black/40 hover:bg-[--edu-primary] text-white flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

function MediaViewer({ media, initialIndex = 0, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  const total = media.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl px-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        <button
          onClick={prev}
          className={`absolute left-0 z-10 ml-1 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ${total <= 1 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Media */}
        <div className="w-full aspect-video bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
          {media[idx]?.type === "video" ? (
            <video
              src={media[idx].url}
              className="max-h-[80vh] max-w-full rounded-xl"
              controls
              autoPlay
            />
          ) : (
            <img
              src={media[idx]?.url}
              alt=""
              className="max-h-[80vh] max-w-full object-contain rounded-xl"
            />
          )}
        </div>

        {/* Next */}
        <button
          onClick={next}
          className={`absolute right-0 z-10 mr-1 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ${total <= 1 ? "opacity-0 pointer-events-none" : ""}`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Counter */}
      {total > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {media.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${i === idx ? "bg-white w-4" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryForm({ editItem, onClose }) {
  const dispatch = useDispatch();
  const actionLoading = useSelector(selectActionLoading);
  const actionError = useSelector(selectActionError);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const [form, setForm] = useState(
    editItem
      ? {
          title: editItem.title,
          description: editItem.description || "",
          category: editItem.category || "",
          tags: editItem.tags?.join(", ") || "",
          isFeatured: editItem.isFeatured,
          order: editItem.order ?? 0,
        }
      : EMPTY_FORM,
  );
  const [removeIds, setRemoveIds] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []);
    setPreviews(
      files.map((f) => ({ url: URL.createObjectURL(f), type: "image" })),
    );
  };

  const toggleRemove = (publicId) =>
    setRemoveIds((p) =>
      p.includes(publicId) ? p.filter((x) => x !== publicId) : [...p, publicId],
    );

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    removeIds.forEach((id) => fd.append("removeMediaIds", id));
    Array.from(imageRef.current?.files || []).forEach((f) =>
      fd.append("images", f),
    );
    Array.from(videoRef.current?.files || []).forEach((f) =>
      fd.append("video", f),
    );
    const result = editItem
      ? await dispatch(updateGalleryItem({ id: editItem._id, formData: fd }))
      : await dispatch(createGalleryItem(fd));
    if (!result.error) onClose();
  };

  const inputCls =
    "w-full bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[--edu-primary] focus:ring-1 focus:ring-[--edu-primary]/20 transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-[3px] h-5 rounded-full bg-[--edu-primary]" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {editItem ? "Edit Gallery Item" : "Add Gallery Item"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {actionError && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Brand Identity Project"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Short description…"
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. branding"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                  Order
                </label>
                <input
                  name="order"
                  type="number"
                  value={form.order}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Tags{" "}
                <span className="text-gray-400 dark:text-gray-500 normal-case font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="design, logo, web"
                className={inputCls}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-[--edu-primary] transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Mark as featured
              </span>
            </label>
          </div>

          {/* Existing media */}
          {editItem?.media?.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                Current media
              </label>
              <div className="grid grid-cols-5 gap-2">
                {editItem.media.map((m) => (
                  <button
                    key={m.publicId}
                    type="button"
                    onClick={() => toggleRemove(m.publicId)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      removeIds.includes(m.publicId)
                        ? "border-red-500 opacity-50"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <MediaThumb item={m} />
                    {removeIds.includes(m.publicId) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-500/30">
                        <X className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {removeIds.length > 0 && (
                <p className="text-xs text-red-500 mt-1.5">
                  {removeIds.length} file(s) will be removed on save.
                </p>
              )}
            </div>
          )}

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
              {editItem ? "Add more images" : "Images *"}
            </label>
            <div
              onClick={() => imageRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-[--edu-primary] rounded-xl p-4 transition-colors"
            >
              <input
                ref={imageRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagePick}
              />
              {previews.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {previews.map((p, i) => (
                    <img
                      key={i}
                      src={p.url}
                      className="h-16 w-16 object-cover rounded-lg"
                      alt=""
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5 py-2 text-gray-400 dark:text-gray-500">
                  <Image className="w-6 h-6" />
                  <span className="text-sm">Click to select images</span>
                  <span className="text-xs">JPG, PNG, WEBP, GIF</span>
                </div>
              )}
            </div>
          </div>

          {/* Video upload */}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={actionLoading}
            className="edu-btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {actionLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            ) : editItem ? (
              "Save changes"
            ) : (
              "Add item"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
          Delete item?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">
          "{item.title}"
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          All assets will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <PackageOpen className="w-7 h-7 text-gray-400 dark:text-gray-500" />
      </div>
      <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
        No gallery items yet
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mb-5">
        Add your first item to build your portfolio gallery.
      </p>
      <button
        onClick={onAdd}
        className="edu-btn-primary flex items-center gap-2 px-5 py-2 rounded-lg text-sm cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add first item
      </button>
    </div>
  );
}

function GridCard({ item, onEdit, onDelete, onView }) {
  return (
    <div className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-[--edu-primary]/40 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-200">
      <div
        className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
        onClick={() => item.media?.length > 0 && onView(item, 0)}
      >
        <MediaThumb item={item} allowNav />

        {/* Badges */}
        {item.isFeatured && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 bg-[--edu-primary] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <Star className="w-2.5 h-2.5" /> Featured
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-[--edu-primary] text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
          {item.title}
        </p>
        {item.category && (
          <p className="text-xs text-[--edu-accent] capitalize mt-0.5 font-medium">
            {item.category}
          </p>
        )}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                +{item.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({ item, onEdit, onDelete, onView }) {
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-[--edu-primary]/40 hover:shadow-md dark:hover:shadow-black/20 transition-all duration-200">
      <div
        className="relative w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 cursor-pointer"
        onClick={() => item.media?.length > 0 && onView(item, 0)}
      >
        <MediaThumb item={item} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
            {item.title}
          </p>
          {item.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-[--edu-primary]/10 text-[--edu-primary] text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0">
              <Star className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
            {item.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {item.category && (
            <span className="text-[10px] text-[--edu-accent] font-medium capitalize">
              {item.category}
            </span>
          )}
          {item.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 px-1.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {item.media?.length > 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">
          {item.media.length} file{item.media.length !== 1 ? "s" : ""}
        </span>
      )}

      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-[--edu-primary] hover:text-[--edu-primary] flex items-center justify-center transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function GalleryManagement({ view: externalView }) {
  const dispatch = useDispatch();
  const items = useSelector(selectGallery);
  const loading = useSelector(selectGalleryLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectGalleryError);
  const successMsg = useSelector(selectSuccessMessage);

  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [view, setView] = useState(externalView || "grid");
  const [viewer, setViewer] = useState(null); // { item, index }

  useEffect(() => {
    dispatch(fetchGallery());
    return () => dispatch(clearGalleryError());
  }, [dispatch]);

  useEffect(() => {
    if (externalView) setView(externalView);
  }, [externalView]);
  useEffect(() => {
    if (successMsg) setToast({ message: successMsg, type: "success" });
  }, [successMsg]);
  useEffect(() => {
    if (error) setToast({ message: error, type: "error" });
  }, [error]);

  const categories = [
    "all",
    ...new Set(items.map((i) => i.category).filter(Boolean)),
  ];

  const filtered = items.filter((item) => {
    const matchCat = filterCat === "all" || item.category === filterCat;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.tags?.some((t) => t.toLowerCase().includes(q)) ||
      item.category?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Group filtered items category-wise so the management view mirrors
  // the public gallery's category sections.
  const groupedFiltered = filtered.reduce((acc, item) => {
    const cat = item.category?.trim() || "Uncategorized";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  const groupedEntries = Object.entries(groupedFiltered);

  const openAdd = () => {
    setEditItem(null);
    setShowForm(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setShowForm(true);
  };
  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
  };
  const openView = (item, index) => setViewer({ item, index });

  const confirmDelete = async () => {
    await dispatch(deleteGalleryItem(deleteTarget._id));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-[3px] h-6 rounded-full bg-[--edu-primary]" />
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Gallery
              </h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* View toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 gap-0.5">
              <button
                onClick={() => setView("grid")}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  view === "grid"
                    ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  view === "list"
                    ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>
            </div>

            <button
              onClick={openAdd}
              className="edu-btn-primary flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, tag, category…"
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[--edu-primary] focus:ring-1 focus:ring-[--edu-primary]/20 transition-colors w-56"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                  filterCat === cat
                    ? "bg-[--edu-primary] text-white"
                    : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-[--edu-primary]/40 hover:text-[--edu-primary]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* States */}
        {loading && <GallerySkeleton view={view} />}
        {!loading && items.length === 0 && <EmptyState onAdd={openAdd} />}
        {!loading && items.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No results for "{search}"</p>
          </div>
        )}

        {/* Category-wise sections */}
        {!loading &&
          groupedEntries.map(([cat, catItems], idx) => (
            <div key={cat} className={idx > 0 ? "mt-8" : ""}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-2 h-2 rounded-full bg-[--edu-primary] shrink-0" />
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">
                  {cat}
                </h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {catItems.length} {catItems.length === 1 ? "item" : "items"}
                </span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
              </div>

              {view === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {catItems.map((item) => (
                    <GridCard
                      key={item._id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                      onView={openView}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {catItems.map((item) => (
                    <ListRow
                      key={item._id}
                      item={item}
                      onEdit={openEdit}
                      onDelete={setDeleteTarget}
                      onView={openView}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Modals */}
      {showForm && <GalleryForm editItem={editItem} onClose={closeForm} />}
      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          loading={actionLoading}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Media viewer */}
      {viewer && (
        <MediaViewer
          media={viewer.item.media}
          initialIndex={viewer.index}
          onClose={() => setViewer(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDone={() => {
            setToast(null);
            dispatch(clearGalleryError());
          }}
        />
      )}
    </div>
  );
}
