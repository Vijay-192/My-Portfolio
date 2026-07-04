import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Mail, Trash2, RefreshCw, Eye, Phone, Calendar, Clock, Link, X, FileText, Hash, MailCheck, AlertTriangle, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { fetchAllBookings, deleteBooking, deleteManyBookings, clearBookingError, selectAllBookings, selectListLoading as selectBookingListLoading, selectDeleteLoading as selectBookingDeleteLoading, selectDeleteError as selectBookingDeleteError } from "../../../redux-store/Bookingslice.js";
import { fetchAllContacts, deleteContact, deleteManyContacts, clearDeleteError as clearContactDeleteError, selectAllContacts, selectListLoading as selectContactListLoading, selectDeleteLoading as selectContactDeleteLoading, selectDeleteError as selectContactDeleteError } from "../../../redux-store/ContactSlice.js";

const INITIALS = (f, l) => `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();
const COLORS = [
  { bg: "#EEF6F2", color: "#0C4733", border: "#4E9C79" },
  { bg: "#ede9fe", color: "#5b21b6", border: "#8b5cf6" },
  { bg: "#fef3c7", color: "#92400e", border: "#f59e0b" },
  { bg: "#fce7f3", color: "#9d174d", border: "#ec4899" },
  { bg: "#dbeafe", color: "#1e3a8a", border: "#3b82f6" },
];
const STATUS = {
  confirmed: { label: "confirmed", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pending:   { label: "pending",   cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  cancelled: { label: "cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const parseDate = (d, t) => {
  try {
    const [tp, mer] = t.trim().split(" ");
    let [h, m] = tp.split(":").map(Number);
    if (mer?.toUpperCase() === "PM" && h !== 12) h += 12;
    if (mer?.toUpperCase() === "AM" && h === 12) h = 0;
    const dt = new Date(d); dt.setHours(h, m, 0, 0); return dt;
  } catch { return null; }
};
const nearestId = (list) => {
  const now = new Date(); let id = null, diff = Infinity;
  list.forEach((b) => { const dt = parseDate(b.date, b.time); if (!dt) return; const d = dt - now; if (d > 0 && d < diff) { diff = d; id = b._id; } });
  return id;
};

const SkeletonCard = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="rounded-2xl px-4 py-4 flex items-start gap-3 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
      <Skeleton circle width={36} height={36} />
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex gap-3"><Skeleton width={110} height={13} borderRadius={6} /><Skeleton width={55} height={13} borderRadius={20} /></div>
        <div className="flex gap-3"><Skeleton width={120} height={11} borderRadius={6} /><Skeleton width={75} height={11} borderRadius={6} /></div>
      </div>
    </div>
  </SkeletonTheme>
);

const Backdrop = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
    onClick={(e) => e.target === e.currentTarget && onClose()}>
    {children}
  </div>
);

const DeleteModal = ({ label, onConfirm, onCancel }) => !label ? null : (
  <Backdrop onClose={onCancel}>
    <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xs p-5 sm:p-6 text-center">
      <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3"><AlertTriangle size={20} className="text-red-500" /></div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Delete this record?</h3>
      <p className="text-xs text-gray-400 mb-5">Permanently removes <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>. Cannot be undone.</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition">Delete</button>
        <button onClick={onCancel}  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
      </div>
    </div>
  </Backdrop>
);

const EmailModal = ({ booking, onConfirm, onCancel }) => !booking ? null : (
  <Backdrop onClose={onCancel}>
    <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xs p-5 sm:p-6 text-center">
      <div className="w-11 h-11 rounded-full bg-[#EEF6F2] flex items-center justify-center mx-auto mb-3"><Mail size={20} className="text-[#0C4733]" /></div>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Email {booking.firstName}?</h3>
      <p className="text-xs text-gray-400 mb-5">Opens Gmail to <span className="font-medium text-[#0C4733]">{booking.email}</span> for their call on {booking.date} at {booking.time}.</p>
      <div className="flex gap-2">
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition">Open Gmail</button>
        <button onClick={onCancel}  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
      </div>
    </div>
  </Backdrop>
);

const Row = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]"><Icon size={13} /></div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 dark:text-gray-200 break-words">{value || "—"}</p>
    </div>
  </div>
);

const useModalEffects = (open, onClose) => {
  useEffect(() => {
    if (!open) return;
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [open, onClose]);
};

const BookingModal = ({ booking, onClose, onEmail }) => {
  useModalEffects(!!booking, onClose);
  if (!booking) return null;
  const st = STATUS[booking.status] ?? STATUS.confirmed;
  const dt = parseDate(booking.date, booking.time);
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden max-h-[92vh] flex flex-col">
        <div className="relative px-5 pt-5 pb-4 flex-shrink-0" style={{ background: "#0C4733" }}>
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"><X size={14} /></button>
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-3" />
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white font-semibold text-base mb-2 border border-white/20">{INITIALS(booking.firstName, booking.lastName)}</div>
          <h3 className="text-white font-semibold text-base">{booking.firstName} {booking.lastName}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
            {dt && dt > new Date() && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700">upcoming</span>}
          </div>
          <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Calendar size={12} className="text-white/70" /><span className="text-white text-xs font-medium">{booking.date}</span>
            <span className="text-white/30 mx-0.5">·</span>
            <Clock size={12} className="text-white/70" /><span className="text-white text-xs font-medium">{booking.time} IST</span>
          </div>
        </div>
        <div className="px-5 py-2 overflow-y-auto flex-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Contact</p>
          <Row icon={Mail} label="Email" value={booking.email} />
          <Row icon={Phone} label="Phone" value={booking.phone} />
          {booking.socialLink && <Row icon={Link} label="Profile" value={booking.socialLink} />}
          {booking.message && <>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Message</p>
            <div className="flex gap-2 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#EEF6F2] flex items-center justify-center flex-shrink-0 text-[#0C4733]"><FileText size={13} /></div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2 border-l-2 border-[#4E9C79] flex-1"><p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{booking.message}</p></div>
            </div>
          </>}
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">System</p>
          <Row icon={Hash} label="Booking ID" value={booking._id} />
          {booking.createdAt && <Row icon={Calendar} label="Created at" value={new Date(booking.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />}
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
          <button onClick={() => { onClose(); onEmail(booking); }} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0C4733] text-white text-sm font-medium hover:bg-[#0a3d2b] transition"><Mail size={13} /> Open Gmail</button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Close</button>
        </div>
      </div>
    </Backdrop>
  );
};

const ContactModal = ({ contact, onClose }) => {
  useModalEffects(!!contact, onClose);
  if (!contact) return null;
  return (
    <Backdrop onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm overflow-hidden max-h-[92vh] flex flex-col">
        <div className="relative px-5 pt-5 pb-4 flex-shrink-0" style={{ background: "#1a1a2e" }}>
          <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"><X size={14} /></button>
          <div className="sm:hidden w-10 h-1 rounded-full bg-white/30 mx-auto mb-3" />
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white font-semibold text-base mb-2 border border-white/20">{contact.name?.[0]?.toUpperCase() ?? "?"}</div>
          <h3 className="text-white font-semibold text-base">{contact.name}</h3>
          <p className="text-white/60 text-xs mt-0.5">{contact.email}</p>
          {contact.subject && <div className="mt-3 bg-white/10 rounded-xl px-3 py-2"><p className="text-white/50 text-[10px] uppercase tracking-wider mb-0.5">Subject</p><p className="text-white text-xs font-medium">{contact.subject}</p></div>}
        </div>
        <div className="px-5 py-2 overflow-y-auto flex-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3 mb-1">Message</p>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 border-l-2 border-gray-300 dark:border-gray-500">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
          </div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-1">System</p>
          <Row icon={Hash} label="Contact ID" value={contact._id} />
          {contact.createdAt && <Row icon={Calendar} label="Received at" value={new Date(contact.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />}
        </div>
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-700 flex gap-2 flex-shrink-0">
          <a href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || "Your message")}`} target="_blank" rel="noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition">
            <Mail size={13} /> Reply via Email
          </a>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Close</button>
        </div>
      </div>
    </Backdrop>
  );
};

