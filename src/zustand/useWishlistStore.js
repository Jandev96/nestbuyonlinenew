import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";

const useWishlistStore = create((set) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/wishlist");
      set({ wishlist: res.data.wishlist.products, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  addToWishlist: async (productId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post(`/wishlist/${productId}`
      );
      set({ wishlist: res.data.wishlist.products, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      const response = await axiosInstance.delete(`/wishlist/${productId}`);
      // After successful removal, remove the product from the local state
      set((state) => ({
        wishlist: state.wishlist.filter((item) => item.productId._id !== productId),
      }));
    } catch (error) {
      console.error("Error removing from wishlist:", error.response?.data.message || error.message);
    }
  },
}));

export default useWishlistStore;
