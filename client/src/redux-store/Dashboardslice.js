import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProjectsAPI,
  fetchSkillsAPI,
  fetchServicesAPI,
  fetchAchievementsAPI,
  fetchBlogPostsAPI,
} from "../api/dashboardAPI.js";
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [projects, skills, services, achievements, blogPosts] =
        await Promise.all([
          fetchProjectsAPI(),
          fetchSkillsAPI(),
          fetchServicesAPI(),
          fetchAchievementsAPI(),
          fetchBlogPostsAPI(),
        ]);
      return { projects, skills, services, achievements, blogPosts };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch dashboard data");
    }
  }
);
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    projects:     [],
    skills:       [],
    services:     [],
    achievements: [],
    blogPosts:    [],
    loading:      false,
    error:        null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading      = false;
        state.projects     = action.payload.projects;
        state.skills       = action.payload.skills;
        state.services     = action.payload.services;
        state.achievements = action.payload.achievements;
        state.blogPosts    = action.payload.blogPosts;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;