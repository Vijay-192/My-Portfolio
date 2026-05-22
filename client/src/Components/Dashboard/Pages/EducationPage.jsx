import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../../redux-store/EducationSlice";
import {
  Plus, Search, Eye, Trash2, Pencil, X,
  Upload, Loader2, GraduationCap, School,
} from "lucide-react";

const initialForm = {
  educationType: "college",
  courseName: "",
  instituteName: "",
  universityName: "",
  branch: "",
  schoolName: "",
  stream: "",
  board: "",
  session: "",
  cgpa: "",
  percentage: "",
};

const inputCls =
  "edu-input w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition";

const collegeFields = [
  { name: "courseName", label: "Course Name *", placeholder: "e.g., B.Tech", required: true },
  { name: "instituteName", label: "Institute Name *", placeholder: "e.g., ABC College", required: true },
  { name: "universityName", label: "University Name", placeholder: "e.g., AKTU" },
  { name: "branch", label: "Branch", placeholder: "e.g., Computer Science" },
  { name: "session", label: "Session *", placeholder: "e.g., 2020-2024", required: true },
  { name: "cgpa", label: "CGPA", placeholder: "e.g., 8.5" },
];

const schoolFields = [
  { name: "schoolName", label: "School Name *", placeholder: "e.g., XYZ School", required: true },
  { name: "board", label: "Board *", placeholder: "e.g., CBSE, UP Board", required: true },
  { name: "session", label: "Session *", placeholder: "e.g., 2018-2019", required: true },
  { name: "percentage", label: "Percentage *", placeholder: "e.g., 85.5", required: true },
];

const COLLEGE_HEADERS = ["Institute", "University", "Branch", "Session", "CGPA", "Images", "Actions"];
const SCHOOL_HEADERS = ["School Name", "Board", "Session", "Percentage", "Images", "Actions"];

