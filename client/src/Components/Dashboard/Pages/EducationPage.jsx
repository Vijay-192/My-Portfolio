import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from "../../../redux-store/EducationSlice";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Pencil,
  X,
  Upload,
  Loader2,
  GraduationCap,
  School,
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
  {
    name: "courseName",
    label: "Course Name *",
    placeholder: "e.g., B.Tech",
    required: true,
  },
  {
    name: "instituteName",
    label: "Institute Name *",
    placeholder: "e.g., ABC College",
    required: true,
  },
  {
    name: "universityName",
    label: "University Name",
    placeholder: "e.g., AKTU",
  },
  { name: "branch", label: "Branch", placeholder: "e.g., Computer Science" },
  {
    name: "session",
    label: "Session *",
    placeholder: "e.g., 2020-2024",
    required: true,
  },
  { name: "cgpa", label: "CGPA", placeholder: "e.g., 8.5" },
];

const schoolFields = [
  {
    name: "schoolName",
    label: "School Name *",
    placeholder: "e.g., XYZ School",
    required: true,
  },
  {
    name: "board",
    label: "Board *",
    placeholder: "e.g., CBSE, UP Board",
    required: true,
  },
  {
    name: "session",
    label: "Session *",
    placeholder: "e.g., 2018-2019",
    required: true,
  },
  {
    name: "percentage",
    label: "Percentage *",
    placeholder: "e.g., 85.5",
    required: true,
  },
];

const COLLEGE_HEADERS = [
  "Institute",
  "University",
  "Branch",
  "Session",
  "CGPA",
  "Images",
  "Actions",
];
const SCHOOL_HEADERS = [
  "School Name",
  "Board",
  "Session",
  "Percentage",
  "Images",
  "Actions",
];

const MobileCollegeCard = ({ item, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300">
    <div className="flex items-start justify-between gap-2 mb-1">
      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug flex-1">
        {item.instituteName}
      </p>
      <span className="edu-badge text-xs flex-shrink-0">{item.cgpa}</span>
    </div>
    <div className="flex items-center gap-1.5 mb-1">
      <GraduationCap
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: "var(--edu-primary)" }}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {item.courseName} · {item.branch}
      </span>
    </div>
    <p className="text-xs text-gray-400 mb-2">
      {item.universityName} &nbsp;|&nbsp; {item.session}
    </p>
    {item.images?.length > 0 && (
      <div className="flex gap-2 mb-3">
        {item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
            alt=""
          />
        ))}
      </div>
    )}
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

