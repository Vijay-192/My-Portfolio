// import { useState, useEffect, useCallback, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createBlog,
//   updateBlog,
//   clearMessages,
//   selectActionError,
//   selectSuccessMessage,
// } from "../../../../redux-store/BlogSlice";
// import {
//   ArrowLeft, Upload, Save, Loader2,
//   User, FolderOpen, Tag, Image as ImageIcon,
//   BookOpen, AlertCircle, X,
// } from "lucide-react";
// import TipTapEditor from "./Tiptapeditor";
// import { toast } from "react-hot-toast";


// const initialForm = { title: "", content: "", author: "", category: "", tags: "" };
// const AUTOSAVE_KEY  = "blog_draft_autosave";
// const AUTOSAVE_MS   = 10_000;
// const API_BASE = import.meta.env.VITE_API_BASE_URL;
// const toImageUrl = (path) => {
//   if (!path) return null;
//   if (path.startsWith("http://") || path.startsWith("https://")) return path;
//   return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
// };


// const BlogWritePage = ({ editItem = null, onClose }) => {
//   const dispatch    = useDispatch();
//   const actionError = useSelector(selectActionError);
//   const successMsg  = useSelector(selectSuccessMessage);

//   const [form,          setForm]          = useState(initialForm);
//   const [coverImage,    setCoverImage]    = useState(null);  
//   const [coverPreview,  setCoverPreview]  = useState(null);   
//   const [authorAvatar,  setAuthorAvatar]  = useState(null); 
//   const [avatarPreview, setAvatarPreview] = useState(null);   
//   const [submitting,    setSubmitting]    = useState(false);
//   const [lastSaved,     setLastSaved]     = useState(null);
//   const [showConfirm,   setShowConfirm]   = useState(false);
//   const [editorClearTrigger, setEditorClearTrigger] = useState(0);
//   const autoSaveTimer   = useRef(null);
//   const isSubmittingRef = useRef(false);
//   const isEdit          = Boolean(editItem);


//   useEffect(() => {
//     if (!editItem) return;

//     setForm({
//       title   : editItem.title    || "",
//       content : editItem.content  || "",
//       author  : editItem.author   || "",
//       category: editItem.category || "",
//       tags    : Array.isArray(editItem.tags)
//                   ? editItem.tags.join(", ")
//                   : editItem.tags || "",
//     });

//     setCoverPreview(toImageUrl(editItem.coverImage)   || null);
//     setAvatarPreview(toImageUrl(editItem.authorAvatar) || null);
//     setCoverImage(null);
//     setAuthorAvatar(null);
//   }, [editItem]);

//   useEffect(() => {
//     if (isEdit) return;
//     const raw = localStorage.getItem(AUTOSAVE_KEY);
//     if (!raw) return;
//     try {
//       const draft = JSON.parse(raw);
//       if (window.confirm("Found unsaved draft. Restore it?")) {
//         setForm(draft.form || initialForm);
//         setLastSaved(draft.timestamp ? new Date(draft.timestamp) : null);
//         toast.success("Draft restored");
//       } else {
//         localStorage.removeItem(AUTOSAVE_KEY);
//       }
//     } catch {
//       localStorage.removeItem(AUTOSAVE_KEY);
//     }
//   }, []); 


//   useEffect(() => {
//     if (isEdit) return;

//     autoSaveTimer.current = setInterval(() => {
//       if (form.title || form.content || form.author || form.category) {
//         const draft = {
//           form,
//           timestamp: new Date().toISOString(),
//         };
//         localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
//         setLastSaved(new Date());
//       }
//     }, AUTOSAVE_MS);

//     return () => clearInterval(autoSaveTimer.current);
//   }, [isEdit, form]); 

