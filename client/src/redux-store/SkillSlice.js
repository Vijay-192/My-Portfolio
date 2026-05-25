import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

export const createSkill = createAsyncThunk(
  "skills/createSkill",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/skills/create", formData);
      return res.data.skill;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Create failed");
    }
  }
);


export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/skills");
      return res.data.skills;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);


export const deleteSkill = createAsyncThunk(
  "skills/deleteSkill",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/skills/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);


const initialState = {
  skills: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.actionError = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder


      .addCase(createSkill.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skills.unshift(action.payload);
        state.successMessage = "Skill created successfully";
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })


      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(deleteSkill.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skills = state.skills.filter(
          (s) => s._id !== action.payload
        );
        state.successMessage = "Skill deleted";
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearMessages } = skillSlice.actions;

export const selectSkills = (s) => s.skills.skills;
export const selectSkillLoading = (s) => s.skills.loading;
export const selectActionLoading = (s) => s.skills.actionLoading;
export const selectError = (s) => s.skills.error;
export const selectActionError = (s) => s.skills.actionError;
export const selectSuccessMessage = (s) => s.skills.successMessage;

export default skillSlice.reducer;