// client/src/store/searchSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  searchMetadata: null,
  error: null
};

export const getSearchResults = createAsyncThunk(
  'shop/getSearchResults',
  async (keyword, { rejectWithValue }) => {
    try {
      //const sanitizedKeyword = keyword?.trim();
      const sanitizedKeyword = keyword;

      if (!sanitizedKeyword) {
        return { 
          success: true, 
          data: [],
          searchMetadata: {
            keyword: '',
            totalResults: 0,
            fields: []
          }
        };
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/search/${sanitizedKeyword}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        }
      );

      console.log('Search API response:', response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Search failed');
      }

      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to search products"
      });
    }
  }
);

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchMetadata = null;
      state.error = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
        state.searchMetadata = action.payload.searchMetadata;
        state.error = null;
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'An error occurred';
        state.searchResults = [];
        state.searchMetadata = null;
      });
  }
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;