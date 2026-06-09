import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  clearMessages,
  clearSelectedProject,
  selectProjects,
  selectProjectLoading,
  selectActionLoading,
  selectError,
  selectActionError,
  selectSuccessMessage,
} from "../../../redux-store/Projectslice";
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
  Tag,
  Link,
  Github,
  ChevronLeft,
  ChevronRight,
  Globe,
  Calendar,
  Briefcase,
  Lightbulb,
  Target,
  Star,
  User,
  Package,
  Filter,
  CheckCircle,
  AlertCircle,
} from "lucide-react";


const CATEGORIES = ["Web", "Mobile", "Desktop", "AI/ML", "Backend", "Other"];
const INDUSTRIES = [
  "Web", "App", "Desktop", "AI/ML", "E-Commerce",
  "Healthcare", "Finance", "Education", "Other",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR - i);

const initialForm = {
  title: "",
  description: "",
  liveLink: "",
  githubLink: "",
  category: "",
  industry: "",
  publishYear: String(CURRENT_YEAR),
  problemStatement: "",
  solution: "",
};

const inputCls =
  "edu-input w-full px-3 py-2.5 sm:px-4 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30 focus:border-[var(--edu-primary)]";

const TABLE_HEADERS = ["Project", "Industry", "Tech Stack", "Links", "Date", "Actions"];

const parseTechStack = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((t) => t.trim()).filter(Boolean);
  try {
    const p = JSON.parse(value);
    if (Array.isArray(p)) return p.map((t) => t.trim()).filter(Boolean);
  } catch (_) {}
  return value.split(",").map((t) => t.trim()).filter(Boolean);
};


