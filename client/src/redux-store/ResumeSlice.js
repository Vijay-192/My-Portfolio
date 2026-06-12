import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient"; 

export const fetchDocuments = createAsyncThunk(
  "resume/fetchAll",
  async (type = "resume", { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/${type}`);
      return { type, docs: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);


export const uploadDocument = createAsyncThunk(
  "resume/upload",
  async ({ type, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/${type}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { type, doc: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Upload failed");
    }
  }
);


export const deleteDocument = createAsyncThunk(
  "resume/delete",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/${type}/${id}`);
      return { type, id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);


export const toggleActive = createAsyncThunk(
  "resume/toggleActive",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/${type}/${id}/toggle-active`);
      return { type, doc: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Toggle failed");
    }
  }
);

export const updateLabel = createAsyncThunk(
  "resume/updateLabel",
  async ({ type, id, label }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/${type}/${id}`, { label });
      return { type, doc: res.data.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);
const initialState = {
  resume: {
    list: [],
    loading: false,
    uploading: false,
    error: null,
    actionError: null,
    successMessage: null,
  },
  cv: {
    list: [],
    loading: false,
    uploading: false,
    error: null,
    actionError: null,
    successMessage: null,
  },
};
const replaceDoc = (list, updated) =>
  list.map((d) => (d._id === updated._id ? updated : d));

const resumeSlice = createSlice({
  name: "resume",
  initialState,

  reducers: {
    clearMessages(state, action) {
      const type = action.payload || "resume";
      state[type].error = null;
      state[type].actionError = null;
      state[type].successMessage = null;
    },
  },

  extraReducers: (builder) => {

    builder
      .addCase(fetchDocuments.pending, (state, { meta }) => {
        state[meta.arg].loading = true;
        state[meta.arg].error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, { payload }) => {
        state[payload.type].loading = false;
        state[payload.type].list = payload.docs;
      })
      .addCase(fetchDocuments.rejected, (state, { meta, payload }) => {
        state[meta.arg].loading = false;
        state[meta.arg].error = payload;
      });


    builder
      .addCase(uploadDocument.pending, (state, { meta }) => {
        state[meta.arg.type].uploading = true;
        state[meta.arg.type].actionError = null;
        state[meta.arg.type].successMessage = null;
      })
      .addCase(uploadDocument.fulfilled, (state, { payload }) => {
        state[payload.type].uploading = false;
        state[payload.type].list.unshift(payload.doc);
        state[payload.type].successMessage = `${payload.type === "resume" ? "Resume" : "CV"} uploaded successfully`;
      })
      .addCase(uploadDocument.rejected, (state, { meta, payload }) => {
        state[meta.arg.type].uploading = false;
        state[meta.arg.type].actionError = payload;
      });


    builder
      .addCase(deleteDocument.pending, () => { /* no spinner needed */ })
      .addCase(deleteDocument.fulfilled, (state, { payload }) => {
        state[payload.type].list = state[payload.type].list.filter(
          (d) => d._id !== payload.id
        );
        state[payload.type].successMessage = `${payload.type === "resume" ? "Resume" : "CV"} deleted`;
      })
      .addCase(deleteDocument.rejected, (state, { meta, payload }) => {
        state[meta.arg.type].actionError = payload;
      });


    builder
      .addCase(toggleActive.fulfilled, (state, { payload }) => {
        state[payload.type].list = replaceDoc(state[payload.type].list, payload.doc);
      })
      .addCase(toggleActive.rejected, (state, { meta, payload }) => {
        state[meta.arg.type].actionError = payload;
      });


    builder
      .addCase(updateLabel.fulfilled, (state, { payload }) => {
        state[payload.type].list = replaceDoc(state[payload.type].list, payload.doc);
        state[payload.type].successMessage = "Label updated";
      })
      .addCase(updateLabel.rejected, (state, { meta, payload }) => {
        state[meta.arg.type].actionError = payload;
      });
  },
});

export const { clearMessages } = resumeSlice.actions;
export const selectResumes        = (s) => s.resume.resume.list;
export const selectCVs            = (s) => s.resume.cv.list;
export const selectResumeState    = (s) => s.resume.resume;
export const selectCVState        = (s) => s.resume.cv;

export default resumeSlice.reducer;