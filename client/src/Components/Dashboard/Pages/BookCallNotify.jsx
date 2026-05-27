// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Mail, Trash2, RefreshCw, Eye, Phone, Calendar, Clock,
//   Link, X, User, FileText, Hash, MailCheck, CheckCircle,
//   AlertTriangle,
// } from "lucide-react";
// import {
//   fetchAllBookings, deleteBooking, deleteManyBookings,
//   clearBookingError, selectAllBookings, selectListLoading,
//   selectDeleteLoading, selectDeleteError,
// } from "../../../redux-store/Bookingslice.js";
// const INITIALS = (f, l) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
// const AVATAR_COLORS = [
//   { bg: "#EEF6F2", color: "#0C4733", border: "#4E9C79" },
//   { bg: "#ede9fe", color: "#5b21b6", border: "#8b5cf6" },
//   { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" },
//   { bg: "#fce7f3", color: "#9d174d", border: "#ec4899" },
//   { bg: "#dbeafe", color: "#1e3a8a", border: "#3b82f6" },
// ];

// const STATUS_MAP = {
//   confirmed: { label: "confirmed", cls: "bg-green-100 text-green-700" },
//   pending:   { label: "pending",   cls: "bg-yellow-100 text-yellow-700" },
//   cancelled: { label: "cancelled", cls: "bg-red-100 text-red-700"   },
// };

// const parseBookingDate = (dateStr, timeStr) => {
//   try {
//     if (!dateStr || !timeStr) return null;
//     const [timePart, meridiem] = timeStr.trim().split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);
//     if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
//     if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
//     const d = new Date(dateStr);
//     d.setHours(hours, minutes, 0, 0);
//     return d;
//   } catch { return null; }
// };

// const findNearestId = (bookings) => {
//   const now = new Date();
//   let nearestId = null, nearestDiff = Infinity;
//   bookings.forEach((b) => {
//     const dt = parseBookingDate(b.date, b.time);
//     if (!dt) return;
//     const diff = dt - now;
//     if (diff > 0 && diff < nearestDiff) { nearestDiff = diff; nearestId = b._id; }
//   });
//   return nearestId;
// };


// const SkeletonCard = () => (
//   <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 flex items-start gap-3">
//     <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
//     <div className="flex-1 space-y-2.5 pt-0.5">
//       <div className="flex items-center gap-3">
//         <div className="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
//         <div className="h-3.5 w-14 rounded-full bg-gray-100 animate-pulse" />
//       </div>
//       <div className="flex gap-3">
//         <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
//         <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
//         <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
//       </div>
//     </div>
//     <div className="flex gap-2 flex-shrink-0">
//       <div className="h-8 w-8 rounded-lg bg-gray-100 animate-pulse" />
//       <div className="h-8 w-20 rounded-lg bg-gray-100 animate-pulse" />
//       <div className="h-8 w-8 rounded-lg bg-gray-100 animate-pulse" />
//     </div>
//   </div>
// );

