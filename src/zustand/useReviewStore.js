import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";

const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,
  successMessage: null,

  // Fetch all reviews for a product
  fetchReviews: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/review/${productId}`);
      set({ reviews: response.data.reviews, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch reviews",
        loading: false,
      });
    }
  },

  // Add a review
  addReview: async ({ productId, rating, comment }) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const response = await axiosInstance.post(`/review`, {
        productId,
        rating,
        comment,
      });

      await get().fetchReviews(productId);

      set({
        successMessage: response.data.message,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to add review",
        loading: false,
      });
    }
  },

  // Update a review
  updateReview: async ({ reviewId, productId, rating, comment }) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const response = await axiosInstance.put(`/review/update/${reviewId}`, {
        rating,
        comment,
      });

      await get().fetchReviews(productId);

      set({
        successMessage: response.data.message,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to update review",
        loading: false,
      });
    }
  },

  // Delete a review
  deleteReview: async ({ reviewId, productId }) => {
    set({ loading: true, error: null, successMessage: null });
    try {
      const response = await axiosInstance.delete(`/review/${reviewId}`);

      await get().fetchReviews(productId);

      set({
        successMessage: response.data.message,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to delete review",
        loading: false,
      });
    }
  },

  // Clear error/success messages
  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useReviewStore;
