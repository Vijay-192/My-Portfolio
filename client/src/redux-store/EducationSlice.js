import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";

// FETCH ALL
export const fetchEducation = createAsyncThunk(
  "education/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/education");
      return data.education;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// CREATE
export const createEducation = createAsyncThunk(
  "education/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        "/education/create",
        formData
      );
      return data.education;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE
export const updateEducation = createAsyncThunk(
  "education/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/education/${id}`,
        formData
      );
      return data.education;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// DELETE
export const deleteEducation = createAsyncThunk(
  "education/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/education/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// STATE
const initialState = {
  education: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionError: null,
  successMessage: null,
};

const educationSlice = createSlice({
  name: "education",
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

      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.education = action.payload;
      })

      .addCase(createEducation.fulfilled, (state, action) => {
        state.education.unshift(action.payload);
        state.successMessage = "Education added";
      })

      .addCase(updateEducation.fulfilled, (state, action) => {
        const i = state.education.findIndex(
          (e) => e._id === action.payload._id
        );
        if (i !== -1) state.education[i] = action.payload;
      })

      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.education = state.education.filter(
          (e) => e._id !== action.payload
        );
      });
  },
});

export const { clearMessages } = educationSlice.actions;
export default educationSlice.reducer;