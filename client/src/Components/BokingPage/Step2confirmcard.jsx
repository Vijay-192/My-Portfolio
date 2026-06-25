import React from "react";
import { Calendar, Clock, User, Mail, Phone, Link } from "lucide-react";

const Step2ConfirmCard = ({ selectedDate, selectedTime, form }) => {
  const rows = [
    { icon: <Calendar size={14} />, label: "Date",  value: selectedDate,                       accent: true },
    { icon: <Clock size={14} />,    label: "Time",  value: selectedTime,                       accent: true },
    { icon: <User size={14} />,     label: "Name",  value: `${form.firstName} ${form.lastName}` },
    { icon: <Mail size={14} />,     label: "Email", value: form.email },
    { icon: <Phone size={14} />,    label: "Phone", value: form.phone },
    form.socialLink
      ? { icon: <Link size={14} />, label: "Social", value: form.socialLink }
      : null,
  ].filter(Boolean);

  return (
    <div className="flex animate-fade-up flex-col gap-2.5">
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        {rows.map(({ icon, label, value, accent }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-4 py-3 ${
              i < rows.length - 1 ? "border-b border-white/[0.05]" : ""
            }`}
          >
            <span className="flex flex-shrink-0 text-white/25">{icon}</span>
            <span className="w-14 flex-shrink-0 text-xs text-white/30">{label}</span>
            <span
              className={`flex-1 break-all text-[13px] ${
                accent ? "font-semibold text-white" : "font-normal text-white/80"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {form.message && (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/25">
            Note
          </div>
          <div className="text-[13px] leading-relaxed text-white/60">{form.message}</div>
        </div>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="mt-0.5 flex text-white/30">
          <Mail size={14} />
        </span>
        <p className="text-xs leading-relaxed text-white/40">
          A confirmation email will be sent to{" "}
          <span className="font-semibold text-white">{form.email}</span> within 5–6 minutes.
        </p>
      </div>
    </div>
  );
};

export default Step2ConfirmCard;