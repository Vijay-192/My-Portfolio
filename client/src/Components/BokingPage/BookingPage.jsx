// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchBookedDates,
//   fetchBookedTimes,
//   createBooking,
//   resetBooking,
//   clearBookingError,
//   selectBookedDates,
//   selectBookedTimes,
//   selectTimesLoading,
//   selectSubmitted,
//   selectSubmitLoading,
//   selectSubmitError,
// } from "../../redux-store/Bookingslice";

// const TIME_SLOTS = [
//   "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
//   "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
//   "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
//   "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
// ];

// const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// const MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// const PANEL_META = [
//   { title: "Pick a Date & Time", sub: "Select an available slot below" },
//   { title: "Your Details", sub: "We'll use this to confirm your booking" },
//   { title: "Review & Confirm", sub: "Double-check everything before submitting" },
// ];

// const toDateKey = (y, m, d) =>
//   `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// const today = new Date();
// today.setHours(0, 0, 0, 0);

// const Icon = {
//   Back: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M10 12L6 8l4-4" />
//     </svg>
//   ),
//   Next: () => (
//     <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M4 2l5 5-5 5" />
//     </svg>
//   ),
//   Check: ({ className = "" }) => (
//     <svg width="13" height="13" viewBox="0 0 12 12" fill="none" className={className} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 6l3 3 5-5" />
//     </svg>
//   ),
//   BigCheck: () => (
//     <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M5 13l4 4L19 7" />
//     </svg>
//   ),
//   Spin: () => (
//     <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="3" strokeOpacity="0.2" />
//       <path d="M12 2a10 10 0 0 1 10 10" stroke="black" strokeWidth="3" strokeLinecap="round" />
//     </svg>
//   ),
//   Cal: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <rect x="2" y="3" width="12" height="11" rx="2" />
//       <path d="M5 3V1M11 3V1M2 7h12" />
//     </svg>
//   ),
//   Clock: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <circle cx="8" cy="8" r="6" />
//       <path d="M8 5v3l2.5 2" />
//     </svg>
//   ),
//   Video: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <rect x="1" y="4" width="10" height="8" rx="1.5" />
//       <path d="M11 7l4-2v6l-4-2" />
//     </svg>
//   ),
//   Globe: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <circle cx="8" cy="8" r="6" />
//       <path d="M2 8h12M8 2c-2 2-3 4-3 6s1 4 3 6M8 2c2 2 3 4 3 6s-1 4-3 6" />
//     </svg>
//   ),
//   User: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <circle cx="8" cy="5" r="3" />
//       <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
//     </svg>
//   ),
//   Mail: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <rect x="1" y="3" width="14" height="10" rx="2" />
//       <path d="M1 5l7 5 7-5" />
//     </svg>
//   ),
//   Phone: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <path d="M3 2h3l1.5 3.5-2 1.5a9 9 0 003.5 3.5l1.5-2L14 10v3c0 1-1 2-2 1.5C5.5 13 3 7.5 2 4c-.5-1 .5-2 1-2z" />
//     </svg>
//   ),
//   Link: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <path d="M7 9a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" />
//       <path d="M9 7a3.5 3.5 0 00-5 0L2 9a3.5 3.5 0 005 5l1-1" />
//     </svg>
//   ),
//   Msg: () => (
//     <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
//       <path d="M2 2h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 2V3a1 1 0 011-1z" />
//     </svg>
//   ),
// };

// function SidebarSteps({ step }) {
//   const steps = [
//     { label: "Date & Time", sub: "Pick an open slot" },
//     { label: "Your Details", sub: "Contact information" },
//     { label: "Confirm", sub: "Review & submit" },
//   ];

