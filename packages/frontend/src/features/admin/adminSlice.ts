import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
/**
 * Interfaces for admin feature
 *
 * This file contains the interfaces for the admin feature. It defines the
 * interfaces for the seller, shopper, and state.
 *
 * The interfaces are used to type-check the data that is received from the
 * API and to define the shape of the state in the Redux store.
 */
interface Seller {
  id: number;
  name: string;
  storeName: string;
  phoneNumber: string;
  email: string;
  active: boolean;
}

interface Shopper {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  active: boolean;
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

/**
 * Fetch sellers
 *
 * This async thunk is used to fetch the list of all sellers from the API.
 *
 * @returns The list of sellers.
 */
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

/**
 * Fetch shoppers
 *
 * This async thunk is used to fetch the list of all shoppers from the API.
 *
 * @returns The list of shoppers.
 */
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

/**
 * Deactivate user
 *
 * This async thunk is used to deactivate a user with the given email from the API.
 *
 * @param {string} email - The email of the user to deactivate.
 * @returns The response from the API.
 */
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

/**
 * Activate user
 *
 * This async thunk is used to activate a user with the given email from the API.
 *
 * @param {string} email - The email of the user to activate.
 * @returns The response from the API.
 */
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

/**
 * Delete user
 *
 * This async thunk is used to delete a user with the given email and type from the API.
 *
 * @param {{ email: string; userType: 'seller' | 'shopper' }} data - The data for the deletion. It should contain the email and type of the user to delete.
 * @returns The response from the API.
 */
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      state.sellers = null;
      state.shoppers = null;
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
