import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api'; // Adjust the path to your API service
import { SellerOrderItem, SellerOrderHistoryItem, SellerOrderState } from './type'; // Import the types

// Define the initial state for the slice
const initialState: SellerOrderState = {
  sellerOrders: [],
  orderHistory: [],
  loading: false,
  error: null,
};

// Fetch seller orders
export const fetchSellerOrders = createAsyncThunk<SellerOrderItem[], void, { rejectValue: string }>(
  'sellerOrder/fetchSellerOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/seller/orders'); // Assuming this also returns refund requests as part of seller orders
      return response.data.orders;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch seller orders';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch seller order history
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

// Update shipping status
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

// Process refund action (approve or reject)
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
        console.log(state.orderHistory);
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