//   return (
//     <div className="flex flex-col gap-0.5">
//       {steps.map((s, i) => {
//         const active = i === step;
//         const done = i < step;
//         return (
//           <React.Fragment key={s.label}>
//             <div
//               className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
//                 active ? "border-white/20 bg-white/[0.07]" : "border-transparent"
//               } ${!active && !done ? "opacity-40" : "opacity-100"}`}
//             >
//               <div
//                 className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
//                   active
//                     ? "bg-gradient-to-br from-white to-gray-300 text-black"
//                     : done
//                     ? "bg-white/15 text-white"
//                     : "bg-white/5 text-white/30"
//                 }`}
//               >
//                 {done ? <Icon.Check /> : i + 1}
//               </div>
//               <div>
//                 <div className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-white/45"}`}>
//                   {s.label}
//                 </div>
//                 <div className={`mt-0.5 text-[11px] ${active ? "text-white/40" : "text-white/15"}`}>
//                   {s.sub}
//                 </div>
//               </div>
//             </div>
//             {i < steps.length - 1 && <div className="ml-[25px] h-3 w-px bg-white/[0.06]" />}
//           </React.Fragment>
//         );
//       })}
//     </div>
//   );
// }

// function SectionLabel({ icon, title, badge }) {
//   return (
//     <div className="mb-1 flex items-center gap-2">
//       <span className="flex text-white/35">{icon}</span>
//       <span className="text-[13px] font-semibold text-white/80">{title}</span>
//       {badge && (
//         <span className="rounded-md border border-white/[0.08] bg-white/5 px-2 py-0.5 text-[10px] tracking-wide text-white/30">
//           {badge}
//         </span>
//       )}
//     </div>
//   );
// }

// function Calendar({ selectedDate, onSelect, bookedDates }) {
//   const [viewYear, setViewYear] = useState(today.getFullYear());
//   const [viewMonth, setViewMonth] = useState(today.getMonth());

//   const firstDay = new Date(viewYear, viewMonth, 1).getDay();
//   const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
//   const isPrevDisabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

//   const prevMonth = () => {
//     if (viewMonth === 0) {
//       setViewMonth(11);
//       setViewYear((y) => y - 1);
//     } else {
//       setViewMonth((m) => m - 1);
//     }
//   };

//   const nextMonth = () => {
//     if (viewMonth === 11) {
//       setViewMonth(0);
//       setViewYear((y) => y + 1);
//     } else {
//       setViewMonth((m) => m + 1);
//     }
//   };

//   const cells = [
//     ...Array(firstDay).fill(null),
//     ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
//   ];

//   return (
//     <div>
//       <div className="mb-4 flex items-center justify-between">
//         <button className="bp-nav-btn" disabled={isPrevDisabled} onClick={prevMonth}>‹</button>
//         <span className="text-sm font-semibold tracking-wide text-white">
//           {MONTHS[viewMonth]} {viewYear}
//         </span>
//         <button className="bp-nav-btn" onClick={nextMonth}>›</button>
//       </div>

//       <div className="mb-1.5 grid grid-cols-7">
//         {DAYS.map((d) => (
//           <div key={d} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-white/70">
//             {d}
//           </div>
//         ))}
//       </div>

//       <div className="grid grid-cols-7 gap-1">
//         {cells.map((day, idx) => {
//           if (!day) return <div key={`e-${idx}`} />;
//           const key = toDateKey(viewYear, viewMonth, day);
//           const cell = new Date(viewYear, viewMonth, day);
//           const isPast = cell < today;
//           const isBooked = bookedDates?.includes(key);
//           const isSunday = cell.getDay() === 0;
//           const disabled = isPast || isBooked || isSunday;
//           const isSelected = selectedDate === key;
//           const isToday =
//             day === today.getDate() &&
//             viewMonth === today.getMonth() &&
//             viewYear === today.getFullYear();

