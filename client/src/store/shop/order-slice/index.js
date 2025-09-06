// client/src/ store/shop/order-slice/index,js 

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    approvalURL : null,
    isLoading : false,
    orderId : null,
    orderList : [],
    orderDetails : null
};

// Async action to create a new order
export const createNewOrder = createAsyncThunk(
    '/order/createNewOrder',
    async (orderData) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
                orderData
            );
            // console.log("Response from server:", response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "An error occurred");
        }
    }
);

// Async action to capture order
export const capturePayment = createAsyncThunk(
    '/order/capturePayment',
    async ({ paymentId, payerId, orderId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
                { paymentId, payerId, orderId }
            );
            return response.data;
        } catch (error) {
            console.error('Capture payment error:', error.response || error);
            return rejectWithValue(error.response?.data || { message: "An error occurred" });
        }
    }
);

export const getAllOrdersByUserId = createAsyncThunk(
    '/order/getAllOrdersByUserId',
    async (userId, {rejectWithValue}) => {
        try {
            //console.log('Fetching orders for user:', userId);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error('Capture payment error:', error.response || error);
            return rejectWithValue(error.response?.data || { message: "An error occurred" });
        }
    }
);

export const getOrderDetails = createAsyncThunk(
    '/order/getOrderDetails',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`,
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error.response || error);
            return rejectWithValue(error.response?.data || { message: "An error occurred while fetching order details" });
        }
    }
);


const shoppingOrderSlice = createSlice({
    name: 'shoppingOrderSlice',
    initialState,
    reducers :{
        resetOrderDetails : (state) => {
            state.orderDetails = null 
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createNewOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createNewOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.approvalURL = action.payload.approvalURL;  
                state.orderId = action.payload.orderId;  
                sessionStorage.setItem(
                    "currentOrderId",
                    JSON.stringify(action.payload.orderId)
                )
            })
            .addCase(createNewOrder.rejected, (state) => {
            // Should be false, as the request failed
                state.isLoading = false;  
                state.approvalURL = null;
                state.orderId = null;
            })
            .addCase(getAllOrdersByUserId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderList = action.payload.data;

            })
            .addCase(getAllOrdersByUserId.rejected, (state) => {
                state.isLoading = false;
                state.orderList = []
            }).addCase(getOrderDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOrderDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderDetails = action.payload.data;
                // console.log("Order details received in Redux:", action.payload.data);
            })
            .addCase(getOrderDetails.rejected, (state) => {
                state.isLoading = false;
                state.orderDetails = null;
            })
    },
})

export const {resetOrderDetails} = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;