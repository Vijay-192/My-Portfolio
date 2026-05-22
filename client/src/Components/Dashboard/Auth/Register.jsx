import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { registerThunk, clearError } from "../../../redux-store/authSlice";

const EDU = {
  primary:      "#0C4733",
  primaryHover: "#083826",
  accent:       "#4E9C79",
  light:        "#EEF6F2",
};

const inputCls =
  "w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition";

const focusRing = (e) => e.target.style.boxShadow = `0 0 0 2px ${EDU.accent}40, 0 0 0 1px ${EDU.accent}`;
const blurRing  = (e) => e.target.style.boxShadow = "";


function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [form, setForm]         = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [localErr, setLocalErr] = useState("");

  const handleChange = (e) => {
    dispatch(clearError());
    setLocalErr("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");
    if (form.password !== form.confirmPassword) return setLocalErr("Passwords do not match.");

    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/;
    if (!pwdRegex.test(form.password))
      return setLocalErr("Password: 8+ chars, uppercase, lowercase, number, special char.");

    const result = await dispatch(registerThunk({
      firstName: form.firstName.trim(),
      lastName:  form.lastName.trim(),
      email:     form.email.trim().toLowerCase(),
      password:  form.password,
    }));

    if (registerThunk.fulfilled.match(result)) setSuccess(true);
  };

  const displayError = localErr || error;
  return (
   <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">

          {/* Header */}
          <div style={{ background: EDU.primary }} className="px-8 py-6">
            <div className="flex items-center gap-3">
              <div style={{ background: "rgba(255,255,255,0.15)" }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg leading-tight">Create Account</h1>
                <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-xs mt-0.5">Join us today</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div style={{ background: EDU.light }} className="w-16 h-16 rounded-full flex items-center justify-center">
                  <CheckCircle2 style={{ color: EDU.primary }} className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Account Created!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">You can now log in with your credentials.</p>
                <button
                  onClick={() => navigate("/login")}
                  style={{ background: EDU.primary }}
                  className="mt-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition active:scale-[0.99]"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {displayError && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    {typeof displayError === "string" ? displayError : displayError?.message || "Something went wrong."}
                  </div>
                )}

                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">First Name</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange}
                      placeholder="John" className={inputCls}
                      onFocus={focusRing} onBlur={blurRing} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Last Name</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange}
                      placeholder="Doe" className={inputCls}
                      onFocus={focusRing} onBlur={blurRing} required />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="john@example.com" className={inputCls}
                    onFocus={focusRing} onBlur={blurRing} required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? "text" : "password"} name="password" value={form.password}
                      onChange={handleChange} placeholder="Min 8 chars"
                      className={`${inputCls} pr-10`}
                      onFocus={focusRing} onBlur={blurRing} required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                  <input type={showPass ? "text" : "password"} name="confirmPassword" value={form.confirmPassword}
                    onChange={handleChange} placeholder="Re-enter password" className={inputCls}
                    onFocus={focusRing} onBlur={blurRing} required />
                </div>

                {/* Password hint */}
                <div style={{ background: EDU.light }} className="rounded-lg px-3 py-2.5">
                  <p style={{ color: EDU.primary }} className="text-xs font-medium mb-1">Password requirements</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                    {["8+ characters", "Uppercase letter", "Lowercase letter", "Number", "Special char (@$!%*?&_#)"].map((req) => (
                      <p key={req} style={{ color: EDU.accent }} className="text-xs flex items-center gap-1">
                        <span>·</span> {req}
                      </p>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  style={{ background: EDU.primary }}
                  className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                    : "Create Account"}
                </button>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: EDU.primary }} className="font-semibold hover:underline">Login</Link>
                </p>

              </form>
            )}
          </div>
        </div>

        <div style={{ background: EDU.light }} className="h-1 rounded-b-xl mx-6" />
      </div>
    </div>
  )
}

export default Register
