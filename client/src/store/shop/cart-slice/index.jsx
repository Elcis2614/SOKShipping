// client/src/store/shop/cart-slice/index.js

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/shop/cart`;

const initialState = {
  _id: null,
  cartItems: [],
  isLoading: false,
  error: null,
  success: false,
  totalAmount: 0,
  totalQuantity: 0
};

// Utility function to extract only serializable data from axios response
const extractResponseData = (response) => ({
  data: response.data?.data,
  status: response.status,
  message: response.data?.message || 'Success'
});


export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      const response = await axios.post(
        `${API_BASE_URL}/add`,
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return extractResponseData(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add item to cart';
      console.error("Add to Cart failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axios.get(
        `${API_BASE_URL}/get/${userId}`,
        { withCredentials: true }
      );
      const {data, status, message} = extractResponseData(response);
      return {data, status, message};
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart items';
      console.error("Fetch Cart Items failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      if (!userId || !productId || quantity === undefined) {
        throw new Error('User ID, Product ID, and quantity are required');
      }

      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      const response = await axios.put(
        `${API_BASE_URL}/update`,
        { userId, productId, quantity },
        { withCredentials: true }
      );

      return extractResponseData(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update cart item';
      console.error("Update Cart Quantity failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      if (!userId || !productId) {
        throw new Error('User ID and Product ID are required');
      }

      const response = await axios.delete(
        `${API_BASE_URL}/${userId}/${productId}`,
        { withCredentials: true }
      );

      return {
        ...extractResponseData(response),
        productId // Include productId for local state update
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete cart item';
      console.error("Delete Cart Item failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await axios.delete(
        `${API_BASE_URL}/clear/${userId}`,
        { withCredentials: true }
      );

      return extractResponseData(response);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to clear cart';
      console.error("Clear Cart failed:", errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Helper function to calculate cart totals
const calculateCartTotals = (cartItems) => {
  return cartItems.reduce(
    (totals, item) => {
      const itemTotal = (item.productId?.salePrice || item.productId?.price || 0) * item.quantity;
      totals.totalAmount += itemTotal;
      totals.totalQuantity += item.quantity;
      return totals;
    },
    { totalAmount: 0, totalQuantity: 0 }
  );
};

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    // Synchronous actions for immediate UI updates
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetCart: (state) => {
      Object.assign(state, initialState);
    },
    // Optimistic update for better UX
    optimisticUpdateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find(item => item._id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        const totals = calculateCartTotals(state.cartItems);
        state.totalAmount = totals.totalAmount;
        state.totalQuantity = totals.totalQuantity;
      }
    },

    optimisticAddToCart: (state, action) => {
      const { productData, quantity = 1, userId } = action.payload;

      // Check if item already exists in cart
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product_id === productData._id
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const newCartItem = {
          product_id: `temp-${productData._id}-${Date.now()}`, // Temporary ID
          data: productData,
          quantity: quantity,
          userId: userId,
          isOptimistic: true // Flag to identify optimistic items
        };
        state.cartItems.push(newCartItem);
      }

      // Update totals
      const totals = calculateCartTotals(state.cartItems);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
      state.success = true; // Show immediate success feedback
    },

    // NEW: Rollback optimistic add
    rollbackOptimisticAdd: (state, action) => {
      const { tempId, productId } = action.payload;
      if (tempId) {
        // Remove by temporary ID
        state.cartItems = state.cartItems.filter(item => item._id !== tempId);
      } else if (productId) {
        // Rollback quantity change for existing item
        const item = state.cartItems.find(item => item.data?._id === productId);
        if (item && item.quantity > 1) {
          item.quantity -= 1;
        } else if (item) {
          state.cartItems = state.cartItems.filter(item => item.data?._id !== productId);
        }
      }

      // Recalculate totals
      const totals = calculateCartTotals(state.cartItems);
      state.totalAmount = totals.totalAmount;
      state.totalQuantity = totals.totalQuantity;
    },

    // NEW: Confirm optimistic add (replace temp item with real item)
    confirmOptimisticAdd: (state, action) => {
      const { tempId, realItem } = action.payload;
      const tempItemIndex = state.cartItems.findIndex(item => item._id === tempId);

      if (tempItemIndex !== -1) {
        // Replace temporary item with real item from server
        state.cartItems[tempItemIndex] = {
          ...realItem,
          isOptimistic: false
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        const newItem = action.payload.data?.item;
        if (newItem) {
          const existingItemIndex = state.cartItems.findIndex(
            item => item.data?._id === newItem.data?._id
          );

          if (existingItemIndex !== -1) {
            // Update existing item quantity
            state.cartItems[existingItemIndex].quantity = newItem.quantity;
          } else {
            // Add new item to cart
            state.cartItems.push(newItem);
          }
        }

        // Update cart totals
        const totals = calculateCartTotals(state.cartItems);
        state.totalAmount = totals.totalAmount;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add item to cart';
        state.success = false;
      })

      // Fetch Cart Items
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;

        const cartData = action.payload.data;
        if (cartData) {
          state._id = cartData.cart_id;
          state.cartItems = cartData.cart_items || [];
          // Calculate totals
          const totals = calculateCartTotals(state.cartItems);
          state.totalAmount = totals.totalAmount;
          state.totalQuantity = totals.totalQuantity;
        }
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch cart items';
        state.cartItems = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
      })

      // Update Cart Quantity
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        const updatedItem = action.payload.data?.item;
        if (updatedItem) {
          const itemIndex = state.cartItems.findIndex(
            item => item._id === updatedItem._id
          );

          if (itemIndex !== -1) {
            state.cartItems[itemIndex] = updatedItem;
          }
        }

        // Recalculate totals
        const totals = calculateCartTotals(state.cartItems);
        state.totalAmount = totals.totalAmount;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update cart item quantity';
        state.success = false;
      })

      // Delete Cart Item
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;

        const productIdToDelete = action.payload.productId;
        if (productIdToDelete) {
          state.cartItems = state.cartItems.filter(
            item => item._id !== productIdToDelete
          );
        }

        // Recalculate totals
        const totals = calculateCartTotals(state.cartItems);
        state.totalAmount = totals.totalAmount;
        state.totalQuantity = totals.totalQuantity;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete cart item';
        state.success = false;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.cartItems = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to clear cart';
        state.success = false;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetCart,
  optimisticUpdateQuantity,
  optimisticAddToCart,
  rollbackOptimisticAdd,
  confirmOptimisticAdd
} = shoppingCartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.shoppingCart.cartItems;
export const selectCartLoading = (state) => state.shoppingCart.isLoading;
export const selectCartError = (state) => state.shoppingCart.error;
export const selectCartSuccess = (state) => state.shoppingCart.success;
export const selectCartTotals = (state) => ({
  totalAmount: state.shoppingCart.totalAmount,
  totalQuantity: state.shoppingCart.totalQuantity
});
export const selectCartItemCount = (state) => state.shoppingCart.cartItems.length;

export default shoppingCartSlice.reducer;