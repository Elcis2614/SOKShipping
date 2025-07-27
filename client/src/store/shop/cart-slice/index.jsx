// client/src/store/shop/cart-slice/index.jsx 

import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    _id: null,   // The cart ID
    cartItems : [],
    isLoading : false
}

export const addToCart = createAsyncThunk(
  'cart/addToCart', 
  async({ userId = '', product, totalStock=0 }) =>{
    const response = {
      'userId': '',
      'items': {...product, quantity: 1}
    }
    return response;
});

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId, { rejectWithValue }) => {
      try {
          const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`,
              { withCredentials: true }
          );
          return response.data;
      } catch (error) {
          console.error("Fetch Cart Items failed:", error.response?.data || error.message);
          //return rejectWithValue(error.response?.data || { message: error.message });
      }
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId='', productId }) => {
    try {
      //const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`);
      console.log("Received dispatch", productId);
      return {productId};
    } catch (error) {
      return error.response.data;
    }
  }
);



export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId='', productId, quantity }, { rejectWithValue }) => {
    try {
      // const response = await axios.put(
      //   `${import.meta.env.VITE_API_URL}/api/shop/cart/update`,
      //   { userId, productId, quantity }
      // );
      return {productId, quantity};
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(addToCart.pending, (state) => { // addToCart
          state.isLoading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
          state.isLoading = false;
          const ind = state.cartItems.findIndex((item) => item._id == action.payload.items._id);
          if (ind !== -1){
            state.cartItems[ind].quantity += 1;
            console.log("Not firt time added");
          }
          else
            state.cartItems.push(action.payload.items || []);  // Update cart items
            console.log("First time added");
        })
        .addCase(addToCart.rejected, (state, action) => {
          console.error("Add to Cart failed:", action.error);  // Log any errors
          state.isLoading = false;
          state.cartItems = [];
        })
        .addCase(fetchCartItems.pending, (state) => {
          state.isLoading = true;
          state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
          state.isLoading = false;
          state._id = action.payload.data._id; // Add this line
          state.cartItems = action.payload.data.items || [];
          state.error = null;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
          state.isLoading = false;
          state.cartItems = [];
          state.error = action.payload?.message || "Failed to fetch cart items";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {        
        state.isLoading = false;
        const index = state.cartItems.findIndex((item) => item._id == action.payload.productId);
        if (index !== -1) {
          state.cartItems[index].quantity += action.payload.quantity;
        } else {
          console.error('Unexpected payload structure: ', action.payload);
          // Maintain the current state if the payload is not as expected
        }
        state.error = null;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update cart item quantity";
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = state.cartItems.filter((item) => item._id !== action.payload.productId);
        state.error = null;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to delete cart item";
      });
    },
  });
  
  export default shoppingCartSlice.reducer;