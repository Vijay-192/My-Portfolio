// src/store/slices/bookingSlice.js
// ─────────────────────────────────────────────────────────────────────────────
// Booking slice — same pattern as projectSlice
// Uses axiosInstance from ../Utils/apiClient
// ─────────────────────────────────────────────────────────────────────────────

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

// ── Async Thunks ──────────────────────────────────────────────────────────────

/** Fetch all dates that have at least one booking (for calendar) */
export const fetchBookedDates = createAsyncThunk(
  "booking/fetchBookedDates",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/bookings/booked-dates");
      return data.dates || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch dates");
    }
  }
);

/** Fetch booked time slots for a specific date */
export const fetchBookedTimes = createAsyncThunk(
  "booking/fetchBookedTimes",
  async (date, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/bookings/booked-times?date=${date}`);
      return data.times || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch times");
    }
  }
);

/** Create a new booking */
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/bookings/create", bookingData);
      return data.booking;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Booking failed");
    }
  }
);

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  // Calendar
  bookedDates:  [],
  datesLoading: false,
  datesError:   null,

  // Time slots
  bookedTimes:  [],
  timesLoading: false,
  timesError:   null,

  // Booking submission
  submitted:      false,
  submitLoading:  false,
  submitError:    null,
  lastBooking:    null,   // { id, date, time, name, email }
};

// ── Slice ─────────────────────────────────────────────────────────────────────

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    /** Call this when user navigates away / starts a new booking */
    resetBooking(state) {
      state.submitted     = false;
      state.submitLoading = false;
      state.submitError   = null;
      state.lastBooking   = null;
      state.bookedTimes   = [];
    },
    clearBookingError(state) {
      state.submitError = null;
      state.datesError  = null;
      state.timesError  = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchBookedDates ──────────────────────────────────────────────────────
    builder
      .addCase(fetchBookedDates.pending, (state) => {
        state.datesLoading = true;
        state.datesError   = null;
      })
      .addCase(fetchBookedDates.fulfilled, (state, action) => {
        state.datesLoading = false;
        state.bookedDates  = action.payload;
      })
      .addCase(fetchBookedDates.rejected, (state, action) => {
        state.datesLoading = false;
        state.datesError   = action.payload;
      });

    // ── fetchBookedTimes ──────────────────────────────────────────────────────
    builder
      .addCase(fetchBookedTimes.pending, (state) => {
        state.timesLoading = true;
        state.timesError   = null;
        state.bookedTimes  = [];   // clear previous date's times
      })
      .addCase(fetchBookedTimes.fulfilled, (state, action) => {
        state.timesLoading = false;
        state.bookedTimes  = action.payload;
      })
      .addCase(fetchBookedTimes.rejected, (state, action) => {
        state.timesLoading = false;
        state.timesError   = action.payload;
      });

    // ── createBooking ─────────────────────────────────────────────────────────
    builder
      .addCase(createBooking.pending, (state) => {
        state.submitLoading = true;
        state.submitError   = null;
        state.submitted     = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.submitted     = true;
        state.lastBooking   = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.submitLoading = false;
        state.submitError   = action.payload;
      });
  },
});

export const { resetBooking, clearBookingError } = bookingSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectBookedDates   = (s) => s.booking?.bookedDates   ?? [];
export const selectDatesLoading  = (s) => s.booking?.datesLoading  ?? false;
export const selectBookedTimes   = (s) => s.booking?.bookedTimes   ?? [];
export const selectTimesLoading  = (s) => s.booking?.timesLoading  ?? false;
export const selectSubmitted     = (s) => s.booking?.submitted     ?? false;
export const selectSubmitLoading = (s) => s.booking?.submitLoading ?? false;
export const selectSubmitError   = (s) => s.booking?.submitError   ?? null;
export const selectLastBooking   = (s) => s.booking?.lastBooking   ?? null;

export default bookingSlice.reducer;