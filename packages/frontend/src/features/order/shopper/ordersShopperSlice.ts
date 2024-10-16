import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api'; // Sesuaikan path ke layanan API
import { OrderItem, OrderHistoryItem, OrderState } from './type'; // Import tipe

const initialState: OrderState = {
  orderItems: [],
  orderHistory: [],
  loading: false,
  error: null,
};

// Fetch order items
export const fetchOrderItems = createAsyncThunk<OrderItem[], void, { rejectValue: string }>(
  'order/fetchOrderItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shopper/orders');
      return response.data.orderItems.map((item: OrderItem) => ({
        ...item,
        product: {
          ...item.product,
          productImage: item.product.productImage,
        },
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch order items';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch order history
export const fetchOrderHistory = createAsyncThunk<OrderHistoryItem[], void, { rejectValue: string }>(
  'order/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shopper/order-history');
      return response.data.orderHistory.map((item: OrderHistoryItem) => ({
        ...item,
        productImage: item.productImage,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch order history';
      return rejectWithValue(errorMessage);
    }
  }
);

// Simulate payment
export const simulatePayment = createAsyncThunk<void, { orderId: number }, { rejectValue: string }>(
  'order/simulatePayment',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/shopper/simulate-payment', { orderId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to process payment';
      return rejectWithValue(errorMessage);
    }
  }
);

// Request cancellation or refund
export const requestCancellationOrRefund = createAsyncThunk<
  void,
  { orderId: number },
  { rejectValue: string }
>(
  'order/requestCancellationOrRefund',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/shopper/request-cancellation', { orderId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to request cancellation or refund';
      return rejectWithValue(errorMessage);
    }
  }
);
// Confirm order receipt
export const confirmOrderReceipt = createAsyncThunk<void, { orderId: number }, { rejectValue: string }>(
  'order/confirmOrderReceipt',
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/shopper/confirm-order', { orderId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to confirm order receipt';
      return rejectWithValue(errorMessage);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.orderItems = [];
      state.orderHistory = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch order items
    builder
      .addCase(fetchOrderItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItems.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItems = action.payload;
      })
      .addCase(fetchOrderItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch order history
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.orderHistory = action.payload;
        console.log(state.orderHistory);
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Simulate payment
    builder
      .addCase(simulatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulatePayment.fulfilled, (state, action) => {
        state.loading = false;
        const orderId = action.meta.arg.orderId;
        const orderItem = state.orderItems.find(item => item.id === orderId);
        if (orderItem) {
          orderItem.paymentStatus = 'Paid';  // Perbarui status pembayaran
        }
      })
      .addCase(simulatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Request cancellation or refund
    builder
      .addCase(requestCancellationOrRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestCancellationOrRefund.fulfilled, (state, action) => {
        state.loading = false;
        const orderId = action.meta.arg.orderId;
        const orderItem = state.orderItems.find(item => item.id === orderId);
        if (orderItem) {
          orderItem.shippingStatus = 'Refund Requested';  // Perbarui status pengiriman
        }
      })
      .addCase(requestCancellationOrRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Confirm order receipt
    builder
      .addCase(confirmOrderReceipt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrderReceipt.fulfilled, (state, action) => {
        state.loading = false;
        const orderId = action.meta.arg.orderId;
        const orderItem = state.orderItems.find(item => item.id === orderId);
        if (orderItem) {
          orderItem.shippingStatus = 'Delivered';  // Perbarui status pengiriman
        }
      })
      .addCase(confirmOrderReceipt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;