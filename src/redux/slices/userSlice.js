import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../config/axiosInstance";


const initialState = {
  user: null,
  isUserAuth: false,
  loading: false,
  error: null,
};

// Async Thunk for User Signup
export const signupUser = createAsyncThunk("user/signup", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/user/signup", userData, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Signup failed");
  }
});

// Async Thunk for User Login
export const loginUser = createAsyncThunk("user/login", async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/user/login", userData, { withCredentials: true });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Async Thunk for User Logout
export const logoutUser = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.get("/user/logout");
    return null;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.isUserAuth = action.payload.isUserAuth;
    },
    clearUser: (state) => {
      state.isUserAuth = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => { state.loading = true; })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isUserAuth = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => { state.loading = true; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isUserAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isUserAuth = false;
      });
  },
});

export const { saveUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
