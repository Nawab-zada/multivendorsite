import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/authSlice";
import cartReducer from "./features/cartSlice";
import checkoutReducer from "./features/checkoutSlice";
import orderReducer from "./features/orderSlice";
import productReducer from "./features/productSlice";
import productDetailsReducer from "./features/productDetailsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    products: productReducer,
    productDetails: productDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
