import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { loginThunk, clearError } from "../../../redux-store/authSlice";

const EDU = {
  primary:      "#0C4733",
  primaryHover: "#083826",
  accent:       "#4E9C79",
  light:        "#EEF6F2",
};

const inputCls =
  "w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none transition";

const inputStyle = {
  "--tw-ring-color": EDU.accent,
};

function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const dispatch  = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const from       = location.state?.from?.pathname || "/dashboard";
  const successMsg = location.state?.message || "";

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(result)) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">

          {/* Header bar */}
          <div style={{ background: EDU.primary }} className="px-8 py-6">
            <div className="flex items-center gap-3">
              <div style={{ background: "rgba(255,255,255,0.15)" }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg leading-tight">Welcome Back</h1>
                <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-xs mt-0.5">Sign in to your account</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-7 space-y-5">

            {successMsg && (
              <div style={{ background: EDU.light, borderColor: EDU.accent }} className="p-3 rounded-lg border text-sm" >
                <span style={{ color: EDU.primary }} className="font-medium">{successMsg}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                {typeof error === "string" ? error : error?.message || "Something went wrong."}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="john@example.com" className={inputCls}
                  style={{ "--tw-ring-color": EDU.accent }}
                  onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${EDU.accent}40, 0 0 0 1px ${EDU.accent}`}
                  onBlur={e  => e.target.style.boxShadow = ""}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                  <Link to="/forgot-password" style={{ color: EDU.accent }} className="text-xs hover:underline font-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} name="password" value={form.password}
                    onChange={handleChange} placeholder="Enter your password"
                    className={`${inputCls} pr-10`}
                    onFocus={e => e.target.style.boxShadow = `0 0 0 2px ${EDU.accent}40, 0 0 0 1px ${EDU.accent}`}
                    onBlur={e  => e.target.style.boxShadow = ""}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                style={{ background: loading ? EDU.accent : EDU.primary }}
                className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                  : "Sign In"}
              </button>

            </form>

            {/* <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: EDU.primary }} className="font-semibold hover:underline">
                Register
              </Link>
            </p> */}

          </div>
        </div>

        {/* Bottom accent line */}
        <div style={{ background: EDU.light }} className="h-1 rounded-b-xl mx-6" />

      </div>
    </div>
  );
}

export default Login;