//   useEffect(() => {
//     if (!successMsg) return;
//     toast.success(successMsg);
//     dispatch(clearMessages());
//     if (!isEdit) {
//       localStorage.removeItem(AUTOSAVE_KEY);
//     }
//     isSubmittingRef.current = false;
//     setSubmitting(false);
//     setShowConfirm(false);
//     setEditorClearTrigger((n) => n + 1);
//     onClose();
//   }, [successMsg, dispatch, onClose, isEdit]);

//   useEffect(() => {
//     if (!actionError) return;
//     toast.error(actionError);
//     dispatch(clearMessages());
//     setSubmitting(false);
//     isSubmittingRef.current = false;
//   }, [actionError, dispatch]);

//   const handleChange = (e) =>
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

//   const handleCoverImage = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setCoverImage(f);
//     setCoverPreview(URL.createObjectURL(f));
//   };

//   const handleAvatar = (e) => {
//     const f = e.target.files[0];
//     if (!f) return;
//     setAuthorAvatar(f);
//     setAvatarPreview(URL.createObjectURL(f));
//   };

//   const handleBack = useCallback(() => {
//     clearInterval(autoSaveTimer.current);
//     onClose();
//   }, [onClose]);

//   const handleSubmit = async () => {
//     if (isSubmittingRef.current || submitting) return;

//     const { title, content, author, category } = form;
//     if (!title || !content || !author || !category) {
//       toast.error("Title, content, author, and category are required");
//       return;
//     }

//     isSubmittingRef.current = true;
//     setSubmitting(true);

//     const fd = new FormData();
//     fd.append("title",    title);
//     fd.append("content",  content);
//     fd.append("author",   author);
//     fd.append("category", category);
//     fd.append("tags",     form.tags);
//     if (coverImage)   fd.append("coverImage",   coverImage);
//     if (authorAvatar) fd.append("authorAvatar", authorAvatar);

//     try {
//       if (isEdit) {
//         await dispatch(updateBlog({ id: editItem._id, formData: fd })).unwrap();
//       } else {
//         await dispatch(createBlog(fd)).unwrap();
//       }
//     } catch (err) {
//       isSubmittingRef.current = false;
//       setSubmitting(false);
      
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col overflow-hidden">

//       {/* ── TOP NAV ── */}
//       <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={handleBack}
//             className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
//           >
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//           <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
//           <div>
//             <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
//               {isEdit ? "Edit Blog" : "Write New Blog"}
//             </h1>
//             {!isEdit && lastSaved && (
//               <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                 <Save className="w-3 h-3" />
//                 Auto-saved {lastSaved.toLocaleTimeString()}
//               </p>
//             )}
//           </div>
//         </div>

//         <button
//           type="button"
//           disabled={submitting}
//           onClick={() => setShowConfirm(true)}
//           className="edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
//         >
//           {submitting ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               {isEdit ? "Updating…" : "Publishing…"}
//             </>
//           ) : isEdit ? (
//             <><Save className="w-4 h-4" /> Update Blog</>
//           ) : (
//             <><Upload className="w-4 h-4" /> Publish Blog</>
//           )}
//         </button>
//       </div>

//       {/* ── TWO-COLUMN BODY ── */}
//       <div className="flex-1 flex overflow-hidden">

//         {/* LEFT PANEL */}
//         <div className="w-[380px] shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
//           <div className="p-5 space-y-5">

//             {/* Author Section */}
//             <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
//               <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
//                 <User className="w-3.5 h-3.5" /> Author
//               </h3>

//               {/* Avatar upload */}
//               <label className="cursor-pointer block mb-3">
//                 <div className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition overflow-hidden">
//                   {avatarPreview ? (
//                     <img
//                       src={avatarPreview}
//                       className="w-full h-full object-cover"
//                       alt="avatar preview"
//                       onError={(e) => { e.target.style.display = "none"; }}
//                     />
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full text-gray-400">
//                       <User className="w-6 h-6 mb-1" />
//                       <span className="text-xs">Upload Avatar</span>
//                     </div>
//                   )}
//                 </div>
//                 <input type="file" hidden accept="image/*" onChange={handleAvatar} />
//               </label>

