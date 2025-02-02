// client/src/store/store.jsx 

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from './admin/products-slice';
import adminOrderSlice from './admin/order-slice';


import shopProductsSlice from './shop/products-slice'; // Corrected import path
import shopCartSlice from './shop/cart-slice';
import shopAddressSlice from './shop/address-slice';
import shopOrderSlice from './shop/order-slice';
import shopSearchSlice from './shop/search-slice';
import shopReviewSlice from './shop/review-slice';

import commonFeatureSlice from './common-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        
        AdminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        
        shopProducts: shopProductsSlice,   // Correctly named
        shopCart: shopCartSlice,           // Added this slice
        shopAddress : shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,
        
        commonFeature: commonFeatureSlice, 
    }
})

export default store;
