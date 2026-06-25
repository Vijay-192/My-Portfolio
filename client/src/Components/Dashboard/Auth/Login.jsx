import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { loginThunk, clearError } from "../../../redux-store/authSlice";

const inp =
  "w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const from       = location.state?.from?.pathname || "/dashboard";
  const successMsg = location.state?.message || "";

  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const onChange = (e) => { dispatch(clearError()); setForm((p) => ({ ...p, [e.target.name]: e.target.value })); };

  const onSubmit = async (e) => {
    e.preventDefault();
    const r = await dispatch(loginThunk(form));
    if (loginThunk.fulfilled.match(r)) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-3">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-white items-center justify-center mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-sm text-zinc-300">
              <svg className="w-4 h-4 mt-0.5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
              </svg>
              {successMsg}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-900 text-sm text-red-400">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {typeof error === "string" ? error : error?.message || "Something went wrong."}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Email</label>
              <input type="email" name="email" value={form.email} onChange={onChange}
                placeholder="you@example.com" className={inp} required />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" value={form.password}
                  onChange={onChange} placeholder="••••••••"
                  className={`${inp} pr-11`} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-white text-black text-sm font-semibold
                hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</> : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer divider */}
        <div className="h-px bg-zinc-900 mx-4" />
      </div>
    </div>
  );
}

export default Login;