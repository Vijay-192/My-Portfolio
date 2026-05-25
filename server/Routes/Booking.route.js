import express from "express";
import {
  getBookedDates,
  getBookedTimes,
  createBooking,
  getAllBookings,
  deleteBooking,
  deleteManyBookings,
} from "../Controllers/Booking.Controller.js";

const router = express.Router();

router.get("/booked-dates",   getBookedDates);
router.get("/booked-times",   getBookedTimes);
router.post("/create",        createBooking);
router.get("/all",            getAllBookings);
router.delete("/:id",         deleteBooking);        
router.delete("/",            deleteManyBookings);   

export default router;