//               <input
//                 name="author"
//                 value={form.author}
//                 onChange={handleChange}
//                 placeholder="Author name *"
//                 className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
//               />
//             </div>

//             {/* Title */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
//                 Blog Title *
//               </label>
//               <input
//                 name="title"
//                 value={form.title}
//                 onChange={handleChange}
//                 placeholder="e.g., 10 Tips for Effective Learning"
//                 className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
//               />
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
//                 <FolderOpen className="w-3.5 h-3.5" /> Category *
//               </label>
//               <input
//                 name="category"
//                 value={form.category}
//                 onChange={handleChange}
//                 placeholder="e.g., Education, Technology"
//                 className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
//               />
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
//                 <Tag className="w-3.5 h-3.5" /> Tags
//                 <span className="font-normal text-gray-400">(comma-separated)</span>
//               </label>
//               <input
//                 name="tags"
//                 value={form.tags}
//                 onChange={handleChange}
//                 placeholder="learning, tips, productivity"
//                 className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
//               />
//             </div>

//             {/* Cover Image */}
//             <div>
//               <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
//                 <ImageIcon className="w-3.5 h-3.5" /> Cover Image
//               </label>
//               <label className="cursor-pointer block">
//                 {coverPreview ? (
//                   <div className="relative group">
//                     <img
//                       src={coverPreview}
//                       className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
//                       alt="cover preview"
//                       onError={(e) => { e.target.style.display = "none"; }}
//                     />
//                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
//                       <span className="text-white text-xs font-medium">Click to change</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition text-gray-400">
//                     <Upload className="w-7 h-7 mb-1.5" />
//                     <span className="text-xs font-medium">Upload cover image</span>
//                     <span className="text-xs mt-0.5 text-gray-400">1200×630px recommended</span>
//                   </div>
//                 )}
//                 <input type="file" hidden accept="image/*" onChange={handleCoverImage} />
//               </label>
//             </div>

//             {/* Autosave hint */}
//             {!isEdit && (
//               <p className="text-xs text-gray-400 flex items-center gap-1.5 pb-2">
//                 <AlertCircle className="w-3 h-3 shrink-0" />
//                 Draft auto-saved every 10 seconds (text only)
//               </p>
//             )}
//           </div>
//         </div>

//         {/* RIGHT PANEL: Editor */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <div className="px-4 pt-3 pb-1 shrink-0">
//             <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
//               <BookOpen className="w-3.5 h-3.5" /> Blog Content *
//             </p>
//           </div>
//           <div className="flex-1 overflow-y-auto px-4 pb-6">
//             <TipTapEditor
//               value={form.content}
//               onChange={(html) => setForm((p) => ({ ...p, content: html }))}
//               clearTrigger={editorClearTrigger}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── CONFIRM MODAL ── */}
//       {showConfirm && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
//           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-10 h-10 rounded-full flex items-center justify-center"
//                   style={{ background: "var(--edu-light)" }}
//                 >
//                   <Upload className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
//                 </div>
//                 <div>
//                   <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
//                     {isEdit ? "Update Blog?" : "Publish Blog?"}
//                   </h3>
//                   <p className="text-xs text-gray-500 dark:text-gray-400">
//                     {isEdit ? "Changes will be saved" : "Blog will go live"}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => { if (!submitting) setShowConfirm(false); }}
//                 disabled={submitting}
//                 className={`p-1.5 rounded-lg transition ${
//                   submitting
//                     ? "opacity-30 cursor-not-allowed"
//                     : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-5 space-y-2 text-sm">
//               {[
//                 ["Title",    form.title],
//                 ["Category", form.category],
//                 ["Author",   form.author],
//               ].map(([label, val]) => (
//                 <div key={label} className="flex justify-between gap-4">
//                   <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}:</span>
//                   <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
//                     {val || "—"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 disabled={submitting}
//                 className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={submitting}
//                 className="flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition shadow-lg text-sm disabled:opacity-80"
//                 style={{ background: "var(--edu-primary)" }}
//               >
//                 {submitting ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     {isEdit ? "Updating…" : "Publishing…"}
//                   </div>
//                 ) : isEdit ? "Confirm Update" : "Confirm Publish"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlogWritePage;


