import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";
export const fetchGallery = createAsyncThunk(
  "gallery/fetchGallery",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/gallery");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const fetchFeaturedGallery = createAsyncThunk(
  "gallery/fetchFeatured",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/gallery/featured");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch featured failed");
    }
  }
);

export const createGalleryItem = createAsyncThunk(
  "gallery/createGalleryItem",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/gallery", formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);

export const updateGalleryItem = createAsyncThunk(
  "gallery/updateGalleryItem",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/gallery/${id}`, formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);

export const deleteGalleryItem = createAsyncThunk(
  "gallery/deleteGalleryItem",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);
const initialState = {
  gallery: [],
  featured: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};
const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },
    clearGalleryError(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createGalleryItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createGalleryItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.gallery.unshift(action.payload);
        state.successMessage = "Gallery item created successfully";
      })
      .addCase(createGalleryItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(updateGalleryItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateGalleryItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.gallery = state.gallery.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.successMessage = "Gallery item updated successfully";
      })
      .addCase(updateGalleryItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      .addCase(deleteGalleryItem.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.gallery = state.gallery.filter((item) => item._id !== action.payload);
        state.featured = state.featured.filter((item) => item._id !== action.payload);
        state.successMessage = "Gallery item deleted";
      })
      .addCase(deleteGalleryItem.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
})
export const { clearMessages, clearGalleryError } = gallerySlice.actions;
export const selectGallery            = (s) => s.gallery.gallery;
export const selectFeaturedGallery    = (s) => s.gallery.featured;
export const selectGalleryLoading     = (s) => s.gallery.loading;
export const selectActionLoading      = (s) => s.gallery.actionLoading;
export const selectGalleryError       = (s) => s.gallery.error;
export const selectActionError        = (s) => s.gallery.actionError;
export const selectSuccessMessage     = (s) => s.gallery.successMessage;

export default gallerySlice.reducer;