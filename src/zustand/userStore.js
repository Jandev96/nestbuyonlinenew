import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";
import { saveUser } from "../redux/slices/userSlice";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,              // ✅ initial user state
  isUserAuth: false,       // ✅ initial auth state
  loading: false,
  error: null,

  // ✅ Fetch all users
  fetchAllUsers: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/user", {
        withCredentials: true,
      });
      set({ users: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load users",
        loading: false,
      });
    }
  },

  // ✅ Fetch recent users
  fetchRecentUsers: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/user/recent", {
        withCredentials: true,
      });
      set({ users: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load users",
        loading: false,
      });
    }
  },

  // ✅ Fetch profile for logged-in user
  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/user/profile", {
        withCredentials: true,
      });
      set({ user: res.data.data, loading: false });
    } catch (err) {
      set({ error: "Failed to load profile", loading: false });
    }
  },

  // ✅ Update user profile
  updateProfile: async (updatedData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put("/user/update", updatedData, {
        withCredentials: true,
      });
      set({ user: res.data.data, loading: false });
      return { success: true, message: res.data.message };
    } catch (err) {
      set({
        error: err.response?.data?.message || "Update failed",
        loading: false,
      });
      return {
        success: false,
        message: err.response?.data?.message || "Update failed",
      };
    }
  },

  // ✅ Fetch current user session
  fetchCurrentUser: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/user/me", {
        withCredentials: true,
      });
      set({ user: res.data.data, isUserAuth: true, loading: false });
    } catch (err) {
      set({ user: null, isUserAuth: false, loading: false });
    }
  },

  // ✅ Sync Zustand user with Redux store
  syncUserWithRedux: (dispatch) => {
    const state = get();
    dispatch(saveUser({ isUserAuth: true, user: state.user }));
  },

  // ✅ Clear user data
  clearUser: () => set({ user: null, isUserAuth: false }),
}));
