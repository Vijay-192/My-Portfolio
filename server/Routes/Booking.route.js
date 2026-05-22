import express from "express";
import {
  getBookedDates,
  getBookedTimes,
  createBooking,
  getAllBookings,
} from "../Controllers/Booking.Controller.js";

const router = express.Router();

router.get("/booked-dates", getBookedDates);
router.get("/booked-times", getBookedTimes);
router.post("/create",      createBooking);
router.get("/all",          getAllBookings); 

export default router;