// redux-store/ServiceSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

// ─────────────────────────────────────────────────────────
// FETCH ALL SERVICES
// ─────────────────────────────────────────────────────────
export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/services");

      console.log(data);

      return data.services;
    } catch (err) {
      console.log(err.response?.data || err.message);

      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch services"
      );
    }
  }
);
// ─────────────────────────────────────────────────────────
// FETCH SINGLE SERVICE
// ─────────────────────────────────────────────────────────
export const fetchSingleService = createAsyncThunk(
  "services/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/services/${id}`);
      return data.service;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch service"
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// CREATE SERVICE
// ─────────────────────────────────────────────────────────
export const createService = createAsyncThunk(
  "services/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/services/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data.service;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to create service"
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// UPDATE SERVICE
// ─────────────────────────────────────────────────────────
export const updateService = createAsyncThunk(
  "services/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/services/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data.service;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update service"
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// DELETE SERVICE
// ─────────────────────────────────────────────────────────
export const deleteService = createAsyncThunk(
  "services/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to delete service"
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────
const initialState = {
  services: [],
  selectedService: null,

  loading: false,
  actionLoading: false,

  error: null,
  actionError: null,

  successMessage: null,
};

// ─────────────────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────────────────
const serviceSlice = createSlice({
  name: "services",

  initialState,

  reducers: {
    clearMessages(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },

    clearSelectedService(state) {
      state.selectedService = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ───────────────── FETCH ALL ─────────────────
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })

      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── FETCH SINGLE ─────────────────
      .addCase(fetchSingleService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSingleService.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedService = action.payload;
      })

      .addCase(fetchSingleService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ───────────────── CREATE ─────────────────
      .addCase(createService.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })

      .addCase(createService.fulfilled, (state, action) => {
        state.actionLoading = false;

        const exists = state.services.some(
          (service) => service._id === action.payload._id
        );

        if (!exists) {
          state.services.unshift(action.payload);
        }

        state.successMessage = "Service created successfully";
      })

      .addCase(createService.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // ───────────────── UPDATE ─────────────────
      .addCase(updateService.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })

      .addCase(updateService.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.services.findIndex(
          (service) => service._id === action.payload._id
        );

        if (index !== -1) {
          state.services[index] = action.payload;
        }

        state.selectedService = null;

        state.successMessage = "Service updated successfully";
      })

      .addCase(updateService.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // ───────────────── DELETE ─────────────────
      .addCase(deleteService.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.services = state.services.filter(
          (service) => service._id !== action.payload
        );

        state.successMessage = "Service deleted successfully";
      })

      .addCase(deleteService.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

// ─────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────
export const {
  clearMessages,
  clearSelectedService,
} = serviceSlice.actions;

// ───────────────── SELECTORS ─────────────────
export const selectServices = (state) =>
  state.services?.services ?? [];

export const selectSelectedService = (state) =>
  state.services?.selectedService ?? null;

export const selectServiceLoading = (state) =>
  state.services?.loading ?? false;

export const selectActionLoading = (state) =>
  state.services?.actionLoading ?? false;

export const selectError = (state) =>
  state.services?.error ?? null;

export const selectActionError = (state) =>
  state.services?.actionError ?? null;

export const selectSuccessMessage = (state) =>
  state.services?.successMessage ?? null;

export default serviceSlice.reducer;