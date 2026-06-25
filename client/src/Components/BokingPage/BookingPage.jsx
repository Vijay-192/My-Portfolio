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