//           return (
//             <div
//               key={key}
//               onClick={() => !disabled && onSelect(key)}
//               className={`bp-cal-cell ${disabled ? "bp-cal-disabled" : ""} ${
//                 isSelected ? "bp-cal-selected" : ""
//               } ${isToday && !isSelected ? "bp-cal-today" : ""}`}
//             >
//               {day}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function TimeSlots({ selectedTime, onSelect, bookedTimes, loading }) {
//   return (
//     <div className="mt-6">
//       <SectionLabel icon={<Icon.Clock />} title="Select a Time" badge="IST" />
//       {loading ? (
//         <div className="mt-2.5 grid grid-cols-4 gap-1.5">
//           {Array.from({ length: 8 }, (_, i) => (
//             <div key={i} className="h-10 animate-pulse rounded-lg bg-white/[0.04]" />
//           ))}
//         </div>
//       ) : (
//         <div className="mt-2.5 grid animate-fade-up grid-cols-4 gap-1.5">
//           {TIME_SLOTS.map((slot) => {
//             const isBooked = bookedTimes?.includes(slot);
//             const isSelected = selectedTime === slot;
//             return (
//               <div
//                 key={slot}
//                 onClick={() => !isBooked && onSelect(slot)}
//                 className={`bp-slot ${isBooked ? "bp-slot-booked" : ""} ${isSelected ? "bp-slot-selected" : ""}`}
//               >
//                 {slot}
//                 {isBooked && <div className="mt-0.5 text-[9px] tracking-wide text-white/15">Booked</div>}
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// function Field({ label, icon, required, hint, children, full }) {
//   return (
//     <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
//       <label className="flex items-center gap-1.5">
//         <span className="flex items-center text-white/30">{icon}</span>
//         <span className="text-[13px] font-semibold text-white/55">{label}</span>
//         {required && <span className="text-[13px] leading-none text-white">*</span>}
//         {hint && <span className="text-[11px] font-normal text-white/20">{hint}</span>}
//       </label>
//       {children}
//     </div>
//   );
// }

// function DetailsForm({ form, setForm }) {
//   const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

//   return (
//     <div className="grid animate-fade-up grid-cols-2 gap-3.5">
//       <Field label="First Name" icon={<Icon.User />} required>
//         <input className="bp-input" name="firstName" value={form.firstName} onChange={handleChange} />
//       </Field>
//       <Field label="Last Name" icon={<Icon.User />} required>
//         <input className="bp-input" name="lastName" value={form.lastName} onChange={handleChange} />
//       </Field>
//       <Field label="Email Address" icon={<Icon.Mail />} required full>
//         <input className="bp-input" name="email" type="email" placeholder="enter your email" value={form.email} onChange={handleChange} />
//       </Field>
//       <Field label="Phone Number" icon={<Icon.Phone />} required full>
//         <input className="bp-input" name="phone" type="tel" placeholder="enter your phone number" value={form.phone} onChange={handleChange} />
//       </Field>
//       <Field label="Social / Website" icon={<Icon.Link />} hint="(optional)" full>
//         <input className="bp-input" name="socialLink" placeholder="enter your social media link or website" value={form.socialLink} onChange={handleChange} />
//       </Field>
//       <Field label="What to discuss?" icon={<Icon.Msg />} hint="(optional)" full>
//         <textarea className="bp-input h-20 resize-none" name="message" placeholder="briefly describe your project or query…" value={form.message} onChange={handleChange} />
//       </Field>
//       <div className="col-span-2 text-[11px] text-white/20">
//         <span className="text-white">*</span> Required fields
//       </div>
//     </div>
//   );
// }

// function ConfirmCard({ selectedDate, selectedTime, form }) {
//   const rows = [
//     { icon: <Icon.Cal />, label: "Date", value: selectedDate, accent: true },
//     { icon: <Icon.Clock />, label: "Time", value: selectedTime, accent: true },
//     { icon: <Icon.User />, label: "Name", value: `${form.firstName} ${form.lastName}` },
//     { icon: <Icon.Mail />, label: "Email", value: form.email },
//     { icon: <Icon.Phone />, label: "Phone", value: form.phone },
//     form.socialLink ? { icon: <Icon.Link />, label: "Social", value: form.socialLink } : null,
//   ].filter(Boolean);

