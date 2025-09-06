// client/src/store/common-slice/index.js 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  error: null
};

export const getFeatureImages = createAsyncThunk(
  'common/getFeatureImages',
  async (_,{rejectWithValue}) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/common/feature/get`,
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get features');
      }
      return response.data;
    } catch (error) {
      console.error('Get Feature error:', error);
      return rejectWithValue({
        message: error.response?.data?.message || error.message || "Failed to get feature images"
      });
    }
  }
);

export const addFeatureImage = createAsyncThunk(
    'common/addFeatureImage',
    async (imageData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
                { image: imageData },
                {
                    withCredentials: true,
                }
            );

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to add feature');
            }

            return response.data;
        } catch (error) {
            console.error('Add Feature error:', error);
            return rejectWithValue({
                message: error.response?.data?.message || error.message || "Failed to add feature image"
            });
        }
    }
);

export const deleteFeatureImage = createAsyncThunk(
  'common/deleteFeatureImage',
  async (imageId, { rejectWithValue }) => {
      try {
          const response = await axios.delete(
              `${import.meta.env.VITE_API_URL}/api/common/feature/delete/${imageId}`,
              {
                  withCredentials: true,
              }
          );

          if (!response.data.success) {
              throw new Error(response.data.message || 'Failed to delete feature');
          }

          return { success: true, imageId };
      } catch (error) {
          console.error('Delete Feature error:', error);
          return rejectWithValue({
              message: error.response?.data?.message || error.message || "Failed to delete feature image"
          });
      }
  }
);

const commonSlice = createSlice({
    name: 'commonFeature',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFeatureImages.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getFeatureImages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = action.payload.data;
                state.error = null;
            })
            .addCase(getFeatureImages.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.featureImageList = [];
            })
            .addCase(addFeatureImage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addFeatureImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featureImageList = [...state.featureImageList, action.payload.data];
                state.error = null;
            })
            .addCase(addFeatureImage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'An error occurred';
            })
            .addCase(deleteFeatureImage.pending, (state) => {
              state.isLoading = true;
              state.error = null;
          })
          .addCase(deleteFeatureImage.fulfilled, (state, action) => {
              state.isLoading = false;
              state.featureImageList = state.featureImageList.filter(
                  image => image._id !== action.payload.imageId
              );
              state.error = null;
          })
          .addCase(deleteFeatureImage.rejected, (state, action) => {
              state.isLoading = false;
              state.error = action.payload?.message || 'An error occurred';
          });
    }
});

export default commonSlice.reducer;
