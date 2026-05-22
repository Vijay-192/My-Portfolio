import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ["admin", "blogger", "writer"], default: "writer" },
    isVerified:{ type: Boolean, default: false },
    resetOtp:       { type: String, default: null },
    resetOtpExpire: { type: Date,   default: null },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;