//   return (
//     <div className="flex animate-fade-up flex-col gap-2.5">
//       <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
//         {rows.map(({ icon, label, value, accent }, i) => (
//           <div
//             key={label}
//             className={`flex items-center gap-3 px-4 py-3 ${i < rows.length - 1 ? "border-b border-white/[0.05]" : ""}`}
//           >
//             <span className="flex flex-shrink-0 text-white/25">{icon}</span>
//             <span className="w-14 flex-shrink-0 text-xs text-white/30">{label}</span>
//             <span className={`flex-1 break-all text-[13px] ${accent ? "font-semibold text-white" : "font-normal text-white/80"}`}>
//               {value}
//             </span>
//           </div>
//         ))}
//       </div>

//       {form.message && (
//         <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
//           <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/25">Note</div>
//           <div className="text-[13px] leading-relaxed text-white/60">{form.message}</div>
//         </div>
//       )}

//       <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
//         <span className="mt-0.5 flex text-white/30"><Icon.Mail /></span>
//         <p className="text-xs leading-relaxed text-white/40">
//           A confirmation email will be sent to <span className="font-semibold text-white">{form.email}</span> within 5–6 minutes.
//         </p>
//       </div>
//     </div>
//   );
// }

// function SuccessScreen({ form, selectedDate, selectedTime }) {
//   return (
//     <div className="flex flex-1 animate-fade-up flex-col items-center justify-center gap-5 px-0 py-6 text-center">
//       <div className="flex h-[70px] w-[70px] animate-pop-in items-center justify-center rounded-full border-[1.5px] border-white/30 bg-white/10">
//         <Icon.BigCheck />
//       </div>
//       <div>
//         <div className="mb-3 inline-block rounded-md border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] uppercase tracking-widest text-white">
//           Confirmed
//         </div>
//         <div className="mb-1.5 text-2xl font-bold text-white">You&rsquo;re Booked!</div>
//         <div className="text-sm text-white/40">{selectedDate} &middot; {selectedTime}</div>
//       </div>
//       <div className="max-w-[310px] rounded-2xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-[13px] leading-relaxed text-white/45">
//         Confirmation sent to <span className="font-semibold text-white">{form.email}</span>.
//         <br />
//         <span className="text-[11px] text-white/20">Check spam if not visible in 5–6 mins.</span>
//       </div>
//     </div>
//   );
// }

// export default function BookingPage() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const bookedDates = useSelector(selectBookedDates);
//   const bookedTimes = useSelector(selectBookedTimes);
//   const loadingSlots = useSelector(selectTimesLoading);
//   const submitted = useSelector(selectSubmitted);
//   const submitting = useSelector(selectSubmitLoading);
//   const submitError = useSelector(selectSubmitError);

//   const [step, setStep] = useState(0);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState(null);
//   const [form, setForm] = useState({
//     firstName: "", lastName: "", email: "", phone: "", socialLink: "", message: "",
//   });

//   const timeSlotsRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchBookedDates());
//     return () => dispatch(resetBooking());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!selectedDate) return;
//     setSelectedTime(null);
//     dispatch(fetchBookedTimes(selectedDate));
//   }, [selectedDate, dispatch]);

//   useEffect(() => {
//     if (!selectedDate) return;
//     const id = setTimeout(() => {
//       timeSlotsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     }, 120);
//     return () => clearTimeout(id);
//   }, [selectedDate, loadingSlots]);

//   useEffect(() => {
//     if (submitError) dispatch(clearBookingError());
//   }, [form, selectedDate, selectedTime]); // eslint-disable-line

//   const step0Valid = !!(selectedDate && selectedTime);
//   const step1Valid = !!(
//     form.firstName.trim() &&
//     form.lastName.trim() &&
//     form.email.includes("@") &&
//     form.phone.trim().length >= 7
//   );

//   const ctaDisabled = step < 2 ? (step === 0 ? !step0Valid : !step1Valid) : submitting;

//   const handleSubmit = () => {
//     dispatch(createBooking({ date: selectedDate, time: selectedTime, ...form }));
//   };

