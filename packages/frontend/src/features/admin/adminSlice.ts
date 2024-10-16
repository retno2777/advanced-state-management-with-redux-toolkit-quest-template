import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Define interfaces for seller, shopper, and state
interface Seller {
  id: number;
  name: string;
  storeName: string;
  phoneNumber: string;
  email: string;
}

interface Shopper {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
}

interface AdminState {
  sellers: Seller[];
  shoppers: Shopper[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Define the initial state for the slice
const initialState: AdminState = {
  sellers: [],
  shoppers: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Fetch sellers
export const fetchSellers = createAsyncThunk<Seller[], void, { rejectValue: string }>(
  'admin/fetchSellers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/sellers');
      return response.data.sellers;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sellers';
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch shoppers
export const fetchShoppers = createAsyncThunk<Shopper[], void, { rejectValue: string }>(
  'admin/fetchShoppers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/shoppers');
      return response.data.shoppers;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch shoppers';
      return rejectWithValue(errorMessage);
    }
  }
);

// Deactivate user
export const deactivateUser = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
  'admin/deactivateUser',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/deactivate-user', { email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to deactivate user';
      return rejectWithValue(errorMessage);
    }
  }
);

// Activate user
export const activateUser = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
  'admin/activateUser',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await api.put('/admin/activate-user', { email });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to activate user';
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete user menggunakan email
export const deleteUser = createAsyncThunk<void, { email: string; userType: 'seller' | 'shopper' }, { rejectValue: string }>(
  'admin/deleteUser',
  async ({ email, userType }, { rejectWithValue }) => {
    try {
      const response = await api.delete('/admin/delete-user', {
        data: { email, userType },
      });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      return rejectWithValue(errorMessage);
    }
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    resetState(state) {
      localStorage.removeItem('token'); // Hapus token dari localStorage
      sessionStorage.removeItem('token'); // Hapus token dari sessionStorage
      localStorage.removeItem('user'); // Hapus user dari localStorage
      sessionStorage.removeItem('user'); // Hapus user dari sessionStorage
      // Reset state ke initialState
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch sellers
    builder
      .addCase(fetchSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.sellers = action.payload;
      })
      .addCase(fetchSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch shoppers
    builder
      .addCase(fetchShoppers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppers.fulfilled, (state, action) => {
        state.loading = false;
        state.shoppers = action.payload;
      })
      .addCase(fetchShoppers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Deactivate user
    builder
      .addCase(deactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deactivateUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'User deactivated successfully';
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Activate user
    builder
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(activateUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'User activated successfully';
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState } = adminSlice.actions;
export default adminSlice.reducer;
