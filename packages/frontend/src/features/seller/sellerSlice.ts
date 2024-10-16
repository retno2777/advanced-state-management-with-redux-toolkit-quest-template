import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { SellerProfile, SellerState, UpdateSellerProfileRequest } from './types';
import { RootState } from '../../app/store'; 

/**
 * Seller feature slice
 *
 * This file contains the seller feature slice. It defines the initial state,
 * reducers, and async thunks for the seller feature.
 *
 * The slice is used to manage the state of the seller's profile. It will store
 * the seller's information and the loading state. It will also handle the
 * actions that are dispatched by the async thunks.
 *
 * The async thunks are used to handle the communication with the API. They will
 * handle the requests and responses for the load seller profile and update
 * seller profile actions.
 *
 * The reducers are used to update the state of the slice. They will handle the
 * actions that are dispatched by the async thunks.
 */

// Initial state
const initialState: SellerState = {
  profile: null,
  loading: false,
  error: null,
};

/**
 * Async thunk for loading seller profile
 *
 * This thunk is used to load seller profile from the API. It will handle the request
 * and response for the load seller profile action.
 *
 * @returns {Promise<SellerProfile>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const loadSellerProfile = createAsyncThunk<SellerProfile, void, { state: RootState }>(
  'seller/loadProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await api.get('/seller/profile');
      const sellerProfile = response.data.seller;

      const state: RootState = getState();
      const isActive = state.auth.user?.isActive ?? false;

      return {
        ...sellerProfile,
        active: isActive,
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for updating seller profile
 *
 * This thunk is used to update seller profile to the API. It will handle the request
 * and response for the update seller profile action.
 *
 * @param {UpdateSellerProfileRequest} formData - The form data for update seller profile request.
 * @returns {Promise<SellerProfile>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const updateSellerProfile = createAsyncThunk<SellerProfile, UpdateSellerProfileRequest, { state: RootState }>(
  'seller/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.put('/seller/profile', formData);
      if (!response.data || !response.data.seller) {
        throw new Error('Invalid server response');
      }
      return response.data.seller;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for deleting seller profile from the API.
 *
 * This thunk is used to delete seller profile from the API. It will handle the request
 * and response for the delete seller profile action.
 *
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const deleteSellerProfile = createAsyncThunk<void, void, { state: RootState }>(
  'seller/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/seller/profile');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for changing seller password
 *
 * This thunk is used to change seller password. It will handle the request
 * and response for the change seller password action.
 *
 * @param {string} oldPassword - The old password of the seller.
 * @param {string} newPassword - The new password of the seller.
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const changeSellerPassword = createAsyncThunk<void, { oldPassword: string, newPassword: string }, { state: RootState }>(
  'seller/changePassword',
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await api.put('/seller/change-password', { oldPassword, newPassword });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for changing seller email
 *
 * This thunk is used to change seller email. It will handle the request
 * and response for the change seller email action.
 *
 * @param {string} currentEmail - The current email of the seller.
 * @param {string} newEmail - The new email of the seller.
 * @param {string} password - The password of the seller.
 * @returns {Promise<void>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const changeSellerEmail = createAsyncThunk<void, { currentEmail: string, newEmail: string, password: string }, { state: RootState }>(
  'seller/changeEmail',
  async ({ currentEmail, newEmail, password }, { rejectWithValue }) => {
    try {
      await api.put('/seller/change-email', { currentEmail, newEmail, password });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Seller slice
const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    resetProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Load Profile
    builder.addCase(loadSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loadSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(loadSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    builder.addCase(updateSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Profile
    builder.addCase(deleteSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(deleteSellerProfile.fulfilled, (state) => {
      state.loading = false;
      state.profile = null;
    });

    builder.addCase(deleteSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change password 
    builder.addCase(changeSellerPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(changeSellerPassword.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(changeSellerPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change email 
    builder.addCase(changeSellerEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(changeSellerEmail.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(changeSellerEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export reducer and actions
export const { resetProfile } = sellerSlice.actions;
export default sellerSlice.reducer;
