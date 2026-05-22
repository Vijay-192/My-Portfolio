
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

// CREATE
export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/blogs/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create blog"
      );
    }
  }
);

// UPDATE
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/blogs/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update blog"
      );
    }
  }
);

// DELETE
export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/blogs/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete blog"
      );
    }
  }
);

// FETCH ALL
export const fetchAllBlogs = createAsyncThunk(
  "blogs/fetchAllBlogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/blogs", { params });
      return res.data.blogs;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

// FETCH SINGLE
export const fetchBlog = createAsyncThunk(
  "blogs/fetchBlog",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/blogs/${id}`);
      return res.data.blog;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch blog"
      );
    }
  }
);

// STATE
const initialState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

// SLICE
const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },
    clearSelectedBlog(state) {
      state.selectedBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createBlog.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.blogs.unshift(action.payload);
        state.successMessage = "Blog created successfully";
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // UPDATE
      .addCase(updateBlog.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.blogs.findIndex((b) => b._id === action.payload._id);
        if (idx !== -1) state.blogs[idx] = action.payload;
        state.successMessage = "Blog updated successfully";
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // DELETE
      .addCase(deleteBlog.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload);
        state.successMessage = "Blog deleted successfully";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // FETCH ALL
      .addCase(fetchAllBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ONE
      .addCase(fetchBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, clearSelectedBlog } = blogSlice.actions;

// Selectors
export const selectBlogs = (s) => s.blogs.blogs;
export const selectBlogLoading = (s) => s.blogs.loading;
export const selectActionLoading = (s) => s.blogs.actionLoading;
export const selectError = (s) => s.blogs.error;
export const selectActionError = (s) => s.blogs.actionError;
export const selectSuccessMessage = (s) => s.blogs.successMessage;
export const selectSelectedBlog = (s) => s.blogs.selectedBlog;

export default blogSlice.reducer;