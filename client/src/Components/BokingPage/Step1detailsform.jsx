import React from "react";
import { User, Mail, Phone, Link, MessageSquare } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/20 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.06]";

const Field = ({ label, icon, required, hint, children, full }) => (
  <div className={`flex flex-col gap-1.5 ${full ? "col-span-2" : ""}`}>
    <label className="flex items-center gap-1.5">
      <span className="flex items-center text-white/30">{icon}</span>
      <span className="text-[13px] font-semibold text-white/55">{label}</span>
      {required && <span className="text-[13px] leading-none text-white/60">*</span>}
      {hint && <span className="text-[11px] font-normal text-white/20">{hint}</span>}
    </label>
    {children}
  </div>
);

const Step1DetailsForm = ({ form, setForm }) => {
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="grid animate-fade-up grid-cols-2 gap-3.5">
      <Field label="First Name" icon={<User size={14} />} required>
        <input
          className={inputCls}
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
      </Field>

      <Field label="Last Name" icon={<User size={14} />} required>
        <input
          className={inputCls}
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
      </Field>

      <Field label="Email Address" icon={<Mail size={14} />} required full>
        <input
          className={inputCls}
          name="email"
          type="email"
          placeholder="enter your email"
          value={form.email}
          onChange={handleChange}
        />
      </Field>

      <Field label="Phone Number" icon={<Phone size={14} />} required full>
        <input
          className={inputCls}
          name="phone"
          type="tel"
          placeholder="enter your phone number"
          value={form.phone}
          onChange={handleChange}
        />
      </Field>

      <Field label="Social / Website" icon={<Link size={14} />} hint="(optional)" full>
        <input
          className={inputCls}
          name="socialLink"
          placeholder="enter your social media link or website"
          value={form.socialLink}
          onChange={handleChange}
        />
      </Field>

      <Field label="What to discuss?" icon={<MessageSquare size={14} />} hint="(optional)" full>
        <textarea
          className={`${inputCls} h-20 resize-none`}
          name="message"
          placeholder="briefly describe your project or query…"
          value={form.message}
          onChange={handleChange}
        />
      </Field>

      <div className="col-span-2 text-[11px] text-white/20">
        <span className="text-white/50">*</span> Required fields
      </div>
    </div>
  );
};

export default Step1DetailsForm;