const EducationPage = () => {
  const dispatch = useDispatch();
  const education = useSelector((s) => s.education?.education ?? []);
  const loading = useSelector((s) => s.education?.loading);

  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);

  useEffect(() => { dispatch(fetchEducation()); }, [dispatch]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile1 = (f) => { setImg1(f); setPreview1(URL.createObjectURL(f)); };
  const handleFile2 = (f) => { setImg2(f); setPreview2(URL.createObjectURL(f)); };

  const resetModal = useCallback(() => {
    setShowModal(false); setEditItem(null); setForm(initialForm);
    setImg1(null); setImg2(null); setPreview1(null); setPreview2(null); setSubmitting(false);
  }, []);

  const openAdd = () => { setEditItem(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (item) => {
    setEditItem(item); setForm(item);
    setPreview1(item.images?.[0] || null);
    setPreview2(item.images?.[1] || null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!img1 && !editItem) { alert("Please upload both images"); return; }
    setSubmitting(true);
    const fd = new FormData();
    const isSchool = form.educationType === "school";
    Object.keys(form).forEach((k) => {
      if (isSchool && k === "courseName") return fd.append(k, form.schoolName || "");
      if (isSchool && k === "instituteName") return fd.append(k, form.schoolName || "");
      fd.append(k, form[k]);
    });

    if (img1) fd.append("images", img1);
    if (img2) fd.append("images", img2);

    try {
      if (editItem) await dispatch(updateEducation({ id: editItem._id, formData: fd })).unwrap();
      else await dispatch(createEducation(fd)).unwrap();
      resetModal();
    } catch { setSubmitting(false); }
  };

  const handleDelete = async () => {
    await dispatch(deleteEducation(deleteItem._id));
    setDeleteItem(null);
  };

  const filtered = education?.filter((e) =>
    e.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    e.schoolName?.toLowerCase().includes(search.toLowerCase())
  );
  const colleges = filtered?.filter((e) => e.educationType === "college");
  const schools = filtered?.filter((e) => e.educationType === "school");
  const isCollege = form.educationType === "college";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--edu-primary)" }}>
            Education Manage
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your academic records
          </p>
        </div>
        <button onClick={openAdd} className="edu-btn-primary flex items-center gap-2 px-5 py-3 rounded-lg">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or schools…"
            className="edu-input w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm transition"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--edu-primary)" }} />
          <span>Loading records…</span>
        </div>
      ) : (
        <div className="space-y-8">

          {/* College Table */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <div className="edu-accent-bar" />
              <GraduationCap className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
              College Education
              <span className="ml-auto text-sm font-normal text-gray-400">
                {colleges?.length} record{colleges?.length !== 1 && "s"}
              </span>
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="edu-table-header">
                    <tr>{COLLEGE_HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {colleges?.length === 0 ? (
                      <tr>
                        <td colSpan={COLLEGE_HEADERS.length} className="p-10 text-center text-gray-400">
                          <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No college records found
                        </td>
                      </tr>
                    ) : colleges?.map((item) => (
                      <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.instituteName}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{item.universityName}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{item.branch}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{item.session}</td>
                        <td className="p-4"><span className="edu-badge">{item.cgpa}</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {item.images?.map((img, i) => (
                              <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600" alt="" />
                            ))}
                          </div>
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
                              <button onClick={() => setDeleteItem(item)} className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button>
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

          {/* School Table */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-3">
              <div className="edu-accent-bar" />
              <School className="w-5 h-5" style={{ color: "var(--edu-primary)" }} />
              School Education
              <span className="ml-auto text-sm font-normal text-gray-400">
                {schools?.length} record{schools?.length !== 1 && "s"}
              </span>
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="edu-table-header">
                    <tr>{SCHOOL_HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {schools?.length === 0 ? (
                      <tr>
                        <td colSpan={SCHOOL_HEADERS.length} className="p-10 text-center text-gray-400">
                          <School className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No school records found
                        </td>
                      </tr>
                    ) : schools?.map((item) => (
                      <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition">
                        <td className="p-4 font-medium text-gray-900 dark:text-gray-100">{item.schoolName}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{item.board}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-300">{item.session}</td>
                        <td className="p-4"><span className="edu-badge">{item.percentage}%</span></td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {item.images?.map((img, i) => (
                              <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600" alt="" />
                            ))}
                          </div>
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
                              <button onClick={() => setDeleteItem(item)} className="p-2 rounded-lg transition text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /></button>
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

        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl">

            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editItem ? "Update Education" : "Add Education"}
                </h2>
              </div>
              <button onClick={resetModal} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body">
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Education Type</label>
                  <select name="educationType" value={form.educationType} onChange={handleChange} className={inputCls} disabled={!!editItem}>
                    <option value="college">College</option>
                    <option value="school">School</option>
                  </select>
                </div>

                {isCollege && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collegeFields.map(({ name, label, placeholder, required }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputCls} required={required} />
                      </div>
                    ))}
                  </div>
                )}

                {!isCollege && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolFields.map(({ name, label, placeholder, required }) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
                        <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputCls} required={required} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image 1 *</p>
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
                      <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files[0]) handleFile1(e.target.files[0]); }} />
                    </label>
                  </div>
                  <div>
                    <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image 2 *</p>
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
                      <input type="file" hidden accept="image/*" onChange={(e) => { if (e.target.files[0]) handleFile2(e.target.files[0]); }} />
                    </label>
                  </div>
                </div>

              </div>
            </div>

            <div className="edu-modal-footer border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="edu-btn-primary w-full py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />{editItem ? "Updating…" : "Creating…"}</>
                ) : (
                  editItem ? "Update Education" : "Create Education"
                )}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Education Details</h2>
              </div>
              <button onClick={() => setViewItem(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="edu-modal-body">
              <div className="space-y-6">

                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white capitalize"
                  style={{ background: viewItem.educationType === "college" ? "var(--edu-primary)" : "var(--edu-accent)" }}
                >
                  {viewItem.educationType === "college" ? <GraduationCap className="w-3.5 h-3.5" /> : <School className="w-3.5 h-3.5" />}
                  {viewItem.educationType}
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Session</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.session}</p>
                  </div>
                  {viewItem.educationType === "college" ? (
                    <>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Course</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.courseName}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Institute</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.instituteName}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">University</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.universityName}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Branch</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.branch}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">CGPA</p><span className="edu-badge">{viewItem.cgpa}</span></div>
                    </>
                  ) : (
                    <>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">School</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.schoolName}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Board</p><p className="font-semibold text-gray-900 dark:text-gray-100">{viewItem.board}</p></div>
                      <div><p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Percentage</p><span className="edu-badge">{viewItem.percentage}%</span></div>
                    </>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Documents</p>
                  <div className="grid grid-cols-2 gap-4">
                    {viewItem.images?.map((img, i) => (
                      <img key={i} src={img} className="w-full h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700" alt="" />
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Delete Education?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {deleteItem.educationType === "college" ? deleteItem.courseName : deleteItem.schoolName}
              </strong>?
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteItem(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EducationPage;