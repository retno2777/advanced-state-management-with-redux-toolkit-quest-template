import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { SellerProfile, SellerState, UpdateSellerProfileRequest } from './types'; // Import types
import { RootState } from '../../app/store'; // Import RootState untuk akses state autentikasi

// Initial state
const initialState: SellerState = {
  profile: null,
  loading: false,
  error: null,
};

// Thunk untuk memuat profil seller dari API
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

// Thunk untuk memperbarui profil seller di API
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

// Thunk untuk menghapus profil seller di API
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

// Thunk untuk memperbarui password seller di API
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

// Thunk untuk memperbarui email seller di API
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
    // Saat profile sedang dimuat
    builder.addCase(loadSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Saat profile berhasil dimuat
    builder.addCase(loadSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    // Saat terjadi error dalam pemuatan profile
    builder.addCase(loadSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Saat profile sedang di-update
    builder.addCase(updateSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Saat profile berhasil di-update
    builder.addCase(updateSellerProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });

    // Saat terjadi error dalam update profile
    builder.addCase(updateSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Saat profile sedang dihapus
    builder.addCase(deleteSellerProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Saat profile berhasil dihapus
    builder.addCase(deleteSellerProfile.fulfilled, (state) => {
      state.loading = false;
      state.profile = null;
    });

    // Saat terjadi error dalam menghapus profile
    builder.addCase(deleteSellerProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change password lifecycle
    builder.addCase(changeSellerPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Saat password berhasil diubah
    builder.addCase(changeSellerPassword.fulfilled, (state) => {
      state.loading = false;
    });

    // Saat terjadi error dalam change password
    builder.addCase(changeSellerPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Change email lifecycle
    builder.addCase(changeSellerEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Saat email berhasil diubah
    builder.addCase(changeSellerEmail.fulfilled, (state) => {
      state.loading = false;
    });

    // Saat terjadi error dalam change email
    builder.addCase(changeSellerEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export reducer dan actions
export const { resetProfile } = sellerSlice.actions;
export default sellerSlice.reducer;
