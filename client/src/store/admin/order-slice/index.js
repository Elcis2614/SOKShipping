// client/src/store/admin/order-slice/index.js 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState  = {
    isLoading : false,
    orderList : [],
    orderDetails : null,
    error: null
}


export const getAllOrdersForAdmin = createAsyncThunk(
    '/order/getAllOrdersForAdmin',
    async (_, {rejectWithValue}) => {
        try {
            //console.log('Fetching orders for user:', userId);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/orders/get`,
                { withCredentials: true }
                );
                return response.data;
            } catch (error) {
                console.error('Capture payment error:', error.response || error);
                return rejectWithValue(error.response?.data || { message: "An error occurred" });
            }
        }
        );
        
export const getOrderDetailsForAdmin = createAsyncThunk(
    '/order/getOrderDetailsForAdmin',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/admin/orders/details/${id}`,
                );
                return response.data;
            } catch (error) {
                console.error('Error fetching order details:', error.response || error);
                return rejectWithValue(error.response?.data || { message: "An error occurred while fetching order details" });
            }
        }
        );
            
export const updateOrderStatus = createAsyncThunk(
    '/order/updateOrderStatus',
    async ({id, orderStatus}, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/admin/orders/update/${id}`,
                {
                    orderStatus
                },
                { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'application/json' }
                }
                );
                return response.data;
            } catch (error) {
                console.error('Error fetching order details:', error.response || error);
                return rejectWithValue(error.response?.data || { message: "An error occurred while fetching order details" });
            }
        }
        );
            
const adminOrderSlice = createSlice({
    name : 'adminOrderSlice',
    initialState,
    reducers : {
        resetOrderDetails : (state) => {
            state.orderDetails = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
        })
        .addCase(getAllOrdersForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderList = []
        }).addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
            // console.log("Order details received in Redux:", action.payload.data);
        })
        .addCase(getOrderDetailsForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null;
        })
    },
    
});

export const {resetOrderDetails} = adminOrderSlice.actions;
            
export default adminOrderSlice.reducer;
                
                