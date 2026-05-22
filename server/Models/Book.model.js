import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    date: String,
    time: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    socialLink: String,
    message: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

BookingSchema.index({ date: 1, time: 1 }, { unique: true });

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;