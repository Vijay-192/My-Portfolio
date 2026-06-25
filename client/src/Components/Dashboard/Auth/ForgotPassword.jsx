import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff, CheckCircle2, Mail, ShieldCheck, KeyRound } from "lucide-react";
import {
  forgotPasswordThunk, verifyOtpThunk, resetPasswordThunk, clearError,
} from "../../../redux-store/authSlice";

const inp =
  "w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition";

const btnPrimary =
  "w-full py-3 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2";

const btnOutline =
  "flex-1 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 text-sm font-medium hover:border-zinc-600 hover:text-white transition";

/* ── Step bar ── */
function StepBar({ current }) {
  const steps = [
    { icon: Mail,        label: "Email" },
    { icon: ShieldCheck, label: "OTP"   },
    { icon: KeyRound,    label: "Reset"  },
  ];
  return (
    <div className="flex items-center justify-between mb-7 px-2">
      {steps.map(({ icon: Icon, label }, i) => {
        const done   = i + 1 < current;
        const active = i + 1 === current;
        return (
          <div key={i} className="flex items-center gap-0 flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border
                ${done   ? "bg-white border-white text-black"
                : active ? "bg-white border-white text-black"
                :          "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] mt-1.5 font-medium tracking-wide uppercase
                ${done || active ? "text-white" : "text-zinc-600"}`}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-px mx-2 mb-5 transition-all ${done ? "bg-white" : "bg-zinc-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ForgotPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.auth);

  const [step, setStep]         = useState(1);
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirm]= useState("");
  const [showPass, setShowPass] = useState(false);
  const [localErr, setLocalErr] = useState("");
  const [resendTimer, setTimer] = useState(0);
  const [done, setDone]         = useState(false);

  const clearErrs = () => { dispatch(clearError()); setLocalErr(""); };

  const startTimer = () => {
    setTimer(60);
    const id = setInterval(() => setTimer((t) => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; }), 1000);
  };

  const handleSend = async (e) => {
    e.preventDefault(); clearErrs();
    const r = await dispatch(forgotPasswordThunk({ email: email.trim().toLowerCase() }));
    if (forgotPasswordThunk.fulfilled.match(r)) { startTimer(); setStep(2); }
  };

  const handleResend = async () => {
    clearErrs();
    const r = await dispatch(forgotPasswordThunk({ email: email.trim().toLowerCase() }));
    if (forgotPasswordThunk.fulfilled.match(r)) { startTimer(); setOtp(""); }
  };

  const handleVerify = async (e) => {
    e.preventDefault(); clearErrs();
    if (otp.length !== 6) return setLocalErr("Enter the 6-digit OTP.");
    const r = await dispatch(verifyOtpThunk({ email: email.trim().toLowerCase(), otp }));
    if (verifyOtpThunk.fulfilled.match(r)) setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault(); clearErrs();
    if (password !== confirmPwd) return setLocalErr("Passwords do not match.");
    const rx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/;
    if (!rx.test(password)) return setLocalErr("Min 8 chars · uppercase · lowercase · number · special char.");
    const r = await dispatch(resetPasswordThunk({ email: email.trim().toLowerCase(), otp, newPassword: password }));
    if (resetPasswordThunk.fulfilled.match(r)) setDone(true);
  };

  const displayError = localErr || error;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-3">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-white items-center justify-center mb-4">
            <KeyRound className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Reset password</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {step === 1 && "Enter your registered email"}
            {step === 2 && "Check your inbox for the OTP"}
            {step === 3 && "Choose a new password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6">
          {done ? (
            /* ── Success ── */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 className="text-white text-lg font-semibold">Password updated!</h2>
                <p className="text-zinc-500 text-sm mt-1">You can now sign in with your new password.</p>
              </div>
              <button onClick={() => navigate("/login")} className={`${btnPrimary} mt-2`}>
                Go to sign in
              </button>
            </div>
          ) : (
            <>
              <StepBar current={step} />

              {displayError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-900 text-sm text-red-400 mb-4">
                  <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                    <path d="M12 8v4m0 4h.01" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {typeof displayError === "string" ? displayError : displayError?.message || "Something went wrong."}
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <form onSubmit={handleSend} className="space-y-4">
                  <p className="text-sm text-zinc-500 mb-1">We'll send a 6-digit code to verify it's you.</p>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Email</label>
                    <input type="email" value={email}
                      onChange={(e) => { clearErrs(); setEmail(e.target.value); }}
                      placeholder="you@example.com" className={inp}
                      autoComplete="email" required />
                  </div>
                  <button type="submit" disabled={loading} className={btnPrimary}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : "Send code"}
                  </button>
                </form>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <form onSubmit={handleVerify} className="space-y-4">
                  <p className="text-sm text-zinc-500 text-center">
                    Code sent to <span className="text-white font-medium">{email}</span>
                  </p>

                  {/* OTP big input */}
                  <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-5 text-center">
                    <input
                      type="text" inputMode="numeric" maxLength={6}
                      value={otp}
                      onChange={(e) => { clearErrs(); setOtp(e.target.value.replace(/\D/g, "")); }}
                      placeholder="000000"
                      className="w-full bg-transparent text-center tracking-[0.5em] text-3xl font-bold text-white focus:outline-none placeholder-zinc-800"
                      autoComplete="one-time-code" required
                    />
                    <p className="text-xs text-zinc-600 mt-2">Valid for 10 minutes</p>
                  </div>

                  <button type="submit" disabled={loading} className={btnPrimary}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</> : "Verify code"}
                  </button>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => { clearErrs(); setStep(1); }} className={btnOutline}>
                      ← Change email
                    </button>
                    <button type="button" onClick={handleResend}
                      disabled={resendTimer > 0 || loading} className={btnOutline}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <form onSubmit={handleReset} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">New password</label>
                    <div className="relative">
                      <input type={showPass ? "text" : "password"} value={password}
                        onChange={(e) => { clearErrs(); setPassword(e.target.value); }}
                        placeholder="••••••••" className={`${inp} pr-11`}
                        autoComplete="new-password" required />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition p-1">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 uppercase tracking-widest">Confirm password</label>
                    <input type={showPass ? "text" : "password"} value={confirmPwd}
                      onChange={(e) => { clearErrs(); setConfirm(e.target.value); }}
                      placeholder="••••••••" className={inp}
                      autoComplete="new-password" required />
                  </div>

                  <div className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3">
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Min 8 chars · uppercase · lowercase · number · special char
                    </p>
                  </div>

                  <button type="submit" disabled={loading} className={btnPrimary}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Resetting…</> : "Set new password"}
                  </button>
                </form>
              )}

              <div className="border-t border-zinc-800/60 mt-5 pt-4 text-center">
                <p className="text-sm text-zinc-600">
                  Remember it?{" "}
                  <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
                </p>
              </div>
            </>
          )}
        </div>

        <div className="h-px bg-zinc-900 mx-4" />
      </div>
    </div>
  );
}

export default ForgotPassword;