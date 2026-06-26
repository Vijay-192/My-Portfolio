import React, { useEffect, useRef, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const FIELDS = [
  { id: "name",    label: "Name",    type: "text",  required: true  },
  { id: "email",   label: "Email",   type: "email", required: true  },
  { id: "subject", label: "Subject", type: "text",  required: false },
];

function Contact() {


  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [focused, setFocused] = useState(null);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };


  return (
    <div className="min-h-screen w-full bg-black text-white font-JetBrainsMono overflow-x-hidden">

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" />

      <header className="fixed top-0 left-0 right-0 z-50 px-8 md:px-12 py-5 flex items-center justify-between border-b border-white/5 bg-black/80 backdrop-blur-sm">
        <Link to="/" className="uppercase font-semibold tracking-tight text-xs leading-tight hover:text-gray-300 transition-colors">
          Vijay<br />Saini
        </Link>
        <span className="text-gray-500 text-[10px] tracking-widest uppercase">Contact</span>
        <Link to="/" className="group flex items-center gap-1 text-[10px] text-gray-400 hover:text-white transition-colors">
          Back to home
          <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
        </Link>
      </header>
      <div className="pt-[61px] grid grid-cols-1 lg:grid-cols-2 min-h-screen">

   
            {/* LEFT side */}
        <div className="lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] flex flex-col justify-between px-8 md:px-12 py-16 border-b lg:border-b-0 lg:border-r border-white/10">

          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 tracking-widest uppercase mb-8">
              6.0 &nbsp; Get in Touch
            </span>

            <h1 className="text-[clamp(3rem,5.5vw,5.5rem)] font-semibold leading-[0.92] tracking-tight uppercase">
              Let&apos;s
              <br />
              <span className="text-gray-500">Work</span>
              <br />
              Together
            </h1>

            <p className="mt-7 text-gray-500 text-xs leading-5 max-w-[380px]">
              Whether it&apos;s a new project, a collaboration, or just a hello —
              drop a message and let&apos;s get the conversation started.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-12 lg:mt-0">
            <div>
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">Direct</div>
              <a
                href="mailto:vijay@example.com"
                className="group flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <span className="underline underline-offset-4">vijay@example.com</span>
                <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
              </a>
            </div>

            <div className="border-t border-white/10" />
            <div>
              <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">Availability</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-gray-400">Open to freelance &amp; full-time roles</span>
              </div>
            </div>
          </div>
        </div>


            {/* RIGHT side */}
       
        <div className="px-8 md:px-12 py-16">
          <div className="text-[10px] text-gray-500 tracking-widest uppercase mb-10">
            Send a Message
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-0">

              {/* text fields */}
              {FIELDS.map((f) => (
                <div key={f.id} className="relative border-t border-white/10">
                  <label
                    htmlFor={f.id}
                    className={`absolute left-0 text-[10px] tracking-widest uppercase transition-all duration-300 pointer-events-none ${
                      focused === f.id || form[f.id]
                        ? "top-3 text-gray-500 text-[9px]"
                        : "top-1/2 -translate-y-1/2 text-gray-600"
                    }`}
                  >
                    {f.label}
                    {f.required && <span className="text-white ml-0.5">*</span>}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required={f.required}
                    value={form[f.id]}
                    onChange={handleChange}
                    onFocus={() => setFocused(f.id)}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-transparent pt-7 pb-3 text-white text-sm outline-none border-none"
                    autoComplete="off"
                  />
                  <div
                    className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${
                      focused === f.id ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              ))}


              <div className="relative border-t border-white/10">
                <label
                  htmlFor="message"
                  className={`absolute left-0 text-[10px] tracking-widest uppercase transition-all duration-300 pointer-events-none ${
                    focused === "message" || form.message
                      ? "top-3 text-gray-500 text-[9px]"
                      : "top-5 text-gray-600"
                  }`}
                >
                  Message<span className="text-white ml-0.5">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  className="w-full bg-transparent pt-7 pb-3 text-white text-sm outline-none border-none resize-none"
                />
                <div
                  className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${
                    focused === "message" ? "w-full" : "w-0"
                  }`}
                />
              </div>

   
              <div className="border-t border-white/10" />


              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-8">
                <p className="text-[9px] text-gray-500 leading-5 max-w-[240px]">
                  By submitting you agree to my{" "}
                  <a href="#" className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors">
                    privacy policy
                  </a>
                </p>
                <button
                  type="submit"
                  className="group relative overflow-hidden border border-white/30 px-8 py-3 text-xs tracking-widest uppercase text-white transition-all duration-300 hover:border-white"
                >
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="cursor-pointer relative z-10 group-hover:text-black transition-colors duration-300">
                    Send
                  </span>
                </button>
              </div>
            </form>

          ) : (

            <div className="flex flex-col gap-4 pt-4">
              <div className="text-[clamp(2rem,6vw,4rem)] font-semibold leading-none tracking-tight uppercase">
                Done<span className="text-gray-500">.</span>
              </div>
              <p className="text-gray-400 text-xs leading-6">
                Message received — I&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="self-start text-[10px] text-gray-500 underline underline-offset-2 hover:text-white transition-colors mt-2"
              >
                Send another
              </button>
            </div>
          )}
        </div>
      </div>


      <footer className="border-t border-white/10 px-8 md:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-gray-500">
        <span>© 2026 Vijay Saini. All rights reserved.</span>
       
      </footer>
    </div>
  );
}

export default Contact;