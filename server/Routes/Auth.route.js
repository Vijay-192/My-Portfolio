
import { Router } from "express";
import {
  register,
  login,
  forgotPassword,
  verifyOtp,        
  resetPassword,
  refreshToken,
  getUsers,
  assignRole,
  logout,
} from "../Controllers/Auth.Controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",        register);
router.post("/login",           login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp",      verifyOtp);       
router.post("/reset-password",  resetPassword);
router.post("/refresh",         refreshToken);

router.post("/logout", logout);
router.get ("/admin/users",        authenticate, requireRole("admin"), getUsers);
router.patch("/admin/assign-role", authenticate, requireRole("admin"), assignRole);

export default router;