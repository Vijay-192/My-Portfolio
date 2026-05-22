import Booking from "../Models/Book.model.js";
import { sendBookingEmails } from "../utils/BookingEmail.js";

const getBookedDates = async (req, res) => {
    try {
        const bookings = await Booking.find({}, "date").lean();
        const dates = [...new Set(bookings.map((b) => b.date))];
        res.json({ dates });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getBookedTimes = async (req, res) => {
    const { date } = req.query;
    if (!date)
        return res.status(400).json({ message: "date query param is required" });

    try {
        const bookings = await Booking.find({ date }, "time").lean();
        const times = bookings.map((b) => b.time);
        res.json({ times });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const createBooking = async (req, res) => {
    const {
        date, time,
        firstName, lastName, email, phone,
        socialLink, message,
    } = req.body;

    if (!date || !time || !firstName || !lastName || !email || !phone) {
        return res.status(400).json({ message: "All required fields must be filled." });
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
        return res.status(400).json({ message: "Invalid email address." });
    }
    const bookingDate = new Date(date);
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);
    if (bookingDate < todayMidnight) {
        return res.status(400).json({ message: "Cannot book a past date." });
    }

    try {
        const existing = await Booking.findOne({ date, time });
        if (existing) {
            return res.status(409).json({
                message: "This slot is already booked. Please choose another time.",
            });
        }

        const booking = await Booking.create({
            date, time,
            firstName, lastName, email, phone,
            socialLink: socialLink || "",
            message: message || "",
        });
        sendBookingEmails(booking).catch((err) =>
            console.error("Email send error:", err.message)
        );

        res.status(201).json({
            message: "Booking confirmed! Check your email.",
            booking: {
                id: booking._id,
                date: booking.date,
                time: booking.time,
                name: `${booking.firstName} ${booking.lastName}`,
                email: booking.email,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ message: "Slot just got booked. Please pick another time." });
        }
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ date: 1, time: 1 }).lean();
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export { getBookedDates, getBookedTimes, createBooking, getAllBookings };