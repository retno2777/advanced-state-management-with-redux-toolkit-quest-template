import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import {
  LoginRequest,
  RegisterSellerRequest,
  RegisterShopperRequest,
  RegisterResponse,
  UserResponse,
  AuthState
} from './types'; // Mengimpor tipe dari types.ts

// Initial state untuk auth
const initialState: AuthState = {
  user: null,
  token: null,
};

// Async thunk untuk register seller
export const registerSeller = createAsyncThunk<RegisterResponse, RegisterSellerRequest>(
  'auth/registerSeller',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk untuk register shopper
export const registerShopper = createAsyncThunk<RegisterResponse, RegisterShopperRequest>(
  'auth/registerShopper',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post<RegisterResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk untuk login
export const login = createAsyncThunk<UserResponse, LoginRequest>(
  'auth/login',
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await api.post<UserResponse>('/auth/login', { email, password });

      const token = response.data.token;
      const user = {
        role: response.data.role,
        isActive: response.data.isActive
      };

      // Simpan token dan data user di localStorage jika "Remember Me" dipilih, jika tidak, gunakan sessionStorage
      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user)); // Simpan user sebagai JSON
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user)); // Simpan user sebagai JSON
      }

      return response.data;  // Kirim data user dan token ke store
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token'); // Hapus token dari localStorage
      sessionStorage.removeItem('token'); // Hapus token dari sessionStorage
      localStorage.removeItem('user'); // Hapus user dari localStorage
      sessionStorage.removeItem('user'); // Hapus user dari sessionStorage
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { userDetails, token, email, role, isActive } = action.payload;

        // Menyimpan token, user ID, email, dan role ke dalam state Redux
        state.token = token;
        state.user = {
          id: userDetails.id,
          name: userDetails.name,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          email: email,
          role: role,
          isActive: isActive,
          phoneNumber: userDetails.phoneNumber,
          address: userDetails.address,
          birthDay: userDetails.birthDay,
        };
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.token = null;
      })
      // Menangani hasil sukses dari register seller
      .addCase(registerSeller.fulfilled, (state, action) => {
        // Jika diperlukan, tambahkan logika setelah register seller berhasil
      })
      // Menangani hasil sukses dari register shopper
      .addCase(registerShopper.fulfilled, (state, action) => {
        // Jika diperlukan, tambahkan logika setelah register shopper berhasil
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