// const DeleteConfirmModal = ({ booking, onConfirm, onCancel }) => {
//   if (!booking) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}
//       onClick={(e) => e.target === e.currentTarget && onCancel()}
//     >
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
//         <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
//           <AlertTriangle size={20} className="text-red-500" />
//         </div>
//         <h3 className="text-sm font-semibold text-gray-900 mb-1">Delete this booking?</h3>
//         <p className="text-xs text-gray-400 mb-5">
//           Permanently removes <span className="font-medium text-gray-600">{booking.firstName} {booking.lastName}</span>'s booking. This cannot be undone.
//         </p>
//         <div className="flex gap-2">
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
//           >
//             Delete
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const EmailConfirmModal = ({ booking, onConfirm, onCancel }) => {
//   if (!booking) return null;
//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}
//       onClick={(e) => e.target === e.currentTarget && onCancel()}
//     >
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
//         <div className="w-11 h-11 rounded-full bg-[#EEF6F2] flex items-center justify-center mx-auto mb-3">
//           <Mail size={20} className="text-[#0C4733]" />
//         </div>
//         <h3 className="text-sm font-semibold text-gray-900 mb-1">Email {booking.firstName}?</h3>
//         <p className="text-xs text-gray-400 mb-5">
//           Opens Gmail compose to <span className="font-medium text-[#0C4733]">{booking.email}</span> for their call on {booking.date} at {booking.time}.
//         </p>
//         <div className="flex gap-2">
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition"
//           >
//             Open Gmail
//           </button>
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ViewModal = ({ booking, onClose, onEmail }) => {
//   useEffect(() => {
//     if (!booking) return;
//     const fn = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", fn);
//     return () => window.removeEventListener("keydown", fn);
//   }, [booking, onClose]);

//   useEffect(() => {
//     document.body.style.overflow = booking ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [booking]);

//   if (!booking) return null;

//   const st = STATUS_MAP[booking.status] ?? STATUS_MAP.confirmed;
//   const dt = parseBookingDate(booking.date, booking.time);
//   const isUpcoming = dt && dt > new Date();

//   const Row = ({ icon: Icon, label, value }) => (
//     <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
//       <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]">
//         <Icon size={13} />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
//         <p className="text-sm text-gray-800 break-words">{value || "—"}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)" }}
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//       role="dialog" aria-modal="true"
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
//         {/* Header */}
//         <div className="relative px-5 pt-5 pb-4" style={{ background: "#0C4733" }}>
//           <button
//             onClick={onClose}
//             className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
//             aria-label="Close"
//           >
//             <X size={14} />
//           </button>
//           <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white font-semibold text-base mb-2 border border-white/20">
//             {INITIALS(booking.firstName, booking.lastName)}
//           </div>
//           <h3 className="text-white font-semibold text-base">
//             {booking.firstName} {booking.lastName}
//           </h3>
//           <div className="flex items-center gap-2 mt-1.5">
//             <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
//             {isUpcoming && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">upcoming</span>}
//           </div>
//           <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
//             <Calendar size={12} className="text-white/70" />
//             <span className="text-white text-xs font-medium">{booking.date}</span>
//             <span className="text-white/30 mx-0.5">·</span>
//             <Clock size={12} className="text-white/70" />
//             <span className="text-white text-xs font-medium">{booking.time} IST</span>
//           </div>
//         </div>

//         {/* Body */}
//         <div className="px-5 py-2 max-h-[50vh] overflow-y-auto">
//           <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Contact</p>
//           <Row icon={Mail}  label="Email"  value={booking.email} />
//           <Row icon={Phone} label="Phone"  value={booking.phone} />
//           {booking.socialLink && <Row icon={Link} label="Profile" value={booking.socialLink} />}
//           {booking.message && (
//             <>
//               <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Message</p>
//               <div className="flex gap-2 py-2.5">
//                 <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]">
//                   <FileText size={13} />
//                 </div>
//                 <div className="bg-gray-50 rounded-xl px-3 py-2 border-l-2 border-[#4E9C79] flex-1">
//                   <p className="text-xs text-gray-500 leading-relaxed">{booking.message}</p>
//                 </div>
//               </div>
//             </>
//           )}
//           <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">System</p>
//           <Row icon={Hash} label="Booking ID" value={booking._id} />
//           {booking.createdAt && (
//             <Row icon={Calendar} label="Created at" value={new Date(booking.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-3.5 border-t border-gray-100 flex gap-2">
//           <button
//             onClick={() => { onClose(); onEmail(booking); }}
//             className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition"
//           >
//             <Mail size={13} /> Open Gmail
//           </button>
//           <button
//             onClick={onClose}
//             className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 hover:bg-gray-50 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// function BookCallNotify() {
//   const dispatch      = useDispatch();
//   const bookings      = useSelector(selectAllBookings);
//   const listLoading   = useSelector(selectListLoading);
//   const deleteLoading = useSelector(selectDeleteLoading);
//   const deleteError   = useSelector(selectDeleteError);

//   const [selected,     setSelected]     = useState(new Set());
//   const [viewBooking,  setViewBooking]  = useState(null);
//   const [delTarget,    setDelTarget]    = useState(null);  
//   const [emailTarget,  setEmailTarget]  = useState(null);  
//   const [emailedIds,   setEmailedIds]   = useState(new Set()); 

//   useEffect(() => { dispatch(fetchAllBookings()); }, [dispatch]);

//   useEffect(() => {
//     if (!deleteError) return;
//     const t = setTimeout(() => dispatch(clearBookingError()), 4000);
//     return () => clearTimeout(t);
//   }, [deleteError, dispatch]);

//   const allSelected = useMemo(
//     () => bookings.length > 0 && selected.size === bookings.length,
//     [bookings.length, selected.size]
//   );
//   const nearestId = useMemo(() => findNearestId(bookings), [bookings]);
//   const toggleAll = () =>
//     allSelected ? setSelected(new Set()) : setSelected(new Set(bookings.map((b) => b._id)));
//   const toggleOne = (id) =>
//     setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
//   const handleDeleteOne = (b) => setDelTarget(b);

//   const confirmDeleteOne = async () => {
//     if (!delTarget) return;
//     if (viewBooking?._id === delTarget._id) setViewBooking(null);
//     await dispatch(deleteBooking(delTarget._id));
//     setSelected((prev) => { const n = new Set(prev); n.delete(delTarget._id); return n; });
//     setDelTarget(null);
//   };

//   const handleDeleteSelected = async () => {
//     if (!selected.size) return;
//     await dispatch(deleteManyBookings([...selected]));
//     setSelected(new Set());
//   };

//   const handleEmail = (b) => setEmailTarget(b);

//   const confirmEmail = () => {
//     if (!emailTarget) return;
//     const { email, firstName, date, time } = emailTarget;
//     const su   = encodeURIComponent(`Re: Discovery Call – ${date} at ${time}`);
//     const body = encodeURIComponent(`Hi ${firstName},\n\n`);
//     window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${su}&body=${body}`, "_blank");
//     setEmailedIds((prev) => new Set([...prev, emailTarget._id]));
//     setEmailTarget(null);
//   };

//   return (
//     <div className="p-4 sm:p-6 font-sans">
//       <style>{`
//         @keyframes nearPulse {
//           0%,100% { box-shadow: 0 0 0 0 rgba(78,156,121,0.4); }
//           50%      { box-shadow: 0 0 0 5px rgba(78,156,121,0); }
//         }
//         .nearest-pulse { animation: nearPulse 2.5s ease infinite; }
//       `}</style>

//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
//         <div className="flex items-center gap-3">
//           <div className="w-0.5 h-8 bg-[#0C4733] rounded-full" aria-hidden="true" />
//           <div>
//             <h2 className="text-[15px] font-semibold text-gray-900">Booking Notifications</h2>
//             <p className="text-xs text-gray-400 mt-0.5">
//               {listLoading ? "Fetching…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} in database`}
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           <button
//             onClick={() => dispatch(fetchAllBookings())}
//             disabled={listLoading}
//             className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition"
//           >
//             <RefreshCw size={12} className={listLoading ? "animate-spin" : ""} />
//             <span className="hidden sm:inline">{listLoading ? "Refreshing…" : "Refresh"}</span>
//           </button>

//           <label className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 cursor-pointer hover:bg-gray-50 transition select-none">
//             <input type="checkbox" checked={allSelected} onChange={toggleAll}
//               className="w-3.5 h-3.5 accent-[#0C4733] cursor-pointer" />
//             <span className="hidden sm:inline">Select all</span>
//           </label>

//           {selected.size > 0 && (
//             <button
//               onClick={handleDeleteSelected}
//               disabled={deleteLoading}
//               className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50 transition"
//             >
//               <Trash2 size={12} />
//               Delete ({selected.size})
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Error banner */}
//       {deleteError && (
//         <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
//           ⚠ {deleteError}
//         </div>
//       )}

//       {/* Skeleton */}
//       {listLoading && bookings.length === 0 && (
//         <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
//       )}

//       {/* Empty */}
//       {!listLoading && bookings.length === 0 && (
//         <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl text-center">
//           <div className="w-14 h-14 rounded-2xl bg-[#EEF6F2] flex items-center justify-center text-2xl mb-4">📭</div>
//           <p className="font-semibold text-gray-600 text-sm">No bookings found</p>
//           <p className="text-xs text-gray-400 mt-1">Database is clear. New bookings will appear here.</p>
//         </div>
//       )}

//       {/* Cards */}
//       {!listLoading && bookings.length > 0 && (
//         <div className="space-y-3">
//           {bookings.map((b, idx) => {
//             const av        = AVATAR_COLORS[idx % AVATAR_COLORS.length];
//             const isChecked = selected.has(b._id);
//             const isNearest = b._id === nearestId;
//             const st        = STATUS_MAP[b.status] ?? STATUS_MAP.confirmed;
//             const isEmailed = emailedIds.has(b._id);

//             return (
//               <div
//                 key={b._id}
//                 className={[
//                   "relative bg-white border rounded-2xl px-4 sm:px-5 py-4 transition-all duration-150",
//                   isNearest  ? "border-[#4E9C79] nearest-pulse" : "",
//                   isEmailed  ? "border-[#0C4733] bg-[#EEF6F2]/50" : "",
//                   isChecked && !isEmailed ? "border-[#4E9C79] ring-1 ring-[#4E9C79]/20" : "",
//                   !isNearest && !isChecked && !isEmailed ? "border-gray-100 hover:border-gray-200 hover:shadow-sm" : "",
//                 ].join(" ")}
//               >
//                 {isNearest && (
//                   <div className="absolute -top-2.5 left-4 flex items-center gap-1 bg-[#0C4733] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
//                     <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" />
//                     Next call
//                   </div>
//                 )}

//                 <div className="flex items-start gap-3 sm:gap-4">
//                   <input type="checkbox" checked={isChecked} onChange={() => toggleOne(b._id)}
//                     className="mt-1 w-3.5 h-3.5 accent-[#0C4733] cursor-pointer flex-shrink-0"
//                     aria-label={`Select ${b.firstName} ${b.lastName}`} />

//                   <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border"
//                     style={{ background: av.bg, color: av.color, borderColor: av.border }}>
//                     {INITIALS(b.firstName, b.lastName)}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-2 mb-1.5">
//                       <span className="font-semibold text-[13px] sm:text-sm text-gray-900">
//                         {b.firstName} {b.lastName}
//                       </span>
//                       <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
//                       {isEmailed && (
//                         <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-100 text-green-700">
//                           <MailCheck size={10} /> Emailed
//                         </span>
//                       )}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-gray-500">
//                       <span className="flex items-center gap-1"><Mail size={11} />{b.email}</span>
//                       <span className="flex items-center gap-1"><Phone size={11} />{b.phone}</span>
//                       <span className="flex items-center gap-1"><Calendar size={11} />{b.date}</span>
//                       <span className="flex items-center gap-1"><Clock size={11} />{b.time} IST</span>
//                       {b.socialLink && (
//                         <a href={b.socialLink} target="_blank" rel="noreferrer"
//                           className="flex items-center gap-1 text-[#0C4733] font-medium hover:underline">
//                           <Link size={11} />Profile
//                         </a>
//                       )}
//                     </div>

//                     {b.message && (
//                       <div className="mt-2 flex gap-2">
//                         <div className="w-0.5 flex-shrink-0 rounded-full bg-[#4E9C79]" />
//                         <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">{b.message}</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto pl-2">
//                     <button
//                       onClick={() => setViewBooking(b)}
//                       className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-400 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2] flex items-center justify-center transition"
//                       aria-label={`View ${b.firstName}`}
//                     >
//                       <Eye size={13} />
//                     </button>

//                     <button
//                       onClick={() => handleEmail(b)}
//                       className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
//                         isEmailed
//                           ? "border-[#0C4733] text-[#0C4733] bg-[#EEF6F2]"
//                           : "border-gray-200 bg-white text-gray-600 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2]"
//                       }`}
//                       aria-label={`Email ${b.firstName}`}
//                     >
//                       <Mail size={13} />
//                       <span className="hidden sm:inline">Email</span>
//                     </button>

//                     <button
//                       onClick={() => handleDeleteOne(b)}
//                       disabled={deleteLoading}
//                       className="w-8 h-8 rounded-lg border border-red-100 bg-white text-red-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
//                       aria-label={`Delete ${b.firstName}`}
//                     >
//                       <Trash2 size={13} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {bookings.length > 0 && !listLoading && (
//         <p className="mt-4 text-[11px] text-gray-300 text-center">
//           {bookings.length} record{bookings.length !== 1 ? "s" : ""} · Delete removes from DB permanently · Email opens Gmail
//         </p>
//       )}

//       {/* Modals */}
//       <ViewModal
//         booking={viewBooking}
//         onClose={() => setViewBooking(null)}
//         onEmail={handleEmail}
//       />

//       <DeleteConfirmModal
//         booking={delTarget}
//         onConfirm={confirmDeleteOne}
//         onCancel={() => setDelTarget(null)}
//       />

//       <EmailConfirmModal
//         booking={emailTarget}
//         onConfirm={confirmEmail}
//         onCancel={() => setEmailTarget(null)}
//       />
//     </div>
//   );
// }

// export default BookCallNotify;


import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Mail, Trash2, RefreshCw, Eye, Phone, Calendar, Clock,
  Link, X, User, FileText, Hash, MailCheck, CheckCircle,
  AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  fetchAllBookings, deleteBooking, deleteManyBookings,
  clearBookingError, selectAllBookings, selectListLoading,
  selectDeleteLoading, selectDeleteError,
} from "../../../redux-store/Bookingslice.js";

