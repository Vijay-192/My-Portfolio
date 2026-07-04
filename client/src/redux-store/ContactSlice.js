import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";


export const submitContact = createAsyncThunk(
  "contact/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/contact", formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submit failed");
    }
  }
);

export const fetchAllContacts = createAsyncThunk(
  "contact/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/contact");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Fetch failed");
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contact/deleteOne",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/contact/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

export const deleteManyContacts = createAsyncThunk(
  "contact/deleteMany",
  async (ids, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/contact/bulk", { data: { ids } });
      return ids;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Bulk delete failed");
    }
  }
);


const contactSlice = createSlice({
  name: "contact",
  initialState: {
    contacts:      [],
    listLoading:   false,
    submitLoading: false,
    deleteLoading: false,
    submitError:   null,
    deleteError:   null,
  },
  reducers: {
    clearSubmitError: (state) => { state.submitError = null; },
    clearDeleteError: (state) => { state.deleteError = null; },
  },
  extraReducers: (builder) => {

    builder
      .addCase(submitContact.pending,   (state) => { state.submitLoading = true;  state.submitError = null; })
      .addCase(submitContact.fulfilled, (state) => { state.submitLoading = false; })
      .addCase(submitContact.rejected,  (state, { payload }) => { state.submitLoading = false; state.submitError = payload; });

    builder
      .addCase(fetchAllContacts.pending,   (state) => { state.listLoading = true; })
      .addCase(fetchAllContacts.fulfilled, (state, { payload }) => { state.listLoading = false; state.contacts = payload; })
      .addCase(fetchAllContacts.rejected,  (state) => { state.listLoading = false; });

    builder
      .addCase(deleteContact.pending,   (state) => { state.deleteLoading = true;  state.deleteError = null; })
      .addCase(deleteContact.fulfilled, (state, { payload }) => {
        state.deleteLoading = false;
        state.contacts = state.contacts.filter((c) => c._id !== payload);
      })
      .addCase(deleteContact.rejected,  (state, { payload }) => { state.deleteLoading = false; state.deleteError = payload; });

    builder
      .addCase(deleteManyContacts.pending,   (state) => { state.deleteLoading = true;  state.deleteError = null; })
      .addCase(deleteManyContacts.fulfilled, (state, { payload }) => {
        state.deleteLoading = false;
        const removed = new Set(payload);
        state.contacts = state.contacts.filter((c) => !removed.has(c._id));
      })
      .addCase(deleteManyContacts.rejected,  (state, { payload }) => { state.deleteLoading = false; state.deleteError = payload; });
  },
});

export const { clearSubmitError, clearDeleteError } = contactSlice.actions;
export const selectAllContacts   = (state) => state.contact.contacts;
export const selectListLoading   = (state) => state.contact.listLoading;
export const selectSubmitLoading = (state) => state.contact.submitLoading;
export const selectDeleteLoading = (state) => state.contact.deleteLoading;
export const selectSubmitError   = (state) => state.contact.submitError;
export const selectDeleteError   = (state) => state.contact.deleteError;

export default contactSlice.reducer;