let _addToast = null;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (msg, type = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, msg, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };
    return () => { _addToast = null; };
  }, []);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slide-in
            ${t.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200"
              : "bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
            }`}
        >
          {t.type === "success"
            ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            : <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
          }
          <span className="flex-1">{t.msg}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const showToast = (msg, type = "success") => {
  if (_addToast) _addToast(msg, type);
};

const TagInput = ({ tags = [], onChange, placeholder }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const addTags = (raw) => {
    const incoming = raw
      .split(/[\n,]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const merged = [...new Set([...tags, ...incoming])];
    onChange(merged);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (input.trim()) { addTags(input); setInput(""); }
    }
    if (e.key === "Backspace" && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    addTags(pasted);
    setInput("");
  };

  const removeTag = (i) => onChange(tags.filter((_, idx) => idx !== i));

  return (
    <div
      className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-text min-h-[44px] focus-within:ring-2 focus-within:ring-[var(--edu-primary)]/30 focus-within:border-[var(--edu-primary)]"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
        >
          {tag}
          <button type="button" onClick={() => removeTag(i)} className="hover:opacity-70 transition">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={() => { if (input.trim()) { addTags(input); setInput(""); } }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
      />
    </div>
  );
};


const YearPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = parseInt(value) || CURRENT_YEAR;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls} flex items-center gap-2 text-left`}
      >
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="flex-1">{value || "Select year"}</span>
        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
          <p className="text-xs text-gray-400 mb-2 text-center">Select publish year</p>
          <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => { onChange(String(y)); setOpen(false); }}
                className={`py-2 rounded-lg text-sm font-medium transition
                  ${y === CURRENT_YEAR ? "ring-1 ring-[var(--edu-primary)]" : ""}
                  ${selected === y
                    ? "text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                style={selected === y ? { background: "var(--edu-primary)" } : {}}
              >
                {y}
                {y === CURRENT_YEAR && selected !== y && (
                  <span className="block text-[9px] text-gray-400">Current</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageCarousel = ({ images = [] }) => {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;
  return (
    <div className="relative w-full">
      <img
        src={images[idx]}
        alt={`project-${idx}`}
        className="w-full h-40 sm:h-52 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-2 h-2 rounded-full transition ${i === idx ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const MobileProjectCard = ({ item, onView, onEdit, onDelete }) => {
  const tags = parseTechStack(item.techStack);
  const thumb = item.projectIcon || item.images?.[0];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {thumb ? (
          <img src={thumb} alt={item.title}
            className="w-12 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
          >
            {item.title?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">{item.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {item.category && (
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">{item.category}</span>
            )}
            {item.industry && (
              <span className="text-xs text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 px-2 py-0.5 rounded-full">{item.industry}</span>
            )}
            {item.publishYear && (
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />{item.publishYear}
              </span>
            )}
          </div>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.slice(0, 4).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
            >
              <Tag className="w-2.5 h-2.5" />{t}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: "var(--edu-light)", color: "var(--edu-accent)" }}
            >+{tags.length - 4}</span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
          {item.liveLink && (
            <a href={item.liveLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:opacity-80 transition"
            >
              <Link className="w-3 h-3" /> Live
            </a>
          )}
          {item.githubLink && (
            <a href={item.githubLink} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:opacity-80 transition"
            >
              <Github className="w-3 h-3" /> GitHub
            </a>
          )}
        </div>
        <div className="flex gap-1">
          <button onClick={() => onView(item)} className="p-2 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"><Eye className="w-4 h-4" /></button>
          <button onClick={() => onEdit(item)} className="p-2 rounded-lg transition text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"><Pencil className="w-4 h-4" /></button>
          <button onClick={() => onDelete(item)} className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects) ?? [];
  const loading = useSelector(selectProjectLoading);
  const actionLoading = useSelector(selectActionLoading);
  const error = useSelector(selectError);
  const actionError = useSelector(selectActionError);
  const successMsg = useSelector(selectSuccessMessage);


  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);


  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showFilter, setShowFilter] = useState(false);


  const [form, setForm] = useState(initialForm);
  const [techStackTags, setTechStackTags] = useState([]);
  const [deliverablesTags, setDeliverablesTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [testimonialName, setTestimonialName] = useState("");
  const [testimonialPost, setTestimonialPost] = useState("");
  const [testimonialDescription, setTestimonialDescription] = useState("");


  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);


  useEffect(() => {
    if (successMsg) {
      showToast(successMsg, "success");
      dispatch(clearMessages());
      resetModal();
    }
  }, [successMsg]);

  /* toast on error */
  useEffect(() => {
    if (actionError) {
      showToast(
        typeof actionError === "string" ? actionError : actionError?.message || "Something went wrong",
        "error"
      );
      dispatch(clearMessages());
      setSubmitting(false);
    }
  }, [actionError]);

  useEffect(() => {
    if (error) {
      showToast(typeof error === "string" ? error : "Failed to load projects", "error");
      dispatch(clearMessages());
    }
  }, [error]);

  useEffect(() => {
    if (editItem) {
      setForm({
        title: editItem.title || "",
        description: editItem.description || "",
        liveLink: editItem.liveLink || "",
        githubLink: editItem.githubLink || "",
        category: editItem.category || "",
        industry: editItem.industry || "",
        publishYear: editItem.publishYear?.toString() || String(CURRENT_YEAR),
        problemStatement: editItem.problemStatement || "",
        solution: editItem.solution || "",
      });
      setTechStackTags(parseTechStack(editItem.techStack));
      setDeliverablesTags(parseTechStack(editItem.deliverables));
      setExistingImages(editItem.images || []);
      setIconPreview(editItem.projectIcon || null);
      setProfilePreview(editItem.testimonial?.profileImage || null);
      setTestimonialName(editItem.testimonial?.name || "");
      setTestimonialPost(editItem.testimonial?.post || "");
      setTestimonialDescription(editItem.testimonial?.description || "");
      setNewImageFiles([]);
      setNewImagePreviews([]);
      setVideoFile(null);
      setIconFile(null);
      setProfileFile(null);
    }
  }, [editItem]);

  const resetModal = useCallback(() => {
    setShowModal(false);
    setEditItem(null);
    setForm(initialForm);
    setTechStackTags([]);
    setDeliverablesTags([]);
    setActiveTab("basic");
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setVideoFile(null);
    setIconFile(null);
    setIconPreview(null);
    setProfileFile(null);
    setProfilePreview(null);
    setTestimonialName("");
    setTestimonialPost("");
    setTestimonialDescription("");
    setSubmitting(false);
    dispatch(clearSelectedProject());
  }, [dispatch]);

  const openAdd = () => {
    setEditItem(null);
    setForm(initialForm);
    setTechStackTags([]);
    setDeliverablesTags([]);
    setExistingImages([]);
    setNewImageFiles([]);
    setNewImagePreviews([]);
    setIconPreview(null);
    setProfilePreview(null);
    setTestimonialName("");
    setTestimonialPost("");
    setTestimonialDescription("");
    setShowModal(true);
  };

  const openEdit = (p) => { setEditItem(p); setShowModal(true); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const totalAllowed = 7 - existingImages.length - newImageFiles.length;
    const toAdd = files.slice(0, totalAllowed);
    setNewImageFiles((prev) => [...prev, ...toAdd]);
    setNewImagePreviews((prev) => [...prev, ...toAdd.map((f) => URL.createObjectURL(f))]);
    e.target.value = ""; // reset so same file can be re-added
  };

  const removeExistingImage = (i) => setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  const removeNewImage = (i) => {
    setNewImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
    setNewImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleIconChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setIconFile(f);
    setIconPreview(URL.createObjectURL(f));
  };

  const handleProfileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setProfileFile(f);
    setProfilePreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      showToast("Project title is required", "error");
      setActiveTab("basic");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();

   
    Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });

    fd.append("techStack", JSON.stringify(techStackTags));
    fd.append("deliverables", JSON.stringify(deliverablesTags));


    if (testimonialName) fd.append("testimonialName", testimonialName);
    if (testimonialPost) fd.append("testimonialPost", testimonialPost);
    if (testimonialDescription) fd.append("testimonialDescription", testimonialDescription);


    newImageFiles.forEach((f) => fd.append("images", f));
    if (editItem && existingImages.length) {
      fd.append("existingImages", JSON.stringify(existingImages));
    }
    if (videoFile) fd.append("video", videoFile);
    if (iconFile) fd.append("projectIcon", iconFile);
    if (profileFile) fd.append("profileImage", profileFile);

    try {
      if (editItem) {
        await dispatch(updateProject({ id: editItem._id, formData: fd })).unwrap();
      } else {
        await dispatch(createProject(fd)).unwrap();
      }
     
    } catch {

      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProject(deleteTarget._id)).unwrap();
      showToast("Project deleted", "success");
    } catch {
      showToast("Failed to delete project", "error");
    }
    setDeleteTarget(null);
  };

  const categories = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filtered = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) &&
      (catFilter === "All" || p.category === catFilter),
  );

  const totalImages = existingImages.length + newImageFiles.length;

  const TABS = [
    { id: "basic", label: "Basic", mobileLabel: "Basic" },
    { id: "details", label: "Details", mobileLabel: "Details" },
    { id: "media", label: "Media", mobileLabel: "Media" },
    { id: "testimonial", label: "Testimonial", mobileLabel: "Testim." },
  ];


  return (
    <>
  
      <ToastContainer />
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.25s ease-out; }
      `}</style>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 sm:p-6">
        {/* PAGE HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--edu-primary)" }}>
              Projects
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your portfolio projects
            </p>
          </div>
          <button
            onClick={openAdd}
            className="edu-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {/* SEARCH + FILTER */}
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="edu-input w-full pl-9 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--edu-primary)]/30"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-300"
          >
            <Filter className="w-4 h-4" />
            {catFilter !== "All" ? catFilter : "Filter"}
          </button>
          {showFilter && (
            <div className="sm:hidden grid grid-cols-3 gap-2">
              {categories.map((c) => (
                <button key={c} onClick={() => { setCatFilter(c); setShowFilter(false); }}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${catFilter === c ? "border-[var(--edu-primary)] text-[var(--edu-primary)] bg-[var(--edu-light)]" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="hidden sm:block edu-input px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition focus:outline-none"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* LIST */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--edu-primary)" }} />
            <span className="text-sm">Loading projects…</span>
          </div>
        ) : (
          <section>
            <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="edu-accent-bar" />
              <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "var(--edu-primary)" }} />
              All Projects
              <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
                {filtered.length} record{filtered.length !== 1 && "s"}
              </span>
            </h2>

            {/* Mobile cards */}
            <div className="grid gap-3 sm:hidden">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                  <FolderKanban className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No projects found</p>
                </div>
              ) : (
                filtered.map((item) => (
                  <MobileProjectCard key={item._id} item={item}
                    onView={setViewItem} onEdit={openEdit} onDelete={setDeleteTarget}
                  />
                ))
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="edu-table-header">
                    <tr>
                      {TABLE_HEADERS.map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={TABLE_HEADERS.length} className="p-10 text-center text-gray-400">
                          <FolderKanban className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No projects found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => {
                        const tags = parseTechStack(item.techStack);
                        const thumb = item.projectIcon || item.images?.[0];
                        return (
                          <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {thumb ? (
                                  <img src={thumb} alt={item.title}
                                    className="w-12 h-10 object-cover rounded-lg border border-gray-200 dark:border-gray-600 flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-10 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold"
                                    style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
                                  >
                                    {item.title?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[160px]">{item.title}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {item.publishYear && (
                                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                        <Calendar className="w-3 h-3" />{item.publishYear}
                                      </span>
                                    )}
                                    {item.category && <span className="text-xs text-gray-400">{item.category}</span>}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {item.industry ? (
                                <span className="edu-badge flex items-center gap-1 w-fit">
                                  <Globe className="w-3 h-3" />{item.industry}
                                </span>
                              ) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                            </td>
                            <td className="p-4">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {tags.slice(0, 3).map((t) => (
                                  <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
                                  >
                                    <Tag className="w-2.5 h-2.5" />{t}
                                  </span>
                                ))}
                                {tags.length > 3 && (
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                                    style={{ background: "var(--edu-light)", color: "var(--edu-accent)" }}
                                  >+{tags.length - 3}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {item.liveLink && (
                                  <a href={item.liveLink} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:opacity-80 transition"
                                  >
                                    <Link className="w-3 h-3" /> Live
                                  </a>
                                )}
                                {item.githubLink && (
                                  <a href={item.githubLink} target="_blank" rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:opacity-80 transition"
                                  >
                                    <Github className="w-3 h-3" /> GitHub
                                  </a>
                                )}
                                {!item.liveLink && !item.githubLink && <span className="text-gray-300 dark:text-gray-600">—</span>}
                              </div>
                            </td>
                            <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap text-xs lg:text-sm">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "—"}
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <span className="edu-tooltip-wrap">
                                  <button onClick={() => setViewItem(item)} className="p-2 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"><Eye className="w-4 h-4" /></button>
                                  <span className="edu-tooltip-box"><span className="edu-tooltip-label">View Details</span><span className="edu-tooltip-arrow" /></span>
                                </span>
                                <span className="edu-tooltip-wrap">
                                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg transition text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"><Pencil className="w-4 h-4" /></button>
                                  <span className="edu-tooltip-box"><span className="edu-tooltip-label">Edit</span><span className="edu-tooltip-arrow" /></span>
                                </span>
                                <span className="edu-tooltip-wrap">
                                  <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button>
                                  <span className="edu-tooltip-box"><span className="edu-tooltip-label">Delete</span><span className="edu-tooltip-arrow" /></span>
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

     
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[95vh] sm:max-h-[92vh] overflow-y-auto flex flex-col">

              {/* Header */}
              <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="edu-accent-bar" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {editItem ? "Update Project" : "Add Project"}
                  </h2>
                </div>
                <button onClick={resetModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

        
              <div className="flex border-b border-gray-200 dark:border-gray-700 px-2 sm:px-6 overflow-x-auto flex-shrink-0 scrollbar-hide">
                {TABS.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id ? "border-current text-current" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                    style={activeTab === tab.id ? { color: "var(--edu-primary)", borderColor: "var(--edu-primary)" } : {}}
                  >
                    <span className="sm:hidden">{tab.mobileLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

        
              <div className="edu-modal-body px-4 sm:px-6 py-4 sm:py-5 flex-1 overflow-y-auto">
                <div className="space-y-4">

           
                  {activeTab === "basic" && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                          <input name="title" value={form.title} onChange={handleChange}
                            placeholder="e.g., My Awesome App" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                          <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                            <option value="">Select category</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            <Globe className="inline w-4 h-4 mr-1" />Industry
                          </label>
                          <select name="industry" value={form.industry} onChange={handleChange} className={inputCls}>
                            <option value="">Select industry</option>
                            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            <Calendar className="inline w-4 h-4 mr-1" />Publish Year
                          </label>
                          <YearPicker
                            value={form.publishYear}
                            onChange={(y) => setForm((prev) => ({ ...prev, publishYear: y }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange}
                          placeholder="Briefly describe your project…" rows={3} className={`${inputCls} resize-none`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          Tech Stack
                          <span className="font-normal text-gray-400 ml-1 text-xs">— type & press Enter or comma, or paste a list</span>
                        </label>
                        <TagInput
                          tags={techStackTags}
                          onChange={setTechStackTags}
                          placeholder="e.g. React, Node.js, MongoDB…"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Live Link</label>
                          <input name="liveLink" value={form.liveLink} onChange={handleChange}
                            placeholder="https://myproject.com" type="url" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">GitHub Link</label>
                          <input name="githubLink" value={form.githubLink} onChange={handleChange}
                            placeholder="https://github.com/…" type="url" className={inputCls} />
                        </div>
                      </div>
                    </>
                  )}

                
                  {activeTab === "details" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <Target className="inline w-4 h-4 mr-1" />Problem Statement
                        </label>
                        <textarea name="problemStatement" value={form.problemStatement} onChange={handleChange}
                          placeholder="What problem did this project solve?" rows={3} className={`${inputCls} resize-none`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <Lightbulb className="inline w-4 h-4 mr-1" />Solution
                        </label>
                        <textarea name="solution" value={form.solution} onChange={handleChange}
                          placeholder="How did you solve it?" rows={3} className={`${inputCls} resize-none`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <Package className="inline w-4 h-4 mr-1" />Deliverables
                          <span className="font-normal text-gray-400 ml-1 text-xs">— type & press Enter or comma, or paste a list</span>
                        </label>
                        <TagInput
                          tags={deliverablesTags}
                          onChange={setDeliverablesTags}
                          placeholder="e.g. REST API, Admin Dashboard…"
                        />
                        <p className="text-xs text-gray-400 mt-1">What was delivered to the client?</p>
                      </div>
                    </>
                  )}

                  {activeTab === "media" && (
                    <>
                      {/* Icon */}
                      <div>
                        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Project Icon / Logo <span className="font-normal text-gray-400">(optional)</span>
                        </p>
                        <label className="cursor-pointer block">
                          <div className="edu-upload-zone border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            {iconPreview ? (
                              <div className="flex items-center justify-center h-24 relative">
                                <img src={iconPreview} alt="icon preview"
                                  className="h-20 w-20 object-cover rounded-xl border border-gray-200 dark:border-gray-600"
                                />
                                <button type="button"
                                  onClick={(e) => { e.preventDefault(); setIconFile(null); setIconPreview(null); }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                                <Briefcase className="w-7 h-7 mb-1" />
                                <span className="text-xs">Click to upload project icon</span>
                              </div>
                            )}
                          </div>
                          <input type="file" hidden accept="image/*" onChange={handleIconChange} />
                        </label>
                      </div>

                  
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Project Screenshots
                            <span className="font-normal text-gray-400 ml-1">
                              ({totalImages}/7) — add one by one or multiple
                            </span>
                          </p>
                        </div>

                 
                        {existingImages.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1.5">Current images (click × to remove)</p>
                            <div className="grid grid-cols-4 gap-2">
                              {existingImages.map((src, i) => (
                                <div key={src} className="relative group">
                                  <img src={src} alt={`existing-${i}`}
                                    className="w-full h-16 sm:h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                  />
                                  <button type="button" onClick={() => removeExistingImage(i)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-black/60 text-white rounded px-1">Cover</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* New image previews */}
                        {newImagePreviews.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1.5">New images to upload</p>
                            <div className="grid grid-cols-4 gap-2">
                              {newImagePreviews.map((src, i) => (
                                <div key={i} className="relative group">
                                  <img src={src} alt={`new-${i}`}
                                    className="w-full h-16 sm:h-20 object-cover rounded-lg border-2 border-dashed border-[var(--edu-primary)]/40"
                                  />
                                  <button type="button" onClick={() => removeNewImage(i)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {totalImages < 7 && (
                          <label className="cursor-pointer block">
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center h-20 text-gray-400 hover:border-[var(--edu-primary)]/50 transition">
                              <Upload className="w-6 h-6 mb-1" />
                              <span className="text-xs">
                                {totalImages === 0 ? "Upload screenshots (up to 7)" : `Add more (${7 - totalImages} left)`}
                              </span>
                            </div>
                            <input type="file" hidden accept="image/*" multiple onChange={handleAddImages} />
                          </label>
                        )}
                        {totalImages >= 7 && (
                          <p className="text-xs text-amber-500 mt-1 text-center">Maximum 7 images reached</p>
                        )}
                      </div>

                      {/* Video */}
                      <div>
                        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Demo Video <span className="font-normal text-gray-400">(optional)</span>
                        </p>
                        <label className="cursor-pointer block">
                          <div className="edu-upload-zone border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                            <div className="flex flex-col items-center justify-center h-16 sm:h-20 text-gray-400">
                              <Upload className="w-6 h-6 mb-1" />
                              <span className="text-xs">{videoFile ? videoFile.name : "Click to upload demo video"}</span>
                            </div>
                          </div>
                          <input type="file" hidden accept="video/*" onChange={(e) => setVideoFile(e.target.files[0] || null)} />
                        </label>
                      </div>
                    </>
                  )}

                  {/* ── TESTIMONIAL TAB ── */}
                  {activeTab === "testimonial" && (
                    <>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Add a client testimonial (optional).</p>
                      <div>
                        <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          <User className="inline w-4 h-4 mr-1" />Profile Photo
                        </p>
                        <label className="cursor-pointer block">
                          <div className="edu-upload-zone border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            {profilePreview ? (
                              <div className="flex items-center justify-center h-24 relative">
                                <img src={profilePreview} alt="profile preview"
                                  className="h-20 w-20 object-cover rounded-full border-2 border-gray-200 dark:border-gray-600"
                                />
                                <button type="button"
                                  onClick={(e) => { e.preventDefault(); setProfileFile(null); setProfilePreview(null); }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                                <User className="w-7 h-7 mb-1" />
                                <span className="text-xs">Click to upload profile photo</span>
                              </div>
                            )}
                          </div>
                          <input type="file" hidden accept="image/*" onChange={handleProfileChange} />
                        </label>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Client Name</label>
                          <input value={testimonialName} onChange={(e) => setTestimonialName(e.target.value)}
                            placeholder="e.g., John Smith" className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Post / Title</label>
                          <input value={testimonialPost} onChange={(e) => setTestimonialPost(e.target.value)}
                            placeholder="e.g., CEO, Founder" className={inputCls} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                          <Star className="inline w-4 h-4 mr-1" />Testimonial
                        </label>
                        <textarea value={testimonialDescription} onChange={(e) => setTestimonialDescription(e.target.value)}
                          placeholder="What did the client say?" rows={4} className={`${inputCls} resize-none`}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="edu-modal-footer border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 px-4 sm:px-6 py-3 sm:py-4 flex gap-2 sm:gap-3 flex-shrink-0">
                {activeTab !== "basic" && (
                  <button type="button"
                    onClick={() => { const i = TABS.findIndex((t) => t.id === activeTab); if (i > 0) setActiveTab(TABS[i - 1].id); }}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-xs sm:text-sm"
                  >
                    ← Back
                  </button>
                )}
                {activeTab !== "testimonial" ? (
                  <button type="button"
                    onClick={() => { const i = TABS.findIndex((t) => t.id === activeTab); setActiveTab(TABS[i + 1].id); }}
                    className="edu-btn-primary flex-1 py-2.5 sm:py-3 rounded-lg text-sm font-medium"
                  >
                    Next →
                  </button>
                ) : (
                  <button type="button" disabled={submitting || actionLoading} onClick={handleSubmit}
                    className="edu-btn-primary flex-1 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    {submitting || actionLoading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{editItem ? "Updating…" : "Creating…"}</>
                    ) : editItem ? "Update Project" : "Create Project"}
                  </button>
                )}
                {activeTab !== "testimonial" && (
                  <button type="button" disabled={submitting || actionLoading} onClick={handleSubmit}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-xs sm:text-sm font-medium"
                    title="Save now"
                  >
                    {submitting || actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {viewItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
            <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="edu-accent-bar" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Project Details</h2>
                </div>
                <button onClick={() => setViewItem(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="edu-modal-body px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto flex-1">
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {viewItem.category && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
                        style={{ background: "var(--edu-primary)" }}
                      >
                        <FolderKanban className="w-3.5 h-3.5" />{viewItem.category}
                      </span>
                    )}
                    {viewItem.industry && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400">
                        <Globe className="w-3.5 h-3.5" />{viewItem.industry}
                      </span>
                    )}
                    {viewItem.publishYear && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        <Calendar className="w-3.5 h-3.5" />{viewItem.publishYear}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    {viewItem.projectIcon && (
                      <img src={viewItem.projectIcon} alt="project icon"
                        className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-600 flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">Title</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-base sm:text-lg">{viewItem.title}</p>
                    </div>
                  </div>
                  {viewItem.description && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Description</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{viewItem.description}</p>
                    </div>
                  )}
                  {(viewItem.problemStatement || viewItem.solution) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {viewItem.problemStatement && (
                        <div className="p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30">
                          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Target className="w-3.5 h-3.5" /> Problem
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{viewItem.problemStatement}</p>
                        </div>
                      )}
                      {viewItem.solution && (
                        <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5" /> Solution
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{viewItem.solution}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {parseTechStack(viewItem.deliverables).length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5" /> Deliverables
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {parseTechStack(viewItem.deliverables).map((d) => (
                          <span key={d} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                            <Package className="w-2.5 h-2.5" />{d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <ImageCarousel images={viewItem.images || []} />
                  {parseTechStack(viewItem.techStack).length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5" /> Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {parseTechStack(viewItem.techStack).map((t) => (
                          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
                          >
                            <Tag className="w-2.5 h-2.5" />{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(viewItem.liveLink || viewItem.githubLink) && (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {viewItem.liveLink && (
                        <a href={viewItem.liveLink} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:opacity-80 transition"
                        >
                          <Link className="w-4 h-4" /> Live Demo
                        </a>
                      )}
                      {viewItem.githubLink && (
                        <a href={viewItem.githubLink} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:opacity-80 transition"
                        >
                          <Github className="w-4 h-4" /> GitHub
                        </a>
                      )}
                    </div>
                  )}
                  {viewItem.video && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Demo Video</p>
                      <video src={viewItem.video} controls className="w-full rounded-xl border border-gray-200 dark:border-gray-700" />
                    </div>
                  )}
                  {viewItem.testimonial?.description && (
                    <div className="p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                      <div className="flex items-start gap-3 mb-3">
                        {viewItem.testimonial.profileImage ? (
                          <img src={viewItem.testimonial.profileImage} alt={viewItem.testimonial.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                            style={{ background: "var(--edu-light)", color: "var(--edu-primary)" }}
                          >
                            {viewItem.testimonial.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{viewItem.testimonial.name}</p>
                          {viewItem.testimonial.post && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{viewItem.testimonial.post}</p>
                          )}
                        </div>
                        <Star className="w-4 h-4 flex-shrink-0" style={{ color: "var(--edu-primary)" }} />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                        "{viewItem.testimonial.description}"
                      </p>
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
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Delete Project?</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 sm:mb-6">
                Are you sure you want to delete{" "}
                <strong className="text-gray-900 dark:text-gray-100">{deleteTarget.title}</strong>?
                All images, video &amp; testimonial media will be removed from Cloudinary.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
                >
                  Cancel
                </button>
                <button onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;