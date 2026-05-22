import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../Utils/apiClient";


const saveToStorage = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearStorage = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};


const extractMessage = (payload) => {
  if (!payload) return "Something went wrong.";
  if (typeof payload === "string") return payload;
  if (payload?.response?.data?.message) return payload.response.data.message;
  if (payload?.message) return payload.message;
  return "Something went wrong.";
};


const getInitialState = () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    return {
      isAuthenticated: !!accessToken,
      user: user ? JSON.parse(user) : null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,

      loading: false,
      error: null,

      users: [],
      usersLoading: false,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,

      loading: false,
      error: null,

      users: [],
      usersLoading: false,
    };
  }
};


export const registerThunk = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", body);
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const loginThunk = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", body);
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", body);
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", body);
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/reset-password", body);
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const refreshTokenThunk = createAsyncThunk(
  "auth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      const { data } = await axiosInstance.post("/auth/refresh", { refreshToken });
      return data;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const fetchUsersThunk = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/auth/admin/users");
      return data.users;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);


export const assignRoleThunk = createAsyncThunk(
  "auth/assignRole",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.patch("/auth/admin/assign-role", body);
      return data.user;
    } catch (error) {
      return rejectWithValue(extractMessage(error));
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/logout");
      return data;
    } catch (error) {
      return { message: "Logged out." };
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),

  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearStorage();
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {


    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        saveToStorage(action.payload);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    builder
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        clearStorage();
      });

    builder
      .addCase(fetchUsersThunk.pending, (state) => {
        state.usersLoading = true;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state) => {
        state.usersLoading = false;
      });

    builder.addCase(assignRoleThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex((u) => u._id === action.payload._id);
      if (index !== -1) state.users[index] = action.payload;
    });

    builder
      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        clearStorage();
      })
      .addCase(logoutThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        clearStorage();
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;