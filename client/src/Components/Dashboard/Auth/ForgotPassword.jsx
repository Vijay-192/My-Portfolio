import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Eye, EyeOff, CheckCircle2, Mail, ShieldCheck, KeyRound } from "lucide-react";
import {
  forgotPasswordThunk,
  verifyOtpThunk,
  resetPasswordThunk,
  clearError,
} from "../../../redux-store/authSlice";

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

/* ── Step indicator ── */
const Steps = ({ current }) => {
  const steps = [
    { icon: Mail,        label: "Email" },
    { icon: ShieldCheck, label: "OTP"   },
    { icon: KeyRound,    label: "Reset"  },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-7">
      {steps.map(({ icon: Icon, label }, i) => {
        const done   = i + 1 < current;
        const active = i + 1 === current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                style={{
                  background: done ? EDU.accent : active ? EDU.primary : EDU.light,
                  color: done || active ? "#fff" : EDU.accent,
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                style={{ color: done ? EDU.accent : active ? EDU.primary : "#9ca3af" }}
                className="text-xs mt-1 font-medium"
              >
                {label}
              </span>
            </div>
            {i < 2 && (
              <div
                style={{ background: done ? EDU.accent : "#e5e7eb" }}
                className="w-10 h-px mb-5 transition-all"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

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

  const clearErrors = () => { dispatch(clearError()); setLocalErr(""); };

  const startTimer = () => {
    setTimer(60);
    const id = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    clearErrors();
    const res = await dispatch(forgotPasswordThunk({ email: email.trim().toLowerCase() }));
    if (forgotPasswordThunk.fulfilled.match(res)) { startTimer(); setStep(2); }
  };

  const handleResend = async () => {
    clearErrors();
    const res = await dispatch(forgotPasswordThunk({ email: email.trim().toLowerCase() }));
    if (forgotPasswordThunk.fulfilled.match(res)) { startTimer(); setOtp(""); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearErrors();
    if (otp.length !== 6) return setLocalErr("Enter the 6-digit OTP.");
    const res = await dispatch(verifyOtpThunk({ email: email.trim().toLowerCase(), otp }));
    if (verifyOtpThunk.fulfilled.match(res)) setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    clearErrors();
    if (password !== confirmPwd) return setLocalErr("Passwords do not match.");
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/;
    if (!pwdRegex.test(password)) return setLocalErr("Min 8 chars · uppercase · lowercase · number · special char.");
    const res = await dispatch(resetPasswordThunk({ email: email.trim().toLowerCase(), otp, newPassword: password }));
    if (resetPasswordThunk.fulfilled.match(res)) setDone(true);
  };

  const displayError = localErr || error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">

        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">

          {/* Header */}
          <div style={{ background: EDU.primary }} className="px-8 py-6">
            <div className="flex items-center gap-3">
              <div style={{ background: "rgba(255,255,255,0.15)" }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <KeyRound className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg leading-tight">Reset Password</h1>
                <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-xs mt-0.5">
                  {step === 1 && "Enter your registered email"}
                  {step === 2 && "Enter the OTP sent to your email"}
                  {step === 3 && "Set your new password"}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-7">
            {done ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div style={{ background: EDU.light }} className="w-16 h-16 rounded-full flex items-center justify-center">
                  <CheckCircle2 style={{ color: EDU.primary }} className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Password Reset!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">You can now log in with your new password.</p>
                <button
                  onClick={() => navigate("/login")}
                  style={{ background: EDU.primary }}
                  className="mt-2 px-6 py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition active:scale-[0.99]"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <Steps current={step} />

                {displayError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
                    {typeof displayError === "string" ? displayError : displayError?.message || "Something went wrong."}
                  </div>
                )}

                {/* ── Step 1: Email ── */}
                {step === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Enter your registered email and we'll send a 6-digit OTP.
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                      <input
                        type="email" value={email}
                        onChange={(e) => { clearErrors(); setEmail(e.target.value); }}
                        placeholder="john@example.com" className={inputCls}
                        onFocus={focusRing} onBlur={blurRing}
                        autoComplete="email" required
                      />
                    </div>
                    <button type="submit" disabled={loading}
                      style={{ background: EDU.primary }}
                      className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : "Send OTP →"}
                    </button>
                  </form>
                )}

                {/* ── Step 2: OTP ── */}
                {step === 2 && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      OTP sent to{" "}
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{email}</span>
                    </p>

                    {/* OTP input styled like email box */}
                    <div
                      style={{ background: EDU.light, border: `1.5px dashed ${EDU.primary}` }}
                      className="rounded-xl p-4"
                    >
                      <input
                        type="text" inputMode="numeric" maxLength={6}
                        value={otp}
                        onChange={(e) => { clearErrors(); setOtp(e.target.value.replace(/\D/g, "")); }}
                        placeholder="● ● ● ● ● ●"
                        className="w-full bg-transparent text-center tracking-[0.6em] text-2xl font-bold focus:outline-none"
                        style={{ color: EDU.primary }}
                        autoComplete="one-time-code"
                        required
                      />
                      <p style={{ color: EDU.accent }} className="text-xs text-center mt-2">
                        ⏱ Valid for 10 minutes
                      </p>
                    </div>

                    <button type="submit" disabled={loading}
                      style={{ background: EDU.primary }}
                      className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : "Verify OTP →"}
                    </button>

                    <div className="flex gap-3">
                      <button type="button"
                        onClick={() => { clearErrors(); setStep(1); }}
                        style={{ borderColor: EDU.accent, color: EDU.primary }}
                        className="flex-1 py-2 rounded-lg border text-sm font-medium hover:opacity-80 transition">
                        ← Change email
                      </button>
                      <button type="button" onClick={handleResend}
                        disabled={resendTimer > 0 || loading}
                        style={{ borderColor: EDU.accent, color: EDU.primary }}
                        className="flex-1 py-2 rounded-lg border text-sm font-medium hover:opacity-80 transition disabled:opacity-40">
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Step 3: New Password ── */}
                {step === 3 && (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                      <div className="relative">
                        <input
                          type={showPass ? "text" : "password"} value={password}
                          onChange={(e) => { clearErrors(); setPassword(e.target.value); }}
                          placeholder="New password" className={`${inputCls} pr-10`}
                          onFocus={focusRing} onBlur={blurRing}
                          autoComplete="new-password" required
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password</label>
                      <input
                        type={showPass ? "text" : "password"} value={confirmPwd}
                        onChange={(e) => { clearErrors(); setConfirm(e.target.value); }}
                        placeholder="Confirm password" className={inputCls}
                        onFocus={focusRing} onBlur={blurRing}
                        autoComplete="new-password" required
                      />
                    </div>

                    <div style={{ background: EDU.light }} className="rounded-lg px-3 py-2.5">
                      <p style={{ color: EDU.primary }} className="text-xs">
                        Min 8 chars · uppercase · lowercase · number · special char (@$!%*?&_#)
                      </p>
                    </div>

                    <button type="submit" disabled={loading}
                      style={{ background: EDU.primary }}
                      className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.99]">
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting…</> : "Reset Password"}
                    </button>
                  </form>
                )}

                <p className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
                  Remember it?{" "}
                  <Link to="/login" style={{ color: EDU.primary }} className="font-semibold hover:underline">Login</Link>
                </p>
              </>
            )}
          </div>
        </div>

        <div style={{ background: EDU.light }} className="h-1 rounded-b-xl mx-6" />
      </div>
    </div>
  );
}

export default ForgotPassword;