import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  updateBlog,
  clearMessages,
  selectActionError,
  selectSuccessMessage,
} from "../../../../redux-store/BlogSlice";
import {
  ArrowLeft, Upload, Save, Loader2,
  User, FolderOpen, Tag, Image as ImageIcon,
  BookOpen, AlertCircle, X, FileText,
} from "lucide-react";
import TipTapEditor from "./Tiptapeditor";
import { toast } from "react-hot-toast";


const initialForm = { title: "", content: "", author: "", category: "", tags: "" };
const AUTOSAVE_KEY  = "blog_draft_autosave";
const AUTOSAVE_MS   = 10_000;
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const toImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
const base64ToFile = (base64, filename) => {
  if (!base64) return null;
  
  try {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  } catch (err) {
    console.error('base64ToFile error:', err);
    return null;
  }
};


const BlogWritePage = ({ editItem = null, onClose }) => {

  const dispatch    = useDispatch();
  const actionError = useSelector(selectActionError);
  const successMsg  = useSelector(selectSuccessMessage);
  const [form,          setForm]          = useState(initialForm);
  const [coverImage,    setCoverImage]    = useState(null);  
  const [coverPreview,  setCoverPreview]  = useState(null);   
  const [authorAvatar,  setAuthorAvatar]  = useState(null); 
  const [avatarPreview, setAvatarPreview] = useState(null);   
  const [submitting,    setSubmitting]    = useState(false);
  const [lastSaved,     setLastSaved]     = useState(null);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftToRestore, setDraftToRestore] = useState(null);
  const [editorClearTrigger, setEditorClearTrigger] = useState(0);
  
  const autoSaveTimer   = useRef(null);
  const isSubmittingRef = useRef(false);
  const isEdit          = Boolean(editItem);


  useEffect(() => {
    if (!editItem) return;

    setForm({
      title   : editItem.title    || "",
      content : editItem.content  || "",
      author  : editItem.author   || "",
      category: editItem.category || "",
      tags    : Array.isArray(editItem.tags)
                  ? editItem.tags.join(", ")
                  : editItem.tags || "",
    });

    setCoverPreview(toImageUrl(editItem.coverImage)   || null);
    setAvatarPreview(toImageUrl(editItem.authorAvatar) || null);
    setCoverImage(null);
    setAuthorAvatar(null);
  }, [editItem]);
  useEffect(() => {
    if (isEdit) return;
    
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return;
    
    try {
      const draft = JSON.parse(raw);
      setDraftToRestore(draft);
      setShowDraftModal(true);
    } catch {
      localStorage.removeItem(AUTOSAVE_KEY);
    }
  }, []); 

  const handleRestoreDraft = () => {
    if (!draftToRestore) return;
    setForm(draftToRestore.form || initialForm);
    if (draftToRestore.coverImageBase64) {
      try {
        const file = base64ToFile(draftToRestore.coverImageBase64, 'cover-restored.jpg');
        if (file) {
          setCoverImage(file);
          setCoverPreview(draftToRestore.coverImageBase64);
        }
      } catch (err) {
        console.error('Failed to restore cover image:', err);
      }
    }
    
    if (draftToRestore.avatarBase64) {
      try {
        const file = base64ToFile(draftToRestore.avatarBase64, 'avatar-restored.jpg');
        if (file) {
          setAuthorAvatar(file);
          setAvatarPreview(draftToRestore.avatarBase64);
        }
      } catch (err) {
        console.error('Failed to restore avatar:', err);
      }
    }
    
    if (draftToRestore.timestamp) {
      setLastSaved(new Date(draftToRestore.timestamp));
    }
    
    setShowDraftModal(false);
    toast.success("Draft restored successfully");
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setShowDraftModal(false);
    setDraftToRestore(null);
  };
  useEffect(() => {
    if (isEdit) return;

    autoSaveTimer.current = setInterval(async () => {
      if (!form.title && !form.content && !form.author && !form.category) return;

      try {
        const draft = {
          form,
          timestamp: new Date().toISOString(),
        };

        if (coverImage instanceof File) {
          draft.coverImageBase64 = await fileToBase64(coverImage);
        } else if (coverPreview) {
          const existing = localStorage.getItem(AUTOSAVE_KEY);
          if (existing) {
            try {
              const parsed = JSON.parse(existing);
              draft.coverImageBase64 = parsed.coverImageBase64;
            } catch (e) {
              console.error('Failed to parse existing draft:', e);
            }
          }
        }

        if (authorAvatar instanceof File) {
          draft.avatarBase64 = await fileToBase64(authorAvatar);
        } else if (avatarPreview) {
          const existing = localStorage.getItem(AUTOSAVE_KEY);
          if (existing) {
            try {
              const parsed = JSON.parse(existing);
              draft.avatarBase64 = parsed.avatarBase64;
            } catch (e) {
              console.error('Failed to parse existing draft:', e);
            }
          }
        }

        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
        setLastSaved(new Date());
      } catch (err) {
        console.error('Autosave failed:', err);
      }
    }, AUTOSAVE_MS);

    return () => clearInterval(autoSaveTimer.current);
  }, [isEdit, form, coverImage, authorAvatar, coverPreview, avatarPreview]);
  useEffect(() => {
    if (!successMsg) return;
    
    toast.success(successMsg);
    dispatch(clearMessages());
    if (!isEdit) {
      localStorage.removeItem(AUTOSAVE_KEY);
    }
    
    isSubmittingRef.current = false;
    setSubmitting(false);
    setShowConfirm(false);
    setEditorClearTrigger((n) => n + 1);
    onClose();
  }, [successMsg, dispatch, onClose, isEdit]);

  useEffect(() => {
    if (!actionError) return;
    toast.error(actionError);
    dispatch(clearMessages());
    setSubmitting(false);
    isSubmittingRef.current = false;
  }, [actionError, dispatch]);
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleCoverImage = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setCoverImage(f);
    setCoverPreview(URL.createObjectURL(f));
  };

  const handleAvatar = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setAuthorAvatar(f);
    setAvatarPreview(URL.createObjectURL(f));
  };
  const handleBack = useCallback(() => {
    clearInterval(autoSaveTimer.current);
    onClose();
  }, [onClose]);
  const handleSubmit = async () => {
    if (isSubmittingRef.current || submitting) return;

    const { title, content, author, category } = form;
    if (!title || !content || !author || !category) {
      toast.error("Title, content, author, and category are required");
      return;
    }

    isSubmittingRef.current = true;
    setSubmitting(true);

    const fd = new FormData();
    fd.append("title",    title);
    fd.append("content",  content);
    fd.append("author",   author);
    fd.append("category", category);
    fd.append("tags",     form.tags);
    if (coverImage)   fd.append("coverImage",   coverImage);
    if (authorAvatar) fd.append("authorAvatar", authorAvatar);

    try {
      if (isEdit) {
        await dispatch(updateBlog({ id: editItem._id, formData: fd })).unwrap();
      } else {
        await dispatch(createBlog(fd)).unwrap();
      }
    } catch (err) {
      isSubmittingRef.current = false;
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col overflow-hidden">

      {/* TOP NAV */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {isEdit ? "Edit Blog" : "Write New Blog"}
            </h1>
            {!isEdit && lastSaved && (
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Save className="w-3 h-3" />
                Auto-saved {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={() => setShowConfirm(true)}
          className="edu-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEdit ? "Updating…" : "Publishing…"}
            </>
          ) : isEdit ? (
            <><Save className="w-4 h-4" /> Update Blog</>
          ) : (
            <><Upload className="w-4 h-4" /> Publish Blog</>
          )}
        </button>
      </div>

      {/* TWO-COLUMN BODY */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-[380px] shrink-0 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-5 space-y-5">

            {/* Author Section */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-3.5 h-3.5" /> Author
              </h3>

              <label className="cursor-pointer block mb-3">
                <div className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      className="w-full h-full object-cover"
                      alt="avatar preview"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <User className="w-6 h-6 mb-1" />
                      <span className="text-xs">Upload Avatar</span>
                    </div>
                  )}
                </div>
                <input type="file" hidden accept="image/*" onChange={handleAvatar} />
              </label>

              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Author name *"
                className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5">
                Blog Title *
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., 10 Tips for Effective Learning"
                className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5" /> Category *
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g., Education, Technology"
                className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" /> Tags
                <span className="font-normal text-gray-400">(comma-separated)</span>
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="learning, tips, productivity"
                className="edu-input w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm transition"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1.5 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Cover Image
              </label>
              <label className="cursor-pointer block">
                {coverPreview ? (
                  <div className="relative group">
                    <img
                      src={coverPreview}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      alt="cover preview"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 transition text-gray-400">
                    <Upload className="w-7 h-7 mb-1.5" />
                    <span className="text-xs font-medium">Upload cover image</span>
                    <span className="text-xs mt-0.5 text-gray-400">1200×630px recommended</span>
                  </div>
                )}
                <input type="file" hidden accept="image/*" onChange={handleCoverImage} />
              </label>
            </div>

            {/* Autosave hint */}
            {!isEdit && (
              <p className="text-xs text-gray-400 flex items-center gap-1.5 pb-2">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Draft auto-saved every 10 seconds
              </p>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-3 pb-1 shrink-0">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Blog Content *
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <TipTapEditor
              value={form.content}
              onChange={(html) => setForm((p) => ({ ...p, content: html }))}
              clearTrigger={editorClearTrigger}
            />
          </div>
        </div>
      </div>

      {/* DRAFT RESTORE MODAL */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "var(--edu-light)" }}
              >
                <FileText className="w-6 h-6" style={{ color: "var(--edu-primary)" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  Unsaved Draft Found
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {draftToRestore?.timestamp && 
                    `Last saved ${new Date(draftToRestore.timestamp).toLocaleString()}`
                  }
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-5 space-y-2 text-sm max-h-64 overflow-y-auto">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Title:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {draftToRestore?.form?.title || "Untitled"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Author:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {draftToRestore?.form?.author || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {draftToRestore?.form?.category || "—"}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 text-center dark:text-gray-300 mb-5">
              Would you like to continue with your previous draft or start fresh?
            </p>

            <div className="flex gap-3">
              <button
                onClick={handleDiscardDraft}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm"
              >
                Start Fresh
              </button>
              <button
                onClick={handleRestoreDraft}
                className="cursor-pointer flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition shadow-lg text-sm"
                style={{ background: "var(--edu-primary)" }}
              >
                Restore Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM PUBLISH MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "var(--edu-light)" }}
                >
                  <Upload className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {isEdit ? "Update Blog?" : "Publish Blog?"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isEdit ? "Changes will be saved" : "Blog will go live"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => { if (!submitting) setShowConfirm(false); }}
                disabled={submitting}
                className={`p-1.5 rounded-lg transition ${
                  submitting
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-5 space-y-2 text-sm">
              {[
                ["Title",    form.title],
                ["Category", form.category],
                ["Author",   form.author],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-500 dark:text-gray-400 shrink-0">{label}:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {val || "—"}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg text-white font-semibold transition shadow-lg text-sm disabled:opacity-80"
                style={{ background: "var(--edu-primary)" }}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isEdit ? "Updating…" : "Publishing…"}
                  </div>
                ) : isEdit ? "Confirm Update" : "Confirm Publish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogWritePage;