import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';
import { SellerOrderItem, SellerOrderHistoryItem, SellerOrderState } from './type';

/**
 * Seller Order Slice
 *
 * This file contains the seller order slice. It defines the initial state,
 * reducers, and async thunks for the seller order feature.
 *
 * The slice is used to manage the state of the seller's orders. It will store
 * the list of orders and the order history. It will also handle the actions
 * that are dispatched by the async thunks.
 *
 * The async thunks are used to handle the communication with the API. They will
 * handle the requests and responses for the fetch seller orders and fetch
 * order history actions.
 *
 * The reducers are used to update the state of the slice. They will handle the
 * actions that are dispatched by the async thunks.
 */

// Define the initial state for the slice
const initialState: SellerOrderState = {
  sellerOrders: [],
  orderHistory: [],
  loading: false,
  error: null,
};

/**
 * Fetch the list of orders for the seller
 *
 * This async thunk is used to fetch the list of orders for the seller from the API.
 *
 * @returns The list of orders.
 */
export const fetchSellerOrders = createAsyncThunk<SellerOrderItem[], void, { rejectValue: string }>(
  'sellerOrder/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/orders');
      return response.data.orders;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch seller orders';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch the list of order history for the seller
 *
 * This async thunk is used to fetch the list of order history for the seller from the API.
 *
 * @returns The list of order history.
 */
export const fetchSellerOrderHistory = createAsyncThunk<SellerOrderHistoryItem[], void, { rejectValue: string }>(
  'sellerOrder/fetchSellerOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/orders/history');
      return response.data.orderHistory;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch seller order history';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update the shipping status of a seller order
 *
 * This async thunk is used to update the shipping status of a seller order from the API.
 *
 * @param {number} orderId - The ID of the order.
 * @param {string} shippingStatus - The new shipping status.
 * @returns {void}
 */
export const updateShippingStatus = createAsyncThunk<
  void,
  { orderId: number; shippingStatus: string },
  { rejectValue: string }
>(
  'sellerOrder/updateShippingStatus',
  async ({ orderId, shippingStatus }, { rejectWithValue }) => {
    try {
      const response = await api.put('/seller/orders/shipping-status', { orderId, shippingStatus });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update shipping status';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Process refund action for a seller order
 *
 * This async thunk is used to process the refund action (approve or reject) for a seller order from the API.
 *
 * @param {number} orderId - The ID of the order.
 * @param {'approve' | 'reject'} action - The action to take (approve or reject the refund).
 * @returns {void}
 */
export const processRefundAction = createAsyncThunk<
  void,
  { orderId: number; action: 'approve' | 'reject' },
  { rejectValue: string }
>(
  'sellerOrder/processRefundAction',
  async ({ orderId, action }, { rejectWithValue }) => {
    try {
      const response = await api.put('/seller/orders/refund', { orderId, action });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to process refund action';
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSellerSlice = createSlice({
  name: 'sellerOrder',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.sellerOrders = [];
      state.orderHistory = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch seller orders
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch seller order history
    builder
      .addCase(fetchSellerOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchSellerOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update shipping status
    builder
      .addCase(updateShippingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShippingStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateShippingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Process refund action
    builder
      .addCase(processRefundAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processRefundAction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processRefundAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderState } = orderSellerSlice.actions;
export default orderSellerSlice.reducer;
