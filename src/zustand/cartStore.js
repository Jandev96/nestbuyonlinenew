import { create } from "zustand";
import { axiosInstance } from "../config/axiosInstance";

export const useCartStore = create((set, get) => ({
  items: [],
  totalAmount: 0,
  cartId: null,

  totalQuantity: () => {
    const items = get().items || [];
    return items.reduce((total, item) => total + (item?.quantity || 0), 0);
  },

  // Fetch Cart Data
  fetchCart: async () => {
    try {
      const response = await axiosInstance.get("/cart/get-cart");
      const cart = response.data.cart || {};
      set({
        items: cart.products || [],
        totalAmount: cart.totalPrice || 0,
        cartId: cart._id || null,
      });
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    }
  },

  // Add to Cart
  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await axiosInstance.post("/cart/addtocart", { productId, quantity });
      const cart = response.data.cart || {};
      set({
        items: cart.products || [],
        totalAmount: cart.totalPrice || 0,
      });
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  },

  // Increase Quantity
  increaseQuantity: async (productId) => {
    const { items, cartId } = get();

    if (!cartId) {
        console.error("Error: cartId is undefined");
        return;
    }

    // Find the correct item in the cart
    const item = items.find((item) => item?.productId?._id === productId || item?.productId === productId);

    if (!item) {
        console.error("Error: Item not found in cart");
        return;
    }

    const validProductId = item.productId?._id || item.productId;

    if (!validProductId) {
        console.error("Error: productId is missing");
        return;
    }

    try {
        console.log("Sending request with:", { cartId, productId: validProductId, quantity: item.quantity + 1 });

        const response = await axiosInstance.put("/cart/update-quantity", {
            cartId,
            productId: validProductId,
            quantity: item.quantity + 1,
        });

        console.log("Response:", response.data);

        set((state) => ({
            items: state.items.map((cartItem) =>
                cartItem.productId._id === validProductId
                    ? { ...cartItem, quantity: item.quantity + 1 }
                    : cartItem
            ),
            totalAmount: response.data.cart?.totalPrice || state.totalAmount, 
        }));
    } catch (error) {
        console.error("Error increasing quantity:", error.response?.data || error);
    }
},



  // Decrease Quantity
  decreaseQuantity: async (productId) => {
    const { items, cartId, removeItem } = get();

    if (!cartId) {
        console.error("Error: cartId is undefined");
        return;
    }

    // Find the correct item in the cart
    const item = items.find((item) => item?.productId?._id === productId || item?.productId === productId);

    if (!item) {
        console.error("Error: Item not found in cart");
        return;
    }

    const validProductId = item.productId?._id || item.productId;

    if (!validProductId) {
        console.error("Error: productId is missing");
        return;
    }

    // If quantity is 1, remove the item instead of decreasing
    if (item.quantity === 1) {
        console.log("Removing item instead of updating:", { cartId, productId: validProductId });
        removeItem(validProductId);
        return;
    }

    try {
        console.log("Sending request with:", { cartId, productId: validProductId, quantity: item.quantity - 1 });

        const response = await axiosInstance.put("/cart/update-quantity", {
            cartId,
            productId: validProductId,
            quantity: item.quantity - 1,
        });

        console.log("Response:", response.data);

        set((state) => ({
            items: state.items.map((cartItem) =>
                cartItem.productId._id === validProductId
                    ? { ...cartItem, quantity: item.quantity - 1 }
                    : cartItem
            ),
            totalAmount: response.data.cart?.totalPrice || state.totalAmount,
        }));
    } catch (error) {
        console.error("Error decreasing quantity:", error.response?.data || error);
    }
},



  // Remove Item from Cart
  removeItem: async (productId) => {
    try {
      await axiosInstance.delete(`/cart/removeitem/${productId}`);
      
      // Update Zustand state after removing the item
      set((state) => ({
        items: state.items.filter((item) => item.productId._id !== productId),
        totalAmount: state.items.reduce(
          (total, item) =>
            item.productId._id !== productId ? total + item.price * item.quantity : total,
          0
        ),
      }));
      
      console.log("Item removed successfully");
    } catch (error) {
      console.error("Error removing item:", error.response?.data || error);
    }
  },

  clearCart: async () => {
    try {
      await axiosInstance.delete("/cart/clear"); // Backend call to clear cart
      set({
        items: [],
        totalAmount: 0,
        cartId: null,
      });
      console.log("Cart cleared successfully");
    } catch (error) {
      console.error("Error clearing cart:", error.response?.data || error.message);
    }
  },
  






}));
