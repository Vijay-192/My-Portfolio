import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/projects");
      return data.projects;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
); 

export const fetchSingleProject = createAsyncThunk(
  "projects/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/projects/${id}`);
      return data.project;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/projects/create", formData);
      return data.project;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/projects/${id}`, formData);
      return data.project;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },
    clearSelectedProject(state) {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch projects";
      })

      .addCase(fetchSingleProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleProject.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchSingleProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch project";
      })

      .addCase(createProject.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        const exists = state.projects.some((p) => p._id === action.payload._id);
        if (!exists) state.projects.unshift(action.payload);
        state.successMessage = "Project created successfully";
      })
      .addCase(createProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Create failed";
      })

      .addCase(updateProject.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        const idx = state.projects.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.projects[idx] = action.payload;
        state.selectedProject = null;
        state.successMessage = "Project updated successfully";
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Update failed";
      })

      .addCase(deleteProject.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
        state.successMessage = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        state.successMessage = "Project deleted successfully";
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload || "Delete failed";
      });
  },
});

export const { clearMessages, clearSelectedProject } = projectSlice.actions;

export const selectProjects        = (s) => s.projects?.projects       ?? [];
export const selectProjectLoading  = (s) => s.projects?.loading        ?? false;
export const selectActionLoading   = (s) => s.projects?.actionLoading  ?? false;
export const selectError           = (s) => s.projects?.error          ?? null;
export const selectActionError     = (s) => s.projects?.actionError    ?? null;
export const selectSuccessMessage  = (s) => s.projects?.successMessage ?? null;
export const selectSelectedProject = (s) => s.projects?.selectedProject ?? null;

export default projectSlice.reducer;