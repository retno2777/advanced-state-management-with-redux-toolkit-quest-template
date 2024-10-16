import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { ShopperProfile, ShopperState, UpdateShopperProfileRequest } from './types';
import { RootState } from '../../app/store';

/**
 * Shopper slice
 *
 * This file contains the shopper slice. It defines the initial state,
 * reducers, and async thunks for the shopper feature.
 *
 * The slice is used to manage the state of the shopper. It will store
 * the shopper's information and handle the actions that are dispatched
 * by the async thunks.
 *
 * The async thunks are used to handle the communication with the API.
 * They will handle the requests and responses for the load shopper
 * profile and update shopper profile actions.
 *
 * The reducers are used to update the state of the slice. They will handle
 * the actions that are dispatched by the async thunks.
 */

// Initial state for shopper
const initialState: ShopperState = {
  shopper: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for loading shopper profile
 *
 * This thunk is used to load shopper profile from the API. It will handle the request
 * and response for the load shopper profile action.
 *
 * @returns {Promise<ShopperProfile>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const loadShopperProfile = createAsyncThunk<ShopperProfile, void, { state: RootState }>(
  'shopper/loadProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/shopper/profile');
      const shopperProfile = response.data.shopper;

      const state: RootState = getState();
      const isActive = state.auth.user?.isActive ?? false;

      return {
        ...shopperProfile,
        active: isActive,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for updating shopper profile
 *
 * This thunk is used to update shopper profile in the API. It will handle the request
 * and response for the update shopper profile action.
 *
 * @param formData - The form data for update shopper profile request.
 * @returns {Promise<ShopperProfile>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const updateShopperProfile = createAsyncThunk<ShopperProfile, UpdateShopperProfileRequest, { state: RootState }>(
  'shopper/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put('/shopper/profile', formData);
      if (!response.data || !response.data.shopper) {
        throw new Error('Invalid server response');
      }
      return response.data.shopper;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for deleting shopper profile
 *
 * This thunk is used to delete shopper profile from the API. It will handle the request
 * and response for the delete shopper profile action.
 *
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const deleteShopperProfile = createAsyncThunk<void, void, { state: RootState }>(
  'shopper/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/shopper/profile'); // Make sure this is the correct API route
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage); // Return the error message to the calling component
    }
  }
);



/**
 * Async thunk for changing shopper password
 *
 * This thunk is used to change shopper password. It will handle the request
 * and response for the change shopper password action.
 *
 * @param {string} oldPassword - The old password of the shopper.
 * @param {string} newPassword - The new password of the shopper.
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const changeShopperPassword = createAsyncThunk<void, { oldPassword: string, newPassword: string }, { state: RootState }>(
  'shopper/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await api.put('/shopper/change-password', { oldPassword, newPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for changing shopper email
 *
 * This thunk is used to change shopper email. It will handle the request
 * and response for the change shopper email action.
 *
 * @param {string} currentEmail - The current email of the shopper.
 * @param {string} newEmail - The new email of the shopper.
 * @param {string} password - The password of the shopper.
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const changeShopperEmail = createAsyncThunk<void, { currentEmail: string, newEmail: string, password: string }, { state: RootState }>(
  'shopper/changeEmail',
  async ({ currentEmail, newEmail, password }, { rejectWithValue }) => {
    try {
      await api.put('/shopper/change-email', { currentEmail, newEmail, password });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Shopper slice
const shopperSlice = createSlice({
  name: 'shopper',
  initialState,
  reducers: {
    resetShopperState: (state) => {
      state.shopper = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load Profile
      .addCase(loadShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadShopperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopper = action.payload;
      })

      .addCase(loadShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateShopperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopper = action.payload;
      })

      .addCase(updateShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Delete Profile
      .addCase(deleteShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteShopperProfile.fulfilled, (state) => {
        state.loading = false;
        state.shopper = null;
      })

      .addCase(deleteShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change password 
      .addCase(changeShopperPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changeShopperPassword.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changeShopperPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Change email 
      .addCase(changeShopperEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(changeShopperEmail.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(changeShopperEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export reducer and actions
export const { resetShopperState } = shopperSlice.actions;
export default shopperSlice.reducer;
