import {
  registerUser,
  loginUser,
  forgotPasswordService,
  verifyOtpService,      
  resetPasswordService,
  refreshTokenService,
  assignRoleService,
  listUsersService,
  logoutService,         
} from "../utils/AuthService.js";

const ok  = (res, data, status = 200) => res.status(status).json({ success: true,  ...data });
const err = (res, msg, status = 400) => res.status(status).json({ success: false, message: msg });

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    ok(res, result, 201);
  } catch (e) { err(res, e.message); }
};


export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message, 401); }
};


export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message); }
};


export const verifyOtp = async (req, res) => {
  try {
    const result = await verifyOtpService(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message); }
};


export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message); }
};

export const refreshToken = async (req, res) => {
  try {
    const result = await refreshTokenService(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message, 401); }
};


export const getUsers = async (req, res) => {
  try {
    const users = await listUsersService();
    ok(res, { users });
  } catch (e) { err(res, e.message); }
};


export const assignRole = async (req, res) => {
  try {
    const result = await assignRoleService(req.body);
    ok(res, result);
  } catch (e) { err(res, e.message); }
};


export const logout = async (req, res) => {
  try {
    const result = await logoutService();
    ok(res, result);
  } catch (e) { err(res, e.message); }
};