const MobileSchoolCard = ({ item, onView, onEdit, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300">
    <div className="flex items-start justify-between gap-2 mb-1">
      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug flex-1">
        {item.schoolName}
      </p>
      <span className="edu-badge text-xs flex-shrink-0">
        {item.percentage}%
      </span>
    </div>
    <div className="flex items-center gap-1.5 mb-1">
      <School
        className="w-3.5 h-3.5 flex-shrink-0"
        style={{ color: "var(--edu-accent)" }}
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {item.board} &nbsp;|&nbsp; {item.session}
      </span>
    </div>
    {item.images?.length > 0 && (
      <div className="flex gap-2 mb-3 mt-2">
        {item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
            alt=""
          />
        ))}
      </div>
    )}
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

  useEffect(() => {
    dispatch(fetchEducation());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const handleFile1 = (f) => {
    setImg1(f);
    setPreview1(URL.createObjectURL(f));
  };
  const handleFile2 = (f) => {
    setImg2(f);
    setPreview2(URL.createObjectURL(f));
  };

  const resetModal = useCallback(() => {
    setShowModal(false);
    setEditItem(null);
    setForm(initialForm);
    setImg1(null);
    setImg2(null);
    setPreview1(null);
    setPreview2(null);
    setSubmitting(false);
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(initialForm);
    setShowModal(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm(item);
    setPreview1(item.images?.[0] || null);
    setPreview2(item.images?.[1] || null);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!img1 && !editItem) {
      alert("Please upload both images");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    const isSchool = form.educationType === "school";
    Object.keys(form).forEach((k) => {
      if (isSchool && k === "courseName")
        return fd.append(k, form.schoolName || "");
      if (isSchool && k === "instituteName")
        return fd.append(k, form.schoolName || "");
      fd.append(k, form[k]);
    });
    if (img1) fd.append("images", img1);
    if (img2) fd.append("images", img2);
    try {
      if (editItem)
        await dispatch(
          updateEducation({ id: editItem._id, formData: fd }),
        ).unwrap();
      else await dispatch(createEducation(fd)).unwrap();
      resetModal();
    } catch {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    await dispatch(deleteEducation(deleteItem._id));
    setDeleteItem(null);
  };

  const filtered = education?.filter(
    (e) =>
      e.courseName?.toLowerCase().includes(search.toLowerCase()) ||
      e.schoolName?.toLowerCase().includes(search.toLowerCase()),
  );
  const colleges = filtered?.filter((e) => e.educationType === "college");
  const schools = filtered?.filter((e) => e.educationType === "school");
  const isCollege = form.educationType === "college";

  const RowActions = ({ item }) => (
    <div className="flex gap-1">
      <span className="edu-tooltip-wrap">
        <button
          onClick={() => setViewItem(item)}
          className="p-2 rounded-lg transition text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20"
        >
          <Eye className="w-4 h-4" />
        </button>
        <span className="edu-tooltip-box">
          <span className="edu-tooltip-label">View Details</span>
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
          <span className="edu-tooltip-label">Delete</span>
          <span className="edu-tooltip-arrow" />
        </span>
      </span>
    </div>
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
            Education Manage
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your academic records
          </p>
        </div>
        <button
          onClick={openAdd}
          className="edu-btn-primary flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg text-sm w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-5 sm:mb-6">
        <div className="relative max-w-full sm:max-w-md">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses or schools…"
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
        <div className="space-y-6 sm:space-y-8">
          <section>
            <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="edu-accent-bar" />
              <GraduationCap
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "var(--edu-primary)" }}
              />
              College Education
              <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
                {colleges?.length} record{colleges?.length !== 1 && "s"}
              </span>
            </h2>

            {/* Mobile cards */}
            <div className="sm:hidden">
              {colleges?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                  <GraduationCap className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No college records found</p>
                </div>
              ) : (
                <div
                  className="flex flex-col gap-2.5 overflow-y-auto pr-1"
                  style={{
                    maxHeight: "60vh",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {colleges.map((item) => (
                    <MobileCollegeCard
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
                      {COLLEGE_HEADERS.map((h) => (
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
                    {colleges?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={COLLEGE_HEADERS.length}
                          className="p-10 text-center text-gray-400"
                        >
                          <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No college records found
                        </td>
                      </tr>
                    ) : (
                      colleges?.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {item.instituteName}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {item.universityName}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {item.branch}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {item.session}
                          </td>
                          <td className="p-4">
                            <span className="edu-badge">{item.cgpa}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {item.images?.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                  alt=""
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <RowActions item={item} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-base sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <div className="edu-accent-bar" />
              <School
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "var(--edu-primary)" }}
              />
              School Education
              <span className="ml-auto text-xs sm:text-sm font-normal text-gray-400">
                {schools?.length} record{schools?.length !== 1 && "s"}
              </span>
            </h2>

            <div className="sm:hidden">
              {schools?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400">
                  <School className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm">No school records found</p>
                </div>
              ) : (
                <div
                  className="flex flex-col gap-2.5 overflow-y-auto pr-1"
                  style={{
                    maxHeight: "60vh",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {schools.map((item) => (
                    <MobileSchoolCard
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
                      {SCHOOL_HEADERS.map((h) => (
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
                    {schools?.length === 0 ? (
                      <tr>
                        <td
                          colSpan={SCHOOL_HEADERS.length}
                          className="p-10 text-center text-gray-400"
                        >
                          <School className="w-10 h-10 mx-auto mb-2 opacity-30" />
                          No school records found
                        </td>
                      </tr>
                    ) : (
                      schools?.map((item) => (
                        <tr
                          key={item._id}
                          className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                        >
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {item.schoolName}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {item.board}
                          </td>
                          <td className="p-4 text-gray-600 dark:text-gray-300">
                            {item.session}
                          </td>
                          <td className="p-4">
                            <span className="edu-badge">
                              {item.percentage}%
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {item.images?.map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                  alt=""
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <RowActions item={item} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {editItem ? "Update Education" : "Add Education"}
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
                    Education Type
                  </label>
                  <select
                    name="educationType"
                    value={form.educationType}
                    onChange={handleChange}
                    className={inputCls}
                    disabled={!!editItem}
                  >
                    <option value="college">College</option>
                    <option value="school">School</option>
                  </select>
                </div>
                {isCollege && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collegeFields.map(
                      ({ name, label, placeholder, required }) => (
                        <div key={name}>
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
                )}
                {!isCollege && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schoolFields.map(
                      ({ name, label, placeholder, required }) => (
                        <div key={name}>
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
                )}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    {
                      label: "Image 1 *",
                      preview: preview1,
                      handler: handleFile1,
                    },
                    {
                      label: "Image 2 *",
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
                          className={`edu-upload-zone ${preview ? "has-image" : ""}`}
                        >
                          {preview ? (
                            <img
                              src={preview}
                              className="w-full h-28 sm:h-32 object-cover rounded"
                              alt=""
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-28 sm:h-32 text-gray-400">
                              <Upload className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
                              <span className="text-xs">Click to upload</span>
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) handler(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  ))}
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
                  "Update Education"
                ) : (
                  "Create Education"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="edu-modal-wrap bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            <div className="edu-modal-header border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 flex-shrink-0">
              <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="edu-accent-bar" />
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Education Details
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
                  style={{
                    background:
                      viewItem.educationType === "college"
                        ? "var(--edu-primary)"
                        : "var(--edu-accent)",
                  }}
                >
                  {viewItem.educationType === "college" ? (
                    <GraduationCap className="w-3.5 h-3.5" />
                  ) : (
                    <School className="w-3.5 h-3.5" />
                  )}
                  {viewItem.educationType}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Session
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {viewItem.session}
                    </p>
                  </div>
                  {viewItem.educationType === "college" ? (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Course
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.courseName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Institute
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.instituteName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          University
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.universityName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Branch
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.branch}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          CGPA
                        </p>
                        <span className="edu-badge">{viewItem.cgpa}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          School
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.schoolName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Board
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {viewItem.board}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Percentage
                        </p>
                        <span className="edu-badge">
                          {viewItem.percentage}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Documents
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {viewItem.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-full h-36 sm:h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                        alt=""
                      />
                    ))}
                  </div>
                </div>
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
                  Delete Education?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 sm:mb-6">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900 dark:text-gray-100">
                {deleteItem.educationType === "college"
                  ? deleteItem.courseName
                  : deleteItem.schoolName}
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

export default EducationPage;