//   return (
//     <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-black font-JetBrainsMono text-white">
//       <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-3">
//         <button className="bp-btn-ghost" onClick={() => navigate(-1)}>
//           <Icon.Back /> Back
//         </button>

//         {!submitted && (
//           <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
//             {[0, 1, 2].map((i) => (
//               <div
//                 key={i}
//                 className={`h-1.5 rounded-full transition-all duration-300 ${
//                   i === step
//                     ? "w-5.5 bg-gradient-to-r from-white to-gray-300"
//                     : i < step
//                     ? "w-1.5 bg-white/40"
//                     : "w-1.5 bg-white/10"
//                 }`}
//               />
//             ))}
//             <span className="ml-1 text-[11px] text-white/30">Step {step + 1} of 3</span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         <div className="flex w-[252px] min-w-[252px] flex-col gap-5 overflow-y-auto border-r border-white/[0.06] px-4.5 py-6">
//           <div>
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white to-gray-300 text-black">
//               <Icon.Cal />
//             </div>
//             <div className="text-base font-bold leading-tight text-white">Discovery Call</div>
//             <div className="mt-1 text-xs text-white/30">Book a free session</div>
//           </div>

//           <div className="border-b border-white/[0.06]" />

//           {!submitted && <SidebarSteps step={step} />}

//           <div className="flex-1" />

//           <div className="border-b border-white/[0.06]" />

//           <div className="flex flex-col gap-2.5">
//             {[
//               { icon: <Icon.Clock />, text: "30 minutes" },
//               { icon: <Icon.Video />, text: "Google Meet · Free" },
//               { icon: <Icon.Globe />, text: "India Standard Time" },
//             ].map(({ icon, text }) => (
//               <div key={text} className="flex items-center gap-2.5 text-xs text-white/30">
//                 <span className="flex text-white/20">{icon}</span>
//                 {text}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex flex-1 flex-col overflow-hidden px-8 py-6.5">
//           {submitted ? (
//             <SuccessScreen form={form} selectedDate={selectedDate} selectedTime={selectedTime} />
//           ) : (
//             <>
//               <div className="mb-5 flex-shrink-0">
//                 <h1 className="mb-1 text-xl font-bold tracking-tight text-white">{PANEL_META[step].title}</h1>
//                 <p className="text-[13px] text-white/35">{PANEL_META[step].sub}</p>
//               </div>

//               <div className="scrollbar-thin flex-1 overflow-y-auto pr-1.5">
//                 {step === 0 && (
//                   <div className="animate-fade-up">
//                     <SectionLabel icon={<Icon.Cal />} title="Select a Date" badge="Sundays unavailable" />
//                     <div className="mt-3.5">
//                       <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} bookedDates={bookedDates} />
//                     </div>
//                     {selectedDate && (
//                       <div ref={timeSlotsRef}>
//                         <TimeSlots
//                           selectedTime={selectedTime}
//                           onSelect={setSelectedTime}
//                           bookedTimes={bookedTimes}
//                           loading={loadingSlots}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {step === 1 && <DetailsForm form={form} setForm={setForm} />}

//                 {step === 2 && <ConfirmCard selectedDate={selectedDate} selectedTime={selectedTime} form={form} />}

//                 {submitError && (
//                   <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-4 py-2.5 text-center text-xs text-red-400">
//                     {submitError}
//                   </div>
//                 )}
//               </div>

//               <div className="mt-1.5 flex flex-shrink-0 items-center justify-between border-t border-white/[0.06] pt-4">
//                 {step > 0 ? (
//                   <button className="bp-btn-ghost" onClick={() => setStep((s) => s - 1)}>
//                     <Icon.Back /> Back
//                   </button>
//                 ) : (
//                   <div />
//                 )}

