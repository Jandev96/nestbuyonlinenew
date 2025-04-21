// store/useAdminStore.js
import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";

const useAdminStore = create((set) => ({
  admin: null,
  isLoading: false,
  error: null,

  // Admins list
  admins: [],
  totalAdmins: 0,
  adminFetchLoading: false,

  // ✅ Fetch all admins with pagination, search, and sort
  fetchAllAdmins: async (page = 1, search = "", sort = "newest") => {
    set({ adminFetchLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `/admin/all?page=${page}&search=${search}&sort=${sort}`,
        { withCredentials: true }
      );
      set({
        admins: data.data,
        totalAdmins: data.total,
        adminFetchLoading: false,
      });
    } catch (error) {
      set({
        admins: [],
        totalAdmins: 0,
        adminFetchLoading: false,
        error: error.response?.data?.message || "Failed to fetch admins",
      });
    }
  },

  // ✅ Check if admin is authenticated
  checkAdminAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/admin/checkadmin", {
        withCredentials: true,
      });
      set({ admin: data, isLoading: false });
    } catch (error) {
      set({
        admin: null,
        isLoading: false,
        error: error.response?.data?.message || "Failed to verify admin",
      });
    }
  },

  // ✅ Admin login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axiosInstance.post(
        "/admin/login",
        { email, password },
        { withCredentials: true }
      );
      set({ admin: data.data, isLoading: false });
    } catch (error) {
      set({
        admin: null,
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      });
    }
  },

  // ✅ Admin logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.get("/admin/logout", { withCredentials: true });
      set({ admin: null, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Logout failed",
      });
    }
  },

  // ✅ Delete admin
  deleteAdmin: async (adminId) => {
    set({ adminFetchLoading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/${adminId}`, {
        withCredentials: true,
      });
      set((state) => ({
        admins: state.admins.filter((admin) => admin._id !== adminId),
        totalAdmins: state.totalAdmins - 1,
        adminFetchLoading: false,
      }));
    } catch (error) {
      set({
        adminFetchLoading: false,
        error: error.response?.data?.message || "Failed to delete admin",
      });
    }
  },


  // ✅ Update admin by ID
updateAdmin: async (adminId, updatedData) => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await axiosInstance.put(
      `/admin/${adminId}`,
      updatedData,
      { withCredentials: true }
    );

    // Update the local state
    set((state) => ({
      isLoading: false,
      admins: state.admins.map((admin) =>
        admin._id === adminId ? data.data : admin
      ),
    }));
  } catch (error) {
    set({
      isLoading: false,
      error: error.response?.data?.message || "Failed to update admin",
    });
  }
},

// ✅ Admin signup
signupAdmin: async (adminData) => {
  set({ isLoading: true, error: null });
  try {
    const { data } = await axiosInstance.post("/admin/signup", adminData, {
      withCredentials: true,
    });

    // Optionally update the store or refetch the admin list
    set((state) => ({
      admins: [data.data, ...state.admins],
      totalAdmins: state.totalAdmins + 1,
      isLoading: false,
    }));
  } catch (error) {
    set({
      isLoading: false,
      error: error.response?.data?.message || "Signup failed",
    });
  }
},




}));

export default useAdminStore;
