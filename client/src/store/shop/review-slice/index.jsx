// client/src/store/review-slice/index.jsx 

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

// for post addReview
export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
        formdata,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add review');
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || {
        success: false,
        message: error.message || 'Failed to add review'
      });
    }
  }
);

// for get getReiviews 
export const getReviews = createAsyncThunk("shop/getReviews", 
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`,
        { withCredentials: true }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch reviews');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || {
        success: false,
        message: error.message || 'Failed to fetch reviews'
      });
    }
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Reviews
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.error = null;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.reviews = [];
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally add the new review to the existing reviews
        if (action.payload.data) {
          state.reviews.unshift(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add review';
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;