const BookingCard = ({ b, idx, isChecked, isNearest, isEmailed, onToggle, onView, onEmail, onDelete, deleteLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const av = COLORS[idx % COLORS.length];
  const st = STATUS[b.status] ?? STATUS.confirmed;
  const base = "relative bg-white dark:bg-gray-800 border rounded-2xl transition-all duration-150";
  const border = isNearest ? "border-[#4E9C79] nearest-pulse" : isEmailed ? "border-[#0C4733] bg-[#EEF6F2]/50 dark:bg-[#0C4733]/5" : isChecked ? "border-[#4E9C79] ring-1 ring-[#4E9C79]/20" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm";
  return (
    <div className={`${base} ${border}`}>
      {isNearest && <div className="absolute -top-2.5 left-4 flex items-center gap-1 bg-[#0C4733] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm"><span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" /> Next call</div>}
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={isChecked} onChange={() => onToggle(b._id)} className="mt-1 w-3.5 h-3.5 accent-[#0C4733] cursor-pointer flex-shrink-0" />
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border" style={{ background: av.bg, color: av.color, borderColor: av.border }}>{INITIALS(b.firstName, b.lastName)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[140px] sm:max-w-none">{b.firstName} {b.lastName}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
              {isEmailed && <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"><MailCheck size={10} /> Emailed</span>}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Calendar size={11} />{b.date}</span>
              <span className="flex items-center gap-1"><Clock size={11} />{b.time} IST</span>
              <span className="hidden sm:flex items-center gap-1"><Mail size={11} />{b.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <button onClick={() => onView(b)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2] flex items-center justify-center transition"><Eye size={13} /></button>
            <button onClick={() => onEmail(b)} className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${isEmailed ? "border-[#0C4733] text-[#0C4733] bg-[#EEF6F2]" : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2]"}`}><Mail size={13} /> Email</button>
            <button onClick={() => onDelete(b)} disabled={deleteLoading} className="w-8 h-8 rounded-lg border border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-700 text-red-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"><Trash2 size={13} /></button>
            <button onClick={() => setExpanded(!expanded)} className="sm:hidden w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 flex items-center justify-center transition">{expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}</button>
          </div>
        </div>
        {expanded && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><Mail size={11} /><span>{b.email}</span></div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"><Phone size={11} /><span>{b.phone}</span></div>
            {b.message && <div className="flex gap-2 mt-2"><div className="w-0.5 flex-shrink-0 rounded-full bg-[#4E9C79]" /><p className="text-xs text-gray-400 leading-relaxed">{b.message}</p></div>}
            <button onClick={() => onEmail(b)} className={`w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg border transition mt-2 ${isEmailed ? "border-[#0C4733] text-[#0C4733] bg-[#EEF6F2]" : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#0C4733] hover:text-[#0C4733] hover:bg-[#EEF6F2]"}`}><Mail size={12} /> {isEmailed ? "Emailed" : "Send Email"}</button>
          </div>
        )}
        <div className="hidden sm:block mt-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><Phone size={11} />{b.phone}</span>
            {b.socialLink && <a href={b.socialLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#0C4733] font-medium hover:underline"><Link size={11} />Profile</a>}
          </div>
          {b.message && <div className="mt-2 flex gap-2"><div className="w-0.5 flex-shrink-0 rounded-full bg-[#4E9C79]" /><p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{b.message}</p></div>}
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({ c, idx, isChecked, onToggle, onView, onDelete, deleteLoading }) => {
  const av = COLORS[idx % COLORS.length];
  return (
    <div className={`relative bg-white dark:bg-gray-800 border rounded-2xl transition-all duration-150 ${isChecked ? "border-gray-400 ring-1 ring-gray-400/20" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm"}`}>
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <input type="checkbox" checked={isChecked} onChange={() => onToggle(c._id)} className="mt-1 w-3.5 h-3.5 accent-gray-700 cursor-pointer flex-shrink-0" />
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border" style={{ background: av.bg, color: av.color, borderColor: av.border }}>{c.name?.[0]?.toUpperCase() ?? "?"}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate max-w-[140px] sm:max-w-none">{c.name}</span>
              {c.subject && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 truncate max-w-[120px]">{c.subject}</span>}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Mail size={11} />{c.email}</span>
              {c.createdAt && <span className="flex items-center gap-1"><Calendar size={11} />{new Date(c.createdAt).toLocaleDateString("en-IN")}</span>}
            </div>
            {c.message && <p className="mt-1.5 text-xs text-gray-400 line-clamp-1">{c.message}</p>}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-1">
            <button onClick={() => onView(c)} className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 hover:border-gray-700 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center transition"><Eye size={13} /></button>
            <button onClick={() => onDelete(c)} disabled={deleteLoading} className="w-8 h-8 rounded-lg border border-red-100 dark:border-red-900/30 bg-white dark:bg-gray-700 text-red-400 hover:border-red-300 hover:bg-red-50 hover:text-red-600 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"><Trash2 size={13} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};


const SectionHeader = ({ title, subtitle, accentColor, onRefresh, refreshing, selectedCount, allSelected, onToggleAll, onDeleteSelected, deleteLoading }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-5">
    <div className="flex items-center gap-3">
      <div className="w-0.5 h-8 rounded-full" style={{ background: accentColor }} />
      <div><h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2><p className="text-xs text-gray-400 mt-0.5">{subtitle}</p></div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={onRefresh} disabled={refreshing} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition">
        <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /><span className="hidden xs:inline">{refreshing ? "Refreshing…" : "Refresh"}</span>
      </button>
      <label className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition select-none">
        <input type="checkbox" checked={allSelected} onChange={onToggleAll} className="w-3.5 h-3.5 cursor-pointer" style={{ accentColor }} /><span className="hidden xs:inline">Select all</span>
      </label>
      {selectedCount > 0 && (
        <button onClick={onDeleteSelected} disabled={deleteLoading} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50 transition">
          <Trash2 size={12} /> Delete ({selectedCount})
        </button>
      )}
    </div>
  </div>
);

const Empty = ({ icon: Icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-center">
    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3"><Icon size={22} className="text-gray-400" /></div>
    <p className="font-semibold text-gray-600 dark:text-gray-300 text-sm">{title}</p>
    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
  </div>
);


const BookCallNotify = () => {
  const dispatch = useDispatch();

  const bookings           = useSelector(selectAllBookings);
  const bookingListLoading = useSelector(selectBookingListLoading);
  const bookingDelLoading  = useSelector(selectBookingDeleteLoading);
  const bookingDelError    = useSelector(selectBookingDeleteError);

  const contacts           = useSelector(selectAllContacts);
  const contactListLoading = useSelector(selectContactListLoading);
  const contactDelLoading  = useSelector(selectContactDeleteLoading);
  const contactDelError    = useSelector(selectContactDeleteError);

  const [bookingSel,  setBookingSel]  = useState(new Set());
  const [viewBooking, setViewBooking] = useState(null);
  const [delBooking,  setDelBooking]  = useState(null);
  const [emailTarget, setEmailTarget] = useState(null);
  const [emailedIds,  setEmailedIds]  = useState(new Set());

  const [contactSel,  setContactSel]  = useState(new Set());
  const [viewContact, setViewContact] = useState(null);
  const [delContact,  setDelContact]  = useState(null);

  useEffect(() => { dispatch(fetchAllBookings()); dispatch(fetchAllContacts()); }, [dispatch]);
  useEffect(() => { if (!bookingDelError) return; const t = setTimeout(() => dispatch(clearBookingError()), 4000); return () => clearTimeout(t); }, [bookingDelError, dispatch]);
  useEffect(() => { if (!contactDelError) return; const t = setTimeout(() => dispatch(clearContactDeleteError()), 4000); return () => clearTimeout(t); }, [contactDelError, dispatch]);

  const allBookingSel = useMemo(() => bookings.length > 0 && bookingSel.size === bookings.length, [bookings.length, bookingSel.size]);
  const allContactSel = useMemo(() => contacts.length > 0 && contactSel.size === contacts.length, [contacts.length, contactSel.size]);
  const nearest       = useMemo(() => nearestId(bookings), [bookings]);

  const toggleSet = (set, setFn, id) => setFn(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAllBooking  = () => allBookingSel ? setBookingSel(new Set()) : setBookingSel(new Set(bookings.map(b => b._id)));
  const toggleAllContact  = () => allContactSel ? setContactSel(new Set()) : setContactSel(new Set(contacts.map(c => c._id)));

  const confirmDeleteBooking = async () => {
    if (!delBooking) return;
    if (viewBooking?._id === delBooking._id) setViewBooking(null);
    await dispatch(deleteBooking(delBooking._id));
    setBookingSel(prev => { const n = new Set(prev); n.delete(delBooking._id); return n; });
    setDelBooking(null);
  };
  const confirmDeleteContact = async () => {
    if (!delContact) return;
    if (viewContact?._id === delContact._id) setViewContact(null);
    await dispatch(deleteContact(delContact._id));
    setContactSel(prev => { const n = new Set(prev); n.delete(delContact._id); return n; });
    setDelContact(null);
  };
  const confirmEmail = () => {
    if (!emailTarget) return;
    const { email, firstName, date, time } = emailTarget;
    window.open(`https://mail.google.com/mail/?view=cm&to=${email}&su=${encodeURIComponent(`Re: Discovery Call – ${date} at ${time}`)}&body=${encodeURIComponent(`Hi ${firstName},\n\n`)}`, "_blank");
    setEmailedIds(prev => new Set([...prev, emailTarget._id]));
    setEmailTarget(null);
  };

  const ErrorBanner = ({ msg }) => msg ? (
    <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">⚠ {msg}</div>
  ) : null;

  return (
    <div className="p-3 sm:p-4 md:p-6 font-sans space-y-10">
      <style>{`@keyframes nearPulse{0%,100%{box-shadow:0 0 0 0 rgba(78,156,121,0.4)}50%{box-shadow:0 0 0 5px rgba(78,156,121,0)}}.nearest-pulse{animation:nearPulse 2.5s ease infinite}`}</style>


      <section>
        <SectionHeader title="Booking Notifications" accentColor="#0C4733"
          subtitle={bookingListLoading ? "Fetching…" : `${bookings.length} booking${bookings.length !== 1 ? "s" : ""} in database`}
          onRefresh={() => dispatch(fetchAllBookings())} refreshing={bookingListLoading}
          allSelected={allBookingSel} onToggleAll={toggleAllBooking}
          selectedCount={bookingSel.size} onDeleteSelected={async () => { await dispatch(deleteManyBookings([...bookingSel])); setBookingSel(new Set()); }}
          deleteLoading={bookingDelLoading} />
        <ErrorBanner msg={bookingDelError} />
        {bookingListLoading && bookings.length === 0 && <div className="space-y-3">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>}
        {!bookingListLoading && bookings.length === 0 && <Empty icon={Mail} title="No bookings found" subtitle="New bookings will appear here." />}
        {!bookingListLoading && bookings.length > 0 && (
          <div className="space-y-3">
            {bookings.map((b, idx) => <BookingCard key={b._id} b={b} idx={idx} isChecked={bookingSel.has(b._id)} isNearest={b._id === nearest} isEmailed={emailedIds.has(b._id)} onToggle={id => toggleSet(bookingSel, setBookingSel, id)} onView={setViewBooking} onEmail={setEmailTarget} onDelete={setDelBooking} deleteLoading={bookingDelLoading} />)}
          </div>
        )}
        {bookings.length > 0 && !bookingListLoading && <p className="mt-4 text-[11px] text-gray-300 dark:text-gray-600 text-center">{bookings.length} record{bookings.length !== 1 ? "s" : ""} · Delete removes from DB · Email opens Gmail</p>}
      </section>

      <div className="border-t border-gray-100 dark:border-gray-700" />

   
      <section>
        <SectionHeader title="Contact Messages" accentColor="#374151"
          subtitle={contactListLoading ? "Fetching…" : `${contacts.length} message${contacts.length !== 1 ? "s" : ""} in database`}
          onRefresh={() => dispatch(fetchAllContacts())} refreshing={contactListLoading}
          allSelected={allContactSel} onToggleAll={toggleAllContact}
          selectedCount={contactSel.size} onDeleteSelected={async () => { await dispatch(deleteManyContacts([...contactSel])); setContactSel(new Set()); }}
          deleteLoading={contactDelLoading} />
        <ErrorBanner msg={contactDelError} />
        {contactListLoading && contacts.length === 0 && <div className="space-y-3">{[1,2].map(i => <SkeletonCard key={i} />)}</div>}
        {!contactListLoading && contacts.length === 0 && <Empty icon={MessageSquare} title="No contact messages" subtitle="Messages from your contact form will appear here." />}
        {!contactListLoading && contacts.length > 0 && (
          <div className="space-y-3">
            {contacts.map((c, idx) => <ContactCard key={c._id} c={c} idx={idx} isChecked={contactSel.has(c._id)} onToggle={id => toggleSet(contactSel, setContactSel, id)} onView={setViewContact} onDelete={setDelContact} deleteLoading={contactDelLoading} />)}
          </div>
        )}
        {contacts.length > 0 && !contactListLoading && <p className="mt-4 text-[11px] text-gray-300 dark:text-gray-600 text-center">{contacts.length} record{contacts.length !== 1 ? "s" : ""} · Delete removes from DB permanently</p>}
      </section>


      <BookingModal booking={viewBooking} onClose={() => setViewBooking(null)} onEmail={setEmailTarget} />
      <ContactModal contact={viewContact} onClose={() => setViewContact(null)} />
      <DeleteModal label={delBooking ? `${delBooking.firstName} ${delBooking.lastName}` : null} onConfirm={confirmDeleteBooking} onCancel={() => setDelBooking(null)} />
      <DeleteModal label={delContact ? delContact.name : null} onConfirm={confirmDeleteContact} onCancel={() => setDelContact(null)} />
      <EmailModal  booking={emailTarget} onConfirm={confirmEmail} onCancel={() => setEmailTarget(null)} />
    </div>
  );
};

export default BookCallNotify;