import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Ganti dengan path API service yang Anda gunakan
import { ShopperProfile, ShopperState, UpdateShopperProfileRequest } from './types'; // Import types
import { RootState } from '../../app/store'; // Import RootState untuk akses state autentikasi

// Initial state untuk shopper
const initialState: ShopperState = {
  shopper: null,
  loading: false,
  error: null,
};

// Async thunk untuk mengambil data shopper dari API
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

// Thunk untuk memperbarui profil shopper di API
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

// Thunk untuk menghapus profil shopper di API
export const deleteShopperProfile = createAsyncThunk<void, void, { state: RootState }>(
  'shopper/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/shopper/profile');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk untuk memperbarui password shopper di API
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

// Thunk untuk memperbarui email shopper di API
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
      // Saat profile sedang dimuat
      .addCase(loadShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Saat profile berhasil dimuat
      .addCase(loadShopperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopper = action.payload;
      })
      // Saat terjadi error dalam pemuatan profile
      .addCase(loadShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Saat profile sedang di-update
      .addCase(updateShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Saat profile berhasil di-update
      .addCase(updateShopperProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.shopper = action.payload;
      })
      // Saat terjadi error dalam update profile
      .addCase(updateShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Saat profile sedang dihapus
      .addCase(deleteShopperProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Saat profile berhasil dihapus
      .addCase(deleteShopperProfile.fulfilled, (state) => {
        state.loading = false;
        state.shopper = null;
      })
      // Saat terjadi error dalam menghapus profile
      .addCase(deleteShopperProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change password lifecycle
      .addCase(changeShopperPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Saat password berhasil diubah
      .addCase(changeShopperPassword.fulfilled, (state) => {
        state.loading = false;
      })
      // Saat terjadi error dalam change password
      .addCase(changeShopperPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Change email lifecycle
      .addCase(changeShopperEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Saat email berhasil diubah
      .addCase(changeShopperEmail.fulfilled, (state) => {
        state.loading = false;
      })
      // Saat terjadi error dalam change email
      .addCase(changeShopperEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export reducer dan actions
export const { resetShopperState } = shopperSlice.actions;
export default shopperSlice.reducer;
