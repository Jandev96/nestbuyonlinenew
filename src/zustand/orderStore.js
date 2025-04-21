import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
  order: null,
  orders: [], // 🆕 for storing all user orders
  loading: false,
  error: null,

  createOrder: async ({ shippingAddress }) => {
    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.post("/order/", { shippingAddress });

      const createdOrder = res.data?.order;
      if (!createdOrder) throw new Error("No order returned from server");

      toast.success("Order placed successfully!");
      set({ order: createdOrder, loading: false });

      return createdOrder;
    } catch (error) {
      toast.error(error.response?.data?.message || "Order creation failed.");
      set({ error: error.message, loading: false });
      return null;
    }
  },

  getOrderById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/order/${id}`);
      console.log("response for order", res);
      set({ order: res.data, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch order",
        loading: false,
      });
    }
  },

  // 🆕 Fetch all user orders
  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/order/userOrder", {
        withCredentials: true,
      });
      set({ orders: res.data, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user orders.");
      set({
        error: error.response?.data?.message || "Failed to fetch user orders",
        loading: false,
      });
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/order", {
        withCredentials: true,
      });
      set({ orders: res.data, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch all orders.");
      set({
        error: error.response?.data?.message || "Failed to fetch all orders",
        loading: false,
      });
    }
  },

  updateOrderStatus: async (id, newStatus, trackingNumber = "") => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.put(
        `/order/${id}`,
        { status: newStatus, trackingNumber },
        { withCredentials: true }
      );
  
      toast.success("Order status updated");
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        ),
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
      set({
        error: error.response?.data?.message || "Status update failed",
        loading: false,
      });
    }
  },



}));
