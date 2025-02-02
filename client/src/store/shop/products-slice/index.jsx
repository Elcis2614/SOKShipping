// client/src/store/shop/products-slice/index.jsx 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
    productDetails: null,
  };

// Async thunk for fetching products with filter and sort parameters
export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {
        try {
            // Construct query parameters for the request
            const query = new URLSearchParams({
                ...filterParams,
                sortBy: sortParams,
            });

            // Make the GET request with query parameters
            //const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/get?${query}`);
            const result = await axios.get(`http://localhost:5001/api/shop/products/get?${query}`);
            // Return the data in the correct format
            return result.data; 
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const req = `http://localhost:5001/api/shop/products/get/${id}`;
      const result = await axios.get(req);
      // Return the actual product data
      return result.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }
);

  
// Slice for shopping products
const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
      setProductDetails: (state, action) => {
        state.productDetails = action.payload;
      },
    },
    
    extraReducers: (builder) => {
      builder
        .addCase(fetchAllFilteredProducts.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.productList = action.payload.data;
        })
        .addCase(fetchAllFilteredProducts.rejected, (state) => {
          state.isLoading = false;
          state.productList = [];
        })
        .addCase(fetchProductDetails.pending, (state) => {
          state.isLoading = true;
          state.productDetails = null;
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
          state.isLoading = false;
          state.productDetails = action.payload;
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
          console.error("fetchProductDetails.rejected with error:", action.error);
          state.isLoading = false;
          state.productDetails = null;
        });
    },
  });
  
  export const { setProductDetails } = shoppingProductSlice.actions;   // will stop product dialog poping on the listing for the first place
  
  export default shoppingProductSlice.reducer;