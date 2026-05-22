import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

export const fetchAchievements = createAsyncThunk(
  "achievement/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/achievements");
      return data.achievements;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


export const createAchievement = createAsyncThunk(
  "achievement/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/achievements/create",
        formData
      );
      return data.achievement;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const updateAchievement = createAsyncThunk(
  "achievement/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/achievements/${id}`,
        formData
      );
      return data.achievement;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const deleteAchievement = createAsyncThunk(
  "achievement/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/achievements/${id}`);
      return id; // return id so reducer can remove it from state
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);


const initialState = {
  achievements:   [],
  loading:        false,
  actionLoading:  false,
  error:          null,
  actionError:    null,
  successMessage: null,
};


const achievementSlice = createSlice({
  name: "achievements",
  initialState,

  reducers: {
    clearMessages(state) {
      state.error          = null;
      state.actionError    = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {

    builder
      .addCase(fetchAchievements.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.loading      = false;
        state.achievements = action.payload;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });

    builder
      .addCase(createAchievement.pending, (state) => {
        state.actionLoading = true;
        state.actionError   = null;
      })
      .addCase(createAchievement.fulfilled, (state, action) => {
        state.actionLoading  = false;
        state.successMessage = "Achievement created";
        state.achievements.unshift(action.payload); // add at top
      })
      .addCase(createAchievement.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError   = action.payload;
      });

    builder
      .addCase(updateAchievement.pending, (state) => {
        state.actionLoading = true;
        state.actionError   = null;
      })
      .addCase(updateAchievement.fulfilled, (state, action) => {
        state.actionLoading  = false;
        state.successMessage = "Achievement updated";
        const idx = state.achievements.findIndex(
          (a) => a._id === action.payload._id
        );
        if (idx !== -1) state.achievements[idx] = action.payload;
      })
      .addCase(updateAchievement.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError   = action.payload;
      });

    builder
      .addCase(deleteAchievement.pending, (state) => {
        state.actionLoading = true;
        state.actionError   = null;
      })
      .addCase(deleteAchievement.fulfilled, (state, action) => {
        state.actionLoading  = false;
        state.successMessage = "Achievement deleted";
        state.achievements   = state.achievements.filter(
          (a) => a._id !== action.payload
        );
      })
      .addCase(deleteAchievement.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError   = action.payload;
      });
  },
});

export const { clearMessages } = achievementSlice.actions;
export default achievementSlice.reducer;