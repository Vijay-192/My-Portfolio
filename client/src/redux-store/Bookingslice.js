import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

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
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/bookings/all");
      return data.bookings || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch bookings");
    }
  }
);
export const deleteBooking = createAsyncThunk(
  "booking/deleteOne",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/bookings/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Delete failed");
    }
  }
);
export const deleteManyBookings = createAsyncThunk(
  "booking/deleteMany",
  async (ids, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/bookings/", { data: { ids } });
      return ids;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Bulk delete failed");
    }
  }
);

const initialState = {
  bookedDates:   [],
  datesLoading:  false,
  datesError:    null,
  bookedTimes:   [],
  timesLoading:  false,
  timesError:    null,
  submitted:     false,
  submitLoading: false,
  submitError:   null,
  lastBooking:   null,
  // admin list
  allBookings:   [],
  listLoading:   false,
  listError:     null,
  deleteLoading: false,
  deleteError:   null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
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
      state.deleteError = null;
      state.listError   = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookedDates.pending,  (s) => { s.datesLoading = true; s.datesError = null; })
      .addCase(fetchBookedDates.fulfilled,(s, a) => { s.datesLoading = false; s.bookedDates = a.payload; })
      .addCase(fetchBookedDates.rejected, (s, a) => { s.datesLoading = false; s.datesError = a.payload; })
      .addCase(fetchBookedTimes.pending,  (s) => { s.timesLoading = true; s.timesError = null; s.bookedTimes = []; })
      .addCase(fetchBookedTimes.fulfilled,(s, a) => { s.timesLoading = false; s.bookedTimes = a.payload; })
      .addCase(fetchBookedTimes.rejected, (s, a) => { s.timesLoading = false; s.timesError = a.payload; })
      .addCase(createBooking.pending,     (s) => { s.submitLoading = true; s.submitError = null; s.submitted = false; })
      .addCase(createBooking.fulfilled,   (s, a) => { s.submitLoading = false; s.submitted = true; s.lastBooking = a.payload; })
      .addCase(createBooking.rejected,    (s, a) => { s.submitLoading = false; s.submitError = a.payload; })
      .addCase(fetchAllBookings.pending,  (s) => { s.listLoading = true; s.listError = null; })
      .addCase(fetchAllBookings.fulfilled,(s, a) => { s.listLoading = false; s.allBookings = a.payload; })
      .addCase(fetchAllBookings.rejected, (s, a) => { s.listLoading = false; s.listError = a.payload; })
      .addCase(deleteBooking.pending,     (s) => { s.deleteLoading = true; s.deleteError = null; })
      .addCase(deleteBooking.fulfilled,   (s, a) => {
        s.deleteLoading = false;
        s.allBookings   = s.allBookings.filter((b) => b._id !== a.payload);
      })
      .addCase(deleteBooking.rejected,    (s, a) => { s.deleteLoading = false; s.deleteError = a.payload; })
      .addCase(deleteManyBookings.pending,  (s) => { s.deleteLoading = true; s.deleteError = null; })
      .addCase(deleteManyBookings.fulfilled,(s, a) => {
        s.deleteLoading = false;
        const removed   = new Set(a.payload);
        s.allBookings   = s.allBookings.filter((b) => !removed.has(b._id));
      })
      .addCase(deleteManyBookings.rejected, (s, a) => { s.deleteLoading = false; s.deleteError = a.payload; });
  },
});

export const { resetBooking, clearBookingError } = bookingSlice.actions;

export const selectBookedDates   = (s) => s.booking?.bookedDates   ?? [];
export const selectDatesLoading  = (s) => s.booking?.datesLoading  ?? false;
export const selectBookedTimes   = (s) => s.booking?.bookedTimes   ?? [];
export const selectTimesLoading  = (s) => s.booking?.timesLoading  ?? false;
export const selectSubmitted     = (s) => s.booking?.submitted     ?? false;
export const selectSubmitLoading = (s) => s.booking?.submitLoading ?? false;
export const selectSubmitError   = (s) => s.booking?.submitError   ?? null;
export const selectLastBooking   = (s) => s.booking?.lastBooking   ?? null;
export const selectAllBookings   = (s) => s.booking?.allBookings   ?? [];
export const selectListLoading   = (s) => s.booking?.listLoading   ?? false;
export const selectDeleteLoading = (s) => s.booking?.deleteLoading ?? false;
export const selectDeleteError   = (s) => s.booking?.deleteError   ?? null;

export default bookingSlice.reducer;