const INITIALS = (f, l) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
const AVATAR_COLORS = [
  { bg: "#EEF6F2", color: "#0C4733", border: "#4E9C79" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#8b5cf6" },
  { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" },
  { bg: "#fce7f3", color: "#9d174d", border: "#ec4899" },
  { bg: "#dbeafe", color: "#1e3a8a", border: "#3b82f6" },
];

const STATUS_MAP = {
  confirmed: { label: "confirmed", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pending:   { label: "pending",   cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  cancelled: { label: "cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const parseBookingDate = (dateStr, timeStr) => {
  try {
    if (!dateStr || !timeStr) return null;
    const [timePart, meridiem] = timeStr.trim().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;
    const d = new Date(dateStr);
    d.setHours(hours, minutes, 0, 0);
    return d;
  } catch { return null; }
};

const findNearestId = (bookings) => {
  const now = new Date();
  let nearestId = null, nearestDiff = Infinity;
  bookings.forEach((b) => {
    const dt = parseBookingDate(b.date, b.time);
    if (!dt) return;
    const diff = dt - now;
    if (diff > 0 && diff < nearestDiff) { nearestDiff = diff; nearestId = b._id; }
  });
  return nearestId;
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-4 flex items-start gap-3">
    <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse flex-shrink-0" />
    <div className="flex-1 space-y-2.5 pt-0.5">
      <div className="flex items-center gap-3">
        <div className="h-3.5 w-28 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
        <div className="h-3.5 w-14 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse" />
      </div>
      <div className="flex gap-3 flex-wrap">
        <div className="h-3 w-32 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
        <div className="h-3 w-20 rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  </div>
);

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteConfirmModal = ({ booking, onConfirm, onCancel }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xs p-5 sm:p-6 text-center">
        <div className="w-11 h-11 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Delete this booking?</h3>
        <p className="text-xs text-gray-400 mb-5">
          Permanently removes <span className="font-medium text-gray-600 dark:text-gray-300">{booking.firstName} {booking.lastName}</span>'s booking. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition">Delete</button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── Email Confirm Modal ───────────────────────────────────────────────────────
const EmailConfirmModal = ({ booking, onConfirm, onCancel }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xs p-5 sm:p-6 text-center">
        <div className="w-11 h-11 rounded-full bg-[#EEF6F2] flex items-center justify-center mx-auto mb-3">
          <Mail size={20} className="text-[#0C4733]" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Email {booking.firstName}?</h3>
        <p className="text-xs text-gray-400 mb-5">
          Opens Gmail compose to <span className="font-medium text-[#0C4733]">{booking.email}</span> for their call on {booking.date} at {booking.time}.
        </p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition">Open Gmail</button>
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─── View Modal ────────────────────────────────────────────────────────────────
const ViewModal = ({ booking, onClose, onEmail }) => {
  useEffect(() => {
    if (!booking) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [booking, onClose]);

  useEffect(() => {
    document.body.style.overflow = booking ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [booking]);

  if (!booking) return null;

  const st = STATUS_MAP[booking.status] ?? STATUS_MAP.confirmed;
  const dt = parseBookingDate(booking.date, booking.time);
  const isUpcoming = dt && dt > new Date();

  const Row = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]">
        <Icon size={13} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{value || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative px-5 pt-5 pb-4 flex-shrink-0" style={{ background: "#0C4733" }}>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="Close">
            <X size={14} />
          </button>
          {/* Mobile drag indicator */}
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-3" />
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white font-semibold text-base mb-2 border border-white/20">
            {INITIALS(booking.firstName, booking.lastName)}
          </div>
          <h3 className="text-white font-semibold text-base">{booking.firstName} {booking.lastName}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
            {isUpcoming && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">upcoming</span>}
          </div>
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Calendar size={12} className="text-white/70" />
            <span className="text-white text-xs font-medium">{booking.date}</span>
            <span className="text-white/30 mx-0.5">·</span>
            <Clock size={12} className="text-white/70" />
            <span className="text-white text-xs font-medium">{booking.time} IST</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-2 overflow-y-auto flex-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Contact</p>
          <Row icon={Mail}  label="Email" value={booking.email} />
          <Row icon={Phone} label="Phone" value={booking.phone} />
          {booking.socialLink && <Row icon={Link} label="Profile" value={booking.socialLink} />}
          {booking.message && (
            <>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Message</p>
              <div className="flex gap-2 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]">
                  <FileText size={13} />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 border-l-2 border-[#4E9C79] flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{booking.message}</p>
                </div>
              </div>
            </>
          )}
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">System</p>
          <Row icon={Hash} label="Booking ID" value={booking._id} />
          {booking.createdAt && (
            <Row icon={Calendar} label="Created at" value={new Date(booking.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
          <button onClick={() => { onClose(); onEmail(booking); }}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition">
            <Mail size={13} /> Open Gmail
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Booking Card ──────────────────────────────────────────────────────────────
const BookingCard = ({ b, idx, isChecked, isNearest, isEmailed, onToggle, onView, onEmail, onDelete, deleteLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const av  = AVATAR_COLORS[idx % AVATAR_COLORS.length];
  const st  = STATUS_MAP[b.status] ?? STATUS_MAP.confirmed;

  return (
    <div className={[
      "relative bg-white dark:bg-gray-800 border rounded-2xl transition-all duration-150",
      isNearest  ? "border-[#4E9C79] nearest-pulse" : "",
      isEmailed  ? "border-[#0C4733] bg-[#EEF6F2]/50 dark:bg-[#0C4733]/5" : "",
      isChecked && !isEmailed ? "border-[#4E9C79] ring-1 ring-[#4E9C79]/20" : "",
      !isNearest && !isChecked && !isEmailed ? "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm" : "",
    ].join(" ")}>

      {isNearest && (
        <div className="absolute -top-2.5 left-4 flex items-center gap-1 bg-[#0C4733] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" />
          Next call
        </div>
      )}

      <div className="px-4 py-4">
        {/* Main row */}
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={isChecked} onChange={() => onToggle(b._id)}
            className="mt-1 w-3.5 h-3.5 accent-[#0C4733] cursor-pointer flex-shrink-0"
            aria-label={`Select ${b.firstName} ${b.lastName}`} />

          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border"
            style={{ background: av.bg, color: av.color, borderColor: av.border }}>
            {INITIALS(b.firstName, b.lastName)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[140px] sm:max-w-none">
                {b.firstName} {b.lastName}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
              {isEmailed && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <MailCheck size={10} /> Emailed
                </span>
              )}
            </div>
            {/* Key info — always visible */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={11} />{b.date}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{b.time} IST</span>
              {/* Email hidden on xs to save space, shown on sm+ */}
              <span className="hidden sm:flex items-center gap-1"><Mail size={11} />{b.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            {/* View */}
            <button onClick={() => onView(b)}
              className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2] flex items-center justify-center transition"
              aria-label={`View ${b.firstName}`}>
              <Eye size={13} />
            </button>
            {/* Email */}
            <button onClick={() => onEmail(b)}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isEmailed
                  ? "border-[#0C4733] text-[#0C4733] bg-[#EEF6F2]"
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2]"
              }`}
              aria-label={`Email ${b.firstName}`}>
              <Mail size={13} /> Email
            </button>
            {/* Delete */}
            <button onClick={() => onDelete(b)} disabled={deleteLoading}
              className="w-8 h-8 rounded-lg border border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-700 text-red-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
              aria-label={`Delete ${b.firstName}`}>
              <Trash2 size={13} />
            </button>
            {/* Expand toggle on mobile */}
            <button onClick={() => setExpanded(!expanded)}
              className="sm:hidden w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 flex items-center justify-center transition"
              aria-label="Expand">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </div>

        {/* Expanded details on mobile */}
        {expanded && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Mail size={11} /><span>{b.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Phone size={11} /><span>{b.phone}</span>
            </div>
            {b.socialLink && (
              <a href={b.socialLink} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[#0C4733] font-medium hover:underline">
                <Link size={11} />Profile
              </a>
            )}
            {b.message && (
              <div className="flex gap-2 mt-2">
                <div className="w-0.5 flex-shrink-0 rounded-full bg-[#4E9C79]" />
                <p className="text-xs text-gray-400 leading-relaxed">{b.message}</p>
              </div>
            )}
            {/* Email button on mobile */}
            <button onClick={() => onEmail(b)}
              className={`w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border transition mt-2 ${
                isEmailed
                  ? "border-[#0C4733] text-[#0C4733] bg-[#EEF6F2]"
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2]"
              }`}>
              <Mail size={12} /> {isEmailed ? "Emailed" : "Send Email"}
            </button>
          </div>
        )}

        {/* Desktop: extra info always visible */}
        <div className="hidden sm:block mt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Phone size={11} />{b.phone}</span>
            {b.socialLink && (
              <a href={b.socialLink} target="_blank" rel="noreferrer"
                className="flex items-center gap-1 text-[#0C4733] font-medium hover:underline">
                <Link size={11} />Profile
              </a>
            )}
          </div>
          {b.message && (
            <div className="mt-2 flex gap-2">
              <div className="w-0.5 flex-shrink-0 rounded-full bg-[#4E9C79]" />
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{b.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
function BookCallNotify() {
  const dispatch      = useDispatch();
  const bookings      = useSelector(selectAllBookings);
  const listLoading   = useSelector(selectListLoading);
  const deleteLoading = useSelector(selectDeleteLoading);
  const deleteError   = useSelector(selectDeleteError);

  const [selected,    setSelected]    = useState(new Set());
  const [viewBooking, setViewBooking] = useState(null);
  const [delTarget,   setDelTarget]   = useState(null);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailedIds,  setEmailedIds]  = useState(new Set());

  useEffect(() => { dispatch(fetchAllBookings()); }, [dispatch]);
  useEffect(() => {
    if (!deleteError) return;
    const t = setTimeout(() => dispatch(clearBookingError()), 4000);
    return () => clearTimeout(t);
  }, [deleteError, dispatch]);

  const allSelected = useMemo(() => bookings.length > 0 && selected.size === bookings.length, [bookings.length, selected.size]);
  const nearestId   = useMemo(() => findNearestId(bookings), [bookings]);

  const toggleAll = () => allSelected ? setSelected(new Set()) : setSelected(new Set(bookings.map((b) => b._id)));
  const toggleOne = (id) => setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const confirmDeleteOne = async () => {
    if (!delTarget) return;
    if (viewBooking?._id === delTarget._id) setViewBooking(null);
    await dispatch(deleteBooking(delTarget._id));
    setSelected((prev) => { const n = new Set(prev); n.delete(delTarget._id); return n; });
    setDelTarget(null);
  };

  const handleDeleteSelected = async () => {
    if (!selected.size) return;
    await dispatch(deleteManyBookings([...selected]));
    setSelected(new Set());
  };

  const confirmEmail = () => {
    if (!emailTarget) return;
    const { email, firstName, date, time } = emailTarget;
    const su   = encodeURIComponent(`Re: Discovery Call – ${date} at ${time}`);
    const body = encodeURIComponent(`Hi ${firstName},\n\n`);
    window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${su}&body=${body}`, "_blank");
    setEmailedIds((prev) => new Set([...prev, emailTarget._id]));
    setEmailTarget(null);
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 font-sans">
      <style>{`
        @keyframes nearPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(78,156,121,0.4); }
          50%      { box-shadow: 0 0 0 5px rgba(78,156,121,0); }
        }
        .nearest-pulse { animation: nearPulse 2.5s ease infinite; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <div className="w-0.5 h-8 bg-[#0C4733] rounded-full" aria-hidden="true" />
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">Booking Notifications</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {listLoading ? "Fetching…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} in database`}
            </p>
          </div>
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => dispatch(fetchAllBookings())} disabled={listLoading}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition">
            <RefreshCw size={12} className={listLoading ? "animate-spin" : ""} />
            <span className="hidden xs:inline">{listLoading ? "Refreshing…" : "Refresh"}</span>
          </button>

          <label className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition select-none">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-3.5 h-3.5 accent-[#0C4733] cursor-pointer" />
            <span className="hidden xs:inline">Select all</span>
          </label>

          {selected.size > 0 && (
            <button onClick={handleDeleteSelected} disabled={deleteLoading}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50 transition">
              <Trash2 size={12} />
              Delete ({selected.size})
            </button>
          )}
        </div>
      </div>

      {/* ── Error banner ── */}
      {deleteError && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
          ⚠ {deleteError}
        </div>
      )}

      {/* ── Skeleton ── */}
      {listLoading && bookings.length === 0 && (
        <div className="space-y-3">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
      )}

      {/* ── Empty ── */}
      {!listLoading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EEF6F2] flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4">📭</div>
          <p className="font-semibold text-gray-600 dark:text-gray-300 text-sm">No bookings found</p>
          <p className="text-xs text-gray-400 mt-1">Database is clear. New bookings will appear here.</p>
        </div>
      )}

      {/* ── Cards ── */}
      {!listLoading && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b, idx) => (
            <BookingCard
              key={b._id}
              b={b}
              idx={idx}
              isChecked={selected.has(b._id)}
              isNearest={b._id === nearestId}
              isEmailed={emailedIds.has(b._id)}
              onToggle={toggleOne}
              onView={setViewBooking}
              onEmail={setEmailTarget}
              onDelete={setDelTarget}
              deleteLoading={deleteLoading}
            />
          ))}
        </div>
      )}

      {bookings.length > 0 && !listLoading && (
        <p className="mt-4 text-[11px] text-gray-300 dark:text-gray-600 text-center">
          {bookings.length} record{bookings.length !== 1 ? "s" : ""} · Delete removes from DB permanently · Email opens Gmail
        </p>
      )}

      {/* ── Modals ── */}
      <ViewModal booking={viewBooking} onClose={() => setViewBooking(null)} onEmail={setEmailTarget} />
      <DeleteConfirmModal booking={delTarget} onConfirm={confirmDeleteOne} onCancel={() => setDelTarget(null)} />
      <EmailConfirmModal  booking={emailTarget} onConfirm={confirmEmail} onCancel={() => setEmailTarget(null)} />
    </div>
  );
}

export default BookCallNotify;