//                 {step < 2 ? (
//                   <button className="bp-cta" onClick={() => setStep((s) => s + 1)} disabled={ctaDisabled}>
//                     Continue <Icon.Next />
//                   </button>
//                 ) : (
//                   <button className="bp-cta" onClick={handleSubmit} disabled={submitting}>
//                     {submitting ? (
//                       <>
//                         <Icon.Spin /> Booking…
//                       </>
//                     ) : (
//                       <>
//                         <Icon.Check /> Confirm Booking
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle2,
  Loader2,
  Calendar,
  Clock,
  Video,
  Globe,
} from "lucide-react";

import Step0DateAndTime from "./Step0dateandtime";
import Step1DetailsForm from "./Step1detailsform";
import Step2ConfirmCard from "./Step2confirmcard";

// ─── Constants ────────────────────────────────────────────────────────────────
const PANEL_META = [
  { title: "Pick a Date & Time",  sub: "Select an available slot below" },
  { title: "Your Details",        sub: "We'll use this to confirm your booking" },
  { title: "Review & Confirm",    sub: "Double-check everything before submitting" },
];

// ─── Sidebar Steps ────────────────────────────────────────────────────────────
const SidebarSteps = ({ step }) => {
  const steps = [
    { label: "Date & Time",  sub: "Pick an open slot" },
    { label: "Your Details", sub: "Contact information" },
    { label: "Confirm",      sub: "Review & submit" },
  ];

  return (
    <div className="flex flex-col gap-0.5">
      {steps.map((s, i) => {
        const active = i === step;
        const done   = i < step;
        return (
          <React.Fragment key={s.label}>
            <div
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                active ? "border-white/20 bg-white/[0.07]" : "border-transparent"
              } ${!active && !done ? "opacity-40" : "opacity-100"}`}
            >
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  active ? "bg-white text-black"
                  : done  ? "bg-white/15 text-white"
                  :         "bg-white/5 text-white/30"
                }`}
              >
                {done ? <Check size={13} strokeWidth={2.5} /> : i + 1}
              </div>
              <div>
                <div className={`text-[13px] font-semibold leading-tight ${active ? "text-white" : "text-white/45"}`}>
                  {s.label}
                </div>
                <div className={`mt-0.5 text-[11px] ${active ? "text-white/40" : "text-white/15"}`}>
                  {s.sub}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-[25px] h-3 w-px bg-white/[0.06]" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
const SuccessScreen = ({ form, selectedDate, selectedTime }) => (
  <div className="flex flex-1 animate-fade-up flex-col items-center justify-center gap-5 px-0 py-6 text-center">
    <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-white/20 bg-white/10">
      <CheckCircle2 size={32} className="text-white" strokeWidth={1.5} />
    </div>
    <div>
      <div className="mb-3 inline-block rounded-md border border-white/20 bg-white/10 px-3.5 py-1 text-[11px] uppercase tracking-widest text-white">
        Confirmed
      </div>
      <div className="mb-1.5 text-2xl font-bold text-white">You&rsquo;re Booked!</div>
      <div className="text-sm text-white/40">
        {selectedDate} &middot; {selectedTime}
      </div>
    </div>
    <div className="max-w-[310px] rounded-2xl border border-white/[0.08] bg-white/[0.03] px-7 py-4 text-[13px] leading-relaxed text-white/45">
      Confirmation sent to{" "}
      <span className="font-semibold text-white">{form.email}</span>.
      <br />
      <span className="text-[11px] text-white/20">Check spam if not visible in 5-6 mins.</span>
    </div>
  </div>
);

// ─── BookingPage ──────────────────────────────────────────────────────────────
const BookingPage = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const bookedDates  = useSelector(selectBookedDates);
  const bookedTimes  = useSelector(selectBookedTimes);
  const loadingSlots = useSelector(selectTimesLoading);
  const submitted    = useSelector(selectSubmitted);
  const submitting   = useSelector(selectSubmitLoading);
  const submitError  = useSelector(selectSubmitError);

  const [step, setStep]                 = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm]                 = useState({
    firstName: "", lastName: "", email: "", phone: "", socialLink: "", message: "",
  });

  useEffect(() => {
    dispatch(fetchBookedDates());
    return () => dispatch(resetBooking());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedDate) return;
    dispatch(fetchBookedTimes(selectedDate));
  }, [selectedDate, dispatch]);

  useEffect(() => {
    if (submitError) dispatch(clearBookingError());
  }, [form, selectedDate, selectedTime]); // eslint-disable-line

  const step0Valid = !!(selectedDate && selectedTime);
  const step1Valid = !!(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.includes("@") &&
    form.phone.trim().length >= 7
  );

  const isCtaDisabled =
    step === 0 ? !step0Valid
    : step === 1 ? !step1Valid
    : submitting;

  const handleSubmit = () => {
    dispatch(createBooking({ date: selectedDate, time: selectedTime, ...form }));
  };

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-black font-JetBrainsMono text-white">

      {/* Top Bar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
        >
          <ChevronLeft size={14} /> Back
        </button>

        {!submitted && (
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "w-5 bg-white"
                  : i < step  ? "w-1.5 bg-white/40"
                  :             "w-1.5 bg-white/10"
                }`}
              />
            ))}
            <span className="ml-1 text-[11px] text-white/30">Step {step + 1} of 3</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <div className="flex w-[252px] min-w-[252px] flex-col gap-5 overflow-y-auto border-r border-white/[0.06] px-4 py-6">
          <div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white">
              <Calendar size={18} />
            </div>
            <div className="text-base font-bold leading-tight text-white">Discovery Call</div>
            <div className="mt-1 text-xs text-white/30">Book a free session</div>
          </div>

          <div className="border-b border-white/[0.06]" />

          {!submitted && <SidebarSteps step={step} />}

          <div className="flex-1" />

          <div className="border-b border-white/[0.06]" />

          <div className="flex flex-col gap-2.5">
            {[
              { icon: <Clock size={14} />, text: "30 minutes" },
              { icon: <Video size={14} />, text: "Google Meet · Free" },
              { icon: <Globe size={14} />, text: "India Standard Time" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs text-white/30">
                <span className="flex text-white/20">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Main Panel */}
        <div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
          {submitted ? (
            <SuccessScreen
              form={form}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          ) : (
            <>
              <div className="mb-5 flex-shrink-0">
                <h1 className="mb-1 text-xl font-bold tracking-tight text-white">
                  {PANEL_META[step].title}
                </h1>
                <p className="text-[13px] text-white/35">{PANEL_META[step].sub}</p>
              </div>

              <div className="flex-1 overflow-y-auto pr-1.5">
                {step === 0 && (
                  <Step0DateAndTime
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    bookedDates={bookedDates}
                    bookedTimes={bookedTimes}
                    loadingSlots={loadingSlots}
                  />
                )}

                {step === 1 && (
                  <Step1DetailsForm form={form} setForm={setForm} />
                )}

                {step === 2 && (
                  <Step2ConfirmCard
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    form={form}
                  />
                )}

                {submitError && (
                  <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-2.5 text-center text-xs text-red-400">
                    {submitError}
                  </div>
                )}
              </div>

              {/* Footer Nav */}
              <div className="mt-1.5 flex flex-shrink-0 items-center justify-between border-t border-white/[0.06] pt-4">
                {step > 0 ? (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] text-white/50 transition-colors hover:bg-white/[0.08] hover:text-white"
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <button
                    onClick={() => !isCtaDisabled && setStep((s) => s + 1)}
                    disabled={isCtaDisabled}
                    className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                      isCtaDisabled
                        ? "cursor-not-allowed border border-white/[0.06] bg-white/[0.04] text-white/25"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    Continue <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                      submitting
                        ? "cursor-not-allowed border border-white/[0.06] bg-white/[0.04] text-white/25"
                        : "bg-white text-black hover:bg-white/90"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Booking...
                      </>
                    ) : (
                      <>
                        <Check size={14} /> Confirm Booking
                      </>
                    )}
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