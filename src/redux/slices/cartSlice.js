import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "../../config/axiosInstance";

// API Base URL
const BASE_URL = "http://localhost:3000/api/cart";

// Async Thunk to Add Item to Cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/cart/addtocart', { productId, quantity }, { withCredentials: true });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async Thunk to Get Cart Items
export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-cart`, { withCredentials: true });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

// Async Thunk to Remove Item from Cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/removeitem/${productId}`, { withCredentials: true });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalPrice = action.payload.totalPrice;
        state.status = "succeeded";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.products;
        state.totalPrice = action.payload.totalPrice;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;
