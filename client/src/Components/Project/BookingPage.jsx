import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBookedDates,
  fetchBookedTimes,
  createBooking,
  resetBooking,
  clearBookingError,
  selectBookedDates,
  selectBookedTimes,
  selectTimesLoading,
  selectSubmitted,
  selectSubmitLoading,
  selectSubmitError,
} from "../../redux-store/Bookingslice";
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM",
  "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM",
];
const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const toDateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const today = new Date();
today.setHours(0, 0, 0, 0);
const STYLE_ID = "bp-scoped-styles";

const SCOPED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .bp-root *, .bp-root *::before, .bp-root *::after {
    box-sizing: border-box;
  }

  .bp-root {
    --or:   #ff6a00;
    --or2:  #ff8935;
    --or3:  #ffb37a;
    --bg:   #0c0c0e;
    --bg2:  #111114;
    --bg3:  #17171b;
    --bg4:  #1e1e24;
    --bdr:  rgba(255,255,255,0.07);
    --bdr2: rgba(255,255,255,0.12);
    --t1:   #eeeef2;
    --t2:   #9090a8;
    --t3:   #55556a;
    --font: 'DM Sans', sans-serif;
    --mono: 'DM Mono', monospace;
    font-family: var(--font);
    background: var(--bg);
    color: var(--t1);
    height: 100vh;
    max-height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
  }

  .bp-scroll::-webkit-scrollbar { width: 3px; }
  .bp-scroll::-webkit-scrollbar-track { background: transparent; }
  .bp-scroll::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.08);
    border-radius: 99px;
  }

  .bp-cal-cell:hover:not(.bp-dis) {
    background: rgba(255,255,255,0.07) !important;
    color: #fff !important;
  }

  .bp-slot:hover:not(.bp-slot-booked) {
    border-color: rgba(255,106,0,0.55) !important;
    background: rgba(255,106,0,0.08) !important;
    color: #fff !important;
  }

  .bp-input:focus, .bp-textarea:focus {
    border-color: rgba(255,106,0,0.55) !important;
    background: rgba(255,106,0,0.04) !important;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255,106,0,0.09);
  }
  .bp-input::placeholder, .bp-textarea::placeholder {
    color: rgba(255,255,255,0.2);
    font-family: 'DM Sans', sans-serif;
  }

  .bp-back:hover, .bp-step-back:hover {
    background: rgba(255,255,255,0.07) !important;
    color: rgba(255,255,255,0.75) !important;
    border-color: rgba(255,255,255,0.16) !important;
  }

  .bp-mnav:hover:not(:disabled) {
    background: rgba(255,255,255,0.09) !important;
    color: #fff !important;
  }

  .bp-cta { transition: all 0.18s !important; }
  .bp-cta:hover:not(:disabled) {
    box-shadow: 0 6px 28px rgba(255,106,0,0.35) !important;
    transform: translateY(-1px);
  }
  .bp-cta:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 14px rgba(255,106,0,0.22) !important;
  }

  @keyframes bp-pulse {
    0%,100% { opacity: 0.25; }
    50%      { opacity: 0.55; }
  }
  @keyframes bp-fade {
    from { opacity: 0; transform: translateY(7px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bp-fade { animation: bp-fade 0.22s ease forwards; }

  @keyframes bp-pop {
    0%   { transform: scale(0.65); opacity: 0; }
    60%  { transform: scale(1.1);  opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  .bp-pop { animation: bp-pop 0.42s cubic-bezier(.34,1.56,.64,1) forwards; }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .bp-spin { animation: spin 0.8s linear infinite; }
`;

function useBookingStyles() {
  useEffect(() => {
    // Only inject if not already present
    if (!document.getElementById(STYLE_ID)) {
      const el = document.createElement("style");
      el.id = STYLE_ID;
      el.textContent = SCOPED_CSS;
      document.head.appendChild(el);
    }
    // Cleanup: remove when component unmounts so it never bleeds into other pages
    return () => {
      const el = document.getElementById(STYLE_ID);
      if (el) el.remove();
    };
  }, []);
}
const I = {
  Back: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12L6 8l4-4" />
    </svg>
  ),
  Next: () => (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2l5 5-5 5" />
    </svg>
  ),
  Check: ({ sz = 11, col = "#ff8935" }) => (
    <svg width={sz} height={sz} viewBox="0 0 12 12" fill="none"
      stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  ),
  BigCheck: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
      stroke="#ff6a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  ),
  Spin: () => (
    <svg className="bp-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  Cal: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="2" y="3" width="12" height="11" rx="2" />
      <path d="M5 3V1M11 3V1M2 7h12" />
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3l2.5 2" />
    </svg>
  ),
  Video: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="1" y="4" width="10" height="8" rx="1.5" />
      <path d="M11 7l4-2v6l-4-2" />
    </svg>
  ),
  Globe: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
    </svg>
  ),
  Mail: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="1" y="3" width="14" height="10" rx="2" />
      <path d="M1 5l7 5 7-5" />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M3 2h3l1.5 3.5-2 1.5a9 9 0 003.5 3.5l1.5-2L14 10v3c0 1-1 2-2 1.5C5.5 13 3 7.5 2 4c-.5-1 .5-2 1-2z" />
    </svg>
  ),
  Link: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M7 9a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" />
      <path d="M9 7a3.5 3.5 0 00-5 0L2 9a3.5 3.5 0 005 5l1-1" />
    </svg>
  ),
  Msg: () => (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M2 2h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 2V3a1 1 0 011-1z" />
    </svg>
  ),
};

const SidebarSteps = ({ step }) => {
  const steps = [
    { label: "Date & Time",  sub: "Pick an open slot" },
    { label: "Your Details", sub: "Contact information" },
    { label: "Confirm",      sub: "Review & submit" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {steps.map((s, i) => {
        const active = i === step;
        const done   = i < step;
        return (
          <React.Fragment key={i}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 12px", borderRadius: 12,
              border: `1px solid ${active ? "rgba(255,106,0,0.22)" : "transparent"}`,
              background: active ? "rgba(255,106,0,0.07)" : "transparent",
              opacity: !active && !done ? 0.42 : 1,
              transition: "all 0.2s",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                background: active
                  ? "linear-gradient(135deg,#ff8935,#ff6a00)"
                  : done ? "rgba(255,106,0,0.16)" : "rgba(255,255,255,0.06)",
                color: active ? "#fff" : done ? "#ff8935" : "rgba(255,255,255,0.3)",
              }}>
                {done ? <I.Check sz={12} col="#ff8935" /> : i + 1}
              </div>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 600,
                  color: active ? "#eeeef2" : "rgba(255,255,255,0.45)",
                  lineHeight: 1.3,
                }}>{s.label}</div>
                <div style={{
                  fontSize: 11,
                  color: active ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.18)",
                  marginTop: 2,
                }}>{s.sub}</div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 1, height: 12,
                background: "rgba(255,255,255,0.06)",
                margin: "0 0 0 25px",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const SectionLabel = ({ icon, title, badge }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
    <span style={{ color: "rgba(255,255,255,0.35)", display: "flex" }}>{icon}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>{title}</span>
    {badge && (
      <span style={{
        fontSize: 10, color: "rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 5, padding: "2px 8px", letterSpacing: "0.04em",
      }}>{badge}</span>
    )}
  </div>
);

const Calendar = ({ selectedDate, onSelect, bookedDates }) => {
  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isPrevDis = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Month row */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 16,
      }}>
        <button className="bp-mnav" disabled={isPrevDis} onClick={prevMonth}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8, width: 32, height: 32,
            cursor: isPrevDis ? "not-allowed" : "pointer",
            color: "rgba(255,255,255,0.4)",
            opacity: isPrevDis ? 0.22 : 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, transition: "all 0.15s", fontFamily: "inherit",
          }}>‹</button>

        <span style={{
          fontSize: 14, fontWeight: 600,
          letterSpacing: "0.03em", color: "#eeeef2",
        }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>

        <button className="bp-mnav" onClick={nextMonth}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 8, width: 32, height: 32, cursor: "pointer",
            color: "rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, transition: "all 0.15s", fontFamily: "inherit",
          }}>›</button>
      </div>

      {/* Day names */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.07em", color: "#ff8935",
            padding: "3px 0", textTransform: "uppercase",
          }}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const key      = toDateKey(viewYear, viewMonth, day);
          const cell     = new Date(viewYear, viewMonth, day);
          const isPast   = cell < today;
          const isBooked = bookedDates?.includes(key);
          const isSun    = cell.getDay() === 0;
          const dis      = isPast || isBooked || isSun;
          const isSel    = selectedDate === key;
          const isTod    =
            day === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear  === today.getFullYear();

          return (
            <div key={key}
              className={`bp-cal-cell${dis ? " bp-dis" : ""}`}
              onClick={() => !dis && onSelect(key)}
              style={{
                aspectRatio: "1",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: 8, fontSize: 15,
                fontWeight: isSel ? 700 : 400,
                cursor: dis ? "default" : "pointer",
                transition: "all 0.13s",
                fontFamily: "var(--mono,'DM Mono',monospace)",
                color: dis
                  ? "rgba(255,255,255,0.13)"
                  : isSel ? "#fff"
                  : isTod ? "#ff8935"
                  : "#c2c2c2",
                background: isSel
                  ? "linear-gradient(135deg,#ff8935,#ff6a00)"
                  : "transparent",
                border: `1px solid ${
                  isSel ? "transparent"
                  : isTod && !isSel ? "rgba(255,106,0,0.35)"
                  : "transparent"
                }`,
                textDecoration: isBooked ? "line-through" : "none",
              }}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimeSlots = ({ selectedTime, onSelect, bookedTimes, loading }) => {
  if (loading) {
    return (
      <div style={{ marginTop: 22 }}>
        <SectionLabel icon={<I.Clock />} title="Select a Time" badge="IST" />
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          gap: 6, marginTop: 10,
        }}>
          {Array(8).fill(0).map((_, i) => (
            <div key={i} style={{
              height: 40, borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              animation: `bp-pulse 1.5s ease-in-out ${i * 0.07}s infinite`,
            }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 22 }} className="bp-fade">
      <SectionLabel icon={<I.Clock />} title="Select a Time" badge="IST" />
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 6, marginTop: 10,
      }}>
        {TIME_SLOTS.map(slot => {
          const isBooked = bookedTimes?.includes(slot);
          const isSel    = selectedTime === slot;
          return (
            <div key={slot}
              className={`bp-slot${isBooked ? " bp-slot-booked" : ""}`}
              onClick={() => !isBooked && onSelect(slot)}
              style={{
                textAlign: "center", padding: "10px 6px",
                borderRadius: 8, cursor: isBooked ? "not-allowed" : "pointer",
                fontSize: 12, fontFamily: "var(--mono,'DM Mono',monospace)",
                fontWeight: isSel ? 600 : 400, transition: "all 0.13s",
                border: `1px solid ${
                  isBooked ? "rgba(255,255,255,0.05)"
                  : isSel  ? "rgba(255,106,0,0.6)"
                  : "rgba(255,255,255,0.09)"
                }`,
                background: isBooked
                  ? "rgba(255,255,255,0.02)"
                  : isSel ? "rgba(255,106,0,0.12)"
                  : "rgba(255,255,255,0.03)",
                color: isBooked
                  ? "rgba(255,255,255,0.15)"
                  : isSel ? "#ff8935"
                  : "#a8a8c0",
              }}>
              {slot}
              {isBooked && (
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,0.18)",
                  marginTop: 3, letterSpacing: "0.04em",
                }}>Booked</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const inputSt = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "11px 14px",
  color: "#eeeef2", fontSize: 13,
  fontFamily: "'DM Sans', sans-serif",
  width: "100%", transition: "all 0.15s",
};

const Field = ({ label, icon, required, hint, children, full }) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: 7,
    gridColumn: full ? "1 / -1" : undefined,
  }}>
    <label style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <span style={{ color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center" }}>
        {icon}
      </span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#9898b8" }}>{label}</span>
      {required && <span style={{ color: "#ff6a00", fontSize: 13, lineHeight: 1 }}>*</span>}
      {hint && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontWeight: 400 }}>{hint}</span>}
    </label>
    {children}
  </div>
);

const DetailsForm = ({ form, setForm }) => {
  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <div className="bp-fade" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Field label="First Name" icon={<I.User />} required>
        <input className="bp-input" name="firstName" type="text"
          value={form.firstName} onChange={set} style={inputSt} />
      </Field>
      <Field label="Last Name" icon={<I.User />} required>
        <input className="bp-input" name="lastName" type="text"
          value={form.lastName} onChange={set} style={inputSt} />
      </Field>
      <Field label="Email Address" icon={<I.Mail />} required full>
        <input className="bp-input" name="email" type="email"
          value={form.email} onChange={set}
          placeholder="you@example.com" style={inputSt} />
      </Field>
      <Field label="Phone Number" icon={<I.Phone />} required full>
        <input className="bp-input" name="phone" type="tel"
          value={form.phone} onChange={set}
          placeholder="+91 98765 43210" style={inputSt} />
      </Field>
      <Field label="Social / Website" icon={<I.Link />} hint="(optional)" full>
        <input className="bp-input" name="socialLink" type="text"
          value={form.socialLink} onChange={set}
          placeholder="https://yoursite.com or @handle" style={inputSt} />
      </Field>
      <Field label="What to discuss?" icon={<I.Msg />} hint="(optional)" full>
        <textarea className="bp-textarea" name="message"
          value={form.message} onChange={set}
          placeholder="Brief about your project or query…"
          style={{ ...inputSt, resize: "none", height: 82 }} />
      </Field>
      <div style={{ gridColumn: "1/-1", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
        <span style={{ color: "#ff6a00" }}>*</span> Required fields
      </div>
    </div>
  );
};

const ConfirmCard = ({ selectedDate, selectedTime, form }) => {
  const rows = [
    { icon: <I.Cal />,   label: "Date",  value: selectedDate,               accent: true },
    { icon: <I.Clock />, label: "Time",  value: selectedTime,               accent: true },
    { icon: <I.User />,  label: "Name",  value: `${form.firstName} ${form.lastName}` },
    { icon: <I.Mail />,  label: "Email", value: form.email },
    { icon: <I.Phone />, label: "Phone", value: form.phone },
    form.socialLink ? { icon: <I.Link />, label: "Social", value: form.socialLink } : null,
  ].filter(Boolean);

  return (
    <div className="bp-fade" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14, overflow: "hidden",
      }}>
        {rows.map(({ icon, label, value, accent }, i) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 16px",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
          }}>
            <span style={{ color: "rgba(255,255,255,0.28)", display: "flex", flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", width: 52, flexShrink: 0 }}>{label}</span>
            <span style={{
              fontSize: 13, fontWeight: accent ? 600 : 400,
              color: accent ? "#ff8935" : "#d0d0e0",
              flex: 1, wordBreak: "break-all",
            }}>{value}</span>
          </div>
        ))}
      </div>

      {form.message && (
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12, padding: "12px 16px",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6,
          }}>Note</div>
          <div style={{ fontSize: 13, color: "#9090a8", lineHeight: 1.65 }}>{form.message}</div>
        </div>
      )}

      <div style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        background: "rgba(255,106,0,0.05)",
        border: "1px solid rgba(255,106,0,0.15)",
        borderRadius: 12, padding: "12px 16px",
      }}>
        <span style={{ color: "rgba(255,255,255,0.3)", display: "flex", marginTop: 1 }}>
          <I.Mail />
        </span>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.7, margin: 0 }}>
          A confirmation email will be sent to{" "}
          <span style={{ color: "#ff8935", fontWeight: 600 }}>{form.email}</span> within 5–6 minutes.
        </p>
      </div>
    </div>
  );
};

const SuccessScreen = ({ form, selectedDate, selectedTime }) => (
  <div className="bp-fade" style={{
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    flex: 1, gap: 22, textAlign: "center", padding: "24px 0",
  }}>
    <div className="bp-pop" style={{
      width: 70, height: 70, borderRadius: "50%",
      background: "rgba(255,106,0,0.08)",
      border: "1.5px solid rgba(255,106,0,0.28)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <I.BigCheck />
    </div>

    <div>
      <div style={{
        display: "inline-block",
        background: "rgba(255,106,0,0.1)",
        border: "1px solid rgba(255,106,0,0.2)",
        borderRadius: 7, padding: "3px 14px",
        fontSize: 11, color: "#ff8935",
        letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12,
      }}>Confirmed</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#eeeef2", marginBottom: 6 }}>
        You&rsquo;re Booked!
      </div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.38)" }}>
        {selectedDate} &middot; {selectedTime}
      </div>
    </div>

    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 14, padding: "16px 28px",
      fontSize: 13, color: "rgba(255,255,255,0.42)",
      maxWidth: 310, lineHeight: 1.75,
    }}>
      Confirmation sent to{" "}
      <span style={{ color: "#ff8935", fontWeight: 600 }}>{form.email}</span>.
      <br />
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
        Check spam if not visible in 5–6 mins.
      </span>
    </div>
  </div>
);


const PANEL_META = [
  { title: "Pick a Date & Time",  sub: "Select an available slot below" },
  { title: "Your Details",        sub: "We'll use this to confirm your booking" },
  { title: "Review & Confirm",    sub: "Double-check everything before submitting" },
];

const BookingPage = () => {
  // Inject scoped CSS, remove on unmount — no global bleed
  useBookingStyles();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const bookedDates  = useSelector(selectBookedDates);
  const bookedTimes  = useSelector(selectBookedTimes);
  const loadingSlots = useSelector(selectTimesLoading);
  const submitted    = useSelector(selectSubmitted);
  const submitting   = useSelector(selectSubmitLoading);
  const submitError  = useSelector(selectSubmitError);

  const [step, setStep]                 = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", socialLink: "", message: "",
  });

  useEffect(() => {
    dispatch(fetchBookedDates());
    return () => { dispatch(resetBooking()); };
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedTime(null);
    dispatch(fetchBookedTimes(selectedDate));
  }, [selectedDate, dispatch]);

  // Clear API error when user edits anything
  useEffect(() => {
    if (submitError) dispatch(clearBookingError());
  }, [form, selectedDate, selectedTime]); // eslint-disable-line

  const step0Valid = !!(selectedDate && selectedTime);
  const step1Valid = !!(
    form.firstName.trim() && form.lastName.trim() &&
    form.email.includes("@") && form.phone.trim().length >= 7
  );

  const handleSubmit = () => {
    dispatch(createBooking({ date: selectedDate, time: selectedTime, ...form }));
  };

  const ctaDisabled = step < 2
    ? (step === 0 ? !step0Valid : !step1Valid)
    : submitting;

  return (
    <div className="bp-root">

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <button className="bp-back" onClick={() => navigate(-1)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 10, padding: "7px 15px",
            color: "rgba(255,255,255,0.45)",
            fontSize: 12, fontWeight: 500, cursor: "pointer",
            transition: "all 0.18s", fontFamily: "inherit",
          }}>
          <I.Back /> Back
        </button>

        {!submitted && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 99, padding: "5px 14px",
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: 6, borderRadius: 3,
                width: i === step ? 22 : 6,
                background: i === step
                  ? "linear-gradient(90deg,#ff8935,#ff6a00)"
                  : i < step ? "rgba(255,106,0,0.4)"
                  : "rgba(255,255,255,0.1)",
                transition: "all 0.3s",
              }} />
            ))}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", marginLeft: 4 }}>
              Step {step + 1} of 3
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Sidebar ── */}
        <div style={{
          width: 252, minWidth: 252,
          borderRight: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 18px",
          display: "flex", flexDirection: "column", gap: 20,
          overflowY: "auto",
        }}>
          <div>
            <div style={{
              width: 40, height: 40, borderRadius: 11, marginBottom: 12,
              background: "linear-gradient(135deg,#ff8935,#ff6a00)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <I.Cal />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#eeeef2", lineHeight: 1.3 }}>
              Discovery Call
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", marginTop: 4 }}>
              Book a free session
            </div>
          </div>

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

          {!submitted && <SidebarSteps step={step} />}

          <div style={{ flex: 1 }} />

          <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <I.Clock />, text: "30 minutes" },
              { icon: <I.Video />, text: "Google Meet · Free" },
              { icon: <I.Globe />, text: "India Standard Time" },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 12, color: "rgba(255,255,255,0.32)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.2)", display: "flex" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          overflow: "hidden", padding: "26px 32px",
        }}>
          {submitted ? (
            <SuccessScreen
              form={form}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          ) : (
            <>
              {/* Panel heading */}
              <div style={{ marginBottom: 20, flexShrink: 0 }}>
                <h1 style={{
                  fontSize: 20, fontWeight: 700, color: "#eeeef2",
                  marginBottom: 4, letterSpacing: "-0.01em",
                  margin: "0 0 4px 0",
                }}>
                  {PANEL_META[step].title}
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                  {PANEL_META[step].sub}
                </p>
              </div>

              {/* Scrollable content */}
              <div className="bp-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: 6 }}>

                {step === 0 && (
                  <div className="bp-fade">
                    <SectionLabel
                      icon={<I.Cal />}
                      title="Select a Date"
                      badge="Sundays unavailable"
                    />
                    <div style={{ marginTop: 14 }}>
                      <Calendar
                        selectedDate={selectedDate}
                        onSelect={setSelectedDate}
                        bookedDates={bookedDates}
                      />
                    </div>
                    {selectedDate && (
                      <TimeSlots
                        selectedTime={selectedTime}
                        onSelect={setSelectedTime}
                        bookedTimes={bookedTimes}
                        loading={loadingSlots}
                      />
                    )}
                  </div>
                )}

                {step === 1 && (
                  <DetailsForm form={form} setForm={setForm} />
                )}

                {step === 2 && (
                  <ConfirmCard
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    form={form}
                  />
                )}

                {submitError && (
                  <div style={{
                    marginTop: 12, padding: "10px 16px",
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.22)",
                    borderRadius: 10, fontSize: 12,
                    color: "#f87171", textAlign: "center",
                  }}>
                    {submitError}
                  </div>
                )}
              </div>

              {/* ── Footer nav ── */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 16, marginTop: 6,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}>
                {step > 0 ? (
                  <button className="bp-step-back" onClick={() => setStep(s => s - 1)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      borderRadius: 10, padding: "9px 18px",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12, fontWeight: 500, cursor: "pointer",
                      transition: "all 0.18s", fontFamily: "inherit",
                    }}>
                    <I.Back /> Back
                  </button>
                ) : <div />}

                {step < 2 ? (
                  <button className="bp-cta" onClick={() => setStep(s => s + 1)}
                    disabled={ctaDisabled}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: ctaDisabled
                        ? "rgba(255,106,0,0.12)"
                        : "linear-gradient(135deg,#ff8935,#ff6a00)",
                      border: "none", borderRadius: 10, padding: "10px 22px",
                      color: ctaDisabled ? "rgba(255,255,255,0.22)" : "#fff",
                      fontSize: 13, fontWeight: 600,
                      cursor: ctaDisabled ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      boxShadow: ctaDisabled ? "none" : "0 4px 22px rgba(255,106,0,0.22)",
                    }}>
                    Continue <I.Next />
                  </button>
                ) : (
                  <button className="bp-cta" onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: submitting
                        ? "rgba(255,106,0,0.12)"
                        : "linear-gradient(135deg,#ff8935,#ff6a00)",
                      border: "none", borderRadius: 10, padding: "10px 22px",
                      color: submitting ? "rgba(255,255,255,0.3)" : "#fff",
                      fontSize: 13, fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      boxShadow: submitting ? "none" : "0 4px 22px rgba(255,106,0,0.22)",
                    }}>
                    {submitting
                      ? <><I.Spin /> Booking…</>
                      : <><I.Check sz={13} col="#fff" /> Confirm Booking</>
                    }
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;