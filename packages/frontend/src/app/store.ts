import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import sellerReducer from '../features/seller/sellerSlice';
import shopperReducer from '../features/shopper/shopperSlice';
import cartSlice from '../features/cart/cartSlice';
import ordersShopperSlice from '../features/order/shopper/ordersShopperSlice';
import ordersSellerSlice from '../features/order/seller/ordersSellerSlice';
import adminslice from '../features/admin/adminslice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    seller: sellerReducer,
    shopper: shopperReducer,
    cart: cartSlice,
    ordersShopper: ordersShopperSlice,
    ordersSeller: ordersSellerSlice,
    adminslice: adminslice,
  },
  // Uncomment this if you need to add custom middleware
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourCustomMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
