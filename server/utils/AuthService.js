import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/Auth.model.js";
import { sendOTPEmail } from "./EmailService.js";
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const signTokens = (userId, role) => {
  const secret  = process.env.JWT_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;

  if (!secret || !refresh) {
    throw new Error("JWT_SECRET or JWT_REFRESH_SECRET is not set in .env");
  }

  const accessToken  = jwt.sign({ id: userId, role }, secret,  { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId, role }, refresh, { expiresIn: "3d" });
  return { accessToken, refreshToken };
};

export const registerUser = async ({ firstName, lastName, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already registered.");

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ firstName, lastName, email, password: hash });
  return { message: "Account created. You can now log in.", userId: user._id };
};


export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid email or password.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid email or password.");

  const { accessToken, refreshToken } = signTokens(user._id, user.role);

  return {
    accessToken,
    refreshToken,
    user: {
      id:        user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      role:      user.role,
    },
  };
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) return { message: "If that email exists, an OTP has been sent." };

  const otp = generateOTP();
  user.resetOtp       = otp;
  user.resetOtpExpire = Date.now() + 10 * 60 * 1000; 
  await user.save();

  await sendOTPEmail(email, otp, "Password Reset OTP");
  return { message: "OTP sent to your email." };
};


export const verifyOtpService = async ({ email, otp }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid or expired OTP.");

  if (user.resetOtp !== otp) throw new Error("Invalid OTP. Please check and try again.");
  if (user.resetOtpExpire < Date.now()) throw new Error("OTP has expired. Please request a new one.");

  return { message: "OTP verified." };
};


export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid or expired OTP.");

  if (user.resetOtp !== otp) throw new Error("Invalid OTP. Please check and try again.");
  if (user.resetOtpExpire < Date.now()) throw new Error("OTP has expired. Please request a new one.");

  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/;
  if (!pwdRegex.test(newPassword)) {
    throw new Error("Password must be at least 8 chars with uppercase, lowercase, number, and special character.");
  }

  user.password       = await bcrypt.hash(newPassword, 12);
  user.resetOtp       = null;
  user.resetOtpExpire = null;
  await user.save();

  return { message: "Password reset successful. You can now log in." };
};

export const refreshTokenService = async ({ refreshToken }) => {
  if (!refreshToken) throw new Error("No refresh token provided.");

  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set in .env");

  const payload = jwt.verify(refreshToken, secret);
  return signTokens(payload.id, payload.role);
};


export const assignRoleService = async ({ targetUserId, role }) => {
  const allowed = ["admin", "blogger", "writer"];
  if (!allowed.includes(role)) throw new Error("Invalid role.");

  const user = await User.findByIdAndUpdate(
    targetUserId,
    { role },
    { new: true, select: "-password" }
  );
  if (!user) throw new Error("User not found.");
  return { message: `Role updated to ${role}.`, user };
};

export const listUsersService = async () => {
  return User.find({}).select("-password").sort({ createdAt: -1 });
};

export const logoutService = async () => {
  return { message: "Logout successful." };
};