import React, { useEffect, useRef, useState } from "react";
const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const toDateKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const CalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
  >
    <rect x="2" y="3" width="12" height="11" rx="2" />
    <path d="M5 3V1M11 3V1M2 7h12" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M8 5v3l2.5 2" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 6l3 3 5-5" />
  </svg>
);

const SectionLabel = ({ icon, title, badge }) => (
  <div className="mb-1 flex items-center gap-2">
    <span className="flex text-white/35">{icon}</span>
    <span className="text-[13px] font-semibold text-white/80">{title}</span>
    {badge && (
      <span className="rounded-md border border-white/[0.08] bg-white/5 px-2 py-0.5 text-[10px] tracking-wide text-white/30">
        {badge}
      </span>
    )}
  </div>
);

const Calendar = ({ selectedDate, onSelect, bookedDates }) => {
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const isPrevDisabled =
    viewYear === today.getFullYear() && viewMonth === today.getMonth();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          className="bp-nav-btn"
          disabled={isPrevDisabled}
          onClick={prevMonth}
        >
          ‹
        </button>
        <span className="text-sm font-semibold tracking-wide text-white">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button className="bp-nav-btn" onClick={nextMonth}>
          ›
        </button>
      </div>

      {/* Day-name Headers */}
      <div className="mb-2 grid grid-cols-7">
        {DAYS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-[11px] font-semibold uppercase tracking-wider text-white/30"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date Cells */}
      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;

          const key = toDateKey(viewYear, viewMonth, day);
          const cell = new Date(viewYear, viewMonth, day);
          const isPast = cell < today;
          const isBooked = bookedDates?.includes(key);
          const isSunday = cell.getDay() === 0;
          const disabled = isPast || isBooked || isSunday;
          const isSelected = selectedDate === key;
          const isToday =
            day === today.getDate() &&
            viewMonth === today.getMonth() &&
            viewYear === today.getFullYear();

          return (
            <div
              key={key}
              onClick={() => !disabled && onSelect(key)}
              className={[
                "bp-cal-cell",
                disabled ? "bp-cal-disabled" : "",
                isSelected ? "bp-cal-selected" : "",
                isToday && !isSelected ? "bp-cal-today" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TimeSlots = ({ selectedTime, onSelect, bookedTimes, loading }) => (
  <div className="mt-6">
    <SectionLabel icon={<ClockIcon />} title="Select a Time" badge="IST" />

    {loading ? (
      <div className="mt-2.5 grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-[10px] bg-white/[0.04]"
          />
        ))}
      </div>
    ) : (
      <div className="mt-2.5 grid animate-fade-up grid-cols-4 gap-1.5">
        {TIME_SLOTS.map((slot) => {
          const isBooked = bookedTimes?.includes(slot);
          const isSelected = selectedTime === slot;

          return (
            <div
              key={slot}
              onClick={() => !isBooked && onSelect(slot)}
              className={[
                "bp-slot",
                isBooked ? "bp-slot-booked" : "",
                isSelected ? "bp-slot-selected" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isSelected ? (
                <span className="inline-flex items-center justify-center gap-1 text-white">
                  <CheckIcon />
                  {slot}
                </span>
              ) : (
                <>
                  {slot}
                  {isBooked && (
                    <div className="mt-0.5 text-[9px] tracking-wide text-white/[0.14]">
                      Booked
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const Step0DateAndTime = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  bookedDates = [],
  bookedTimes = [],
  loadingSlots = false,
}) => {
  const timeSlotsRef = useRef(null);
  useEffect(() => {
    if (!selectedDate) return;
    const id = setTimeout(
      () =>
        timeSlotsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      120,
    );
    return () => clearTimeout(id);
  }, [selectedDate, loadingSlots]);

  const handleDateSelect = (key) => {
    setSelectedDate(key);
    setSelectedTime(null);
  };

  return (
    <div className="animate-fade-up">
      {/* Date picker */}
      <SectionLabel
        icon={<CalIcon />}
        title="Select a Date"
        badge="Sundays unavailable"
      />

      <div className="mt-3.5">
        <Calendar
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          bookedDates={bookedDates}
        />
      </div>
      {selectedDate && (
        <div ref={timeSlotsRef}>
          <TimeSlots
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            bookedTimes={bookedTimes}
            loading={loadingSlots}
          />
        </div>
      )}
    </div>
  );
};

export default Step0DateAndTime;
