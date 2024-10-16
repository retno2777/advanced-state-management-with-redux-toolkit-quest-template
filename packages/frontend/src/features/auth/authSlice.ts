import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import {
  LoginRequest,
  RegisterSellerRequest,
  RegisterShopperRequest,
  RegisterResponse,
  UserResponse,
  AuthState
} from './types';

/**
 * Auth feature slice
 *
 * This file contains the auth feature slice. It defines the initial state, reducers,
 * and async thunks for the auth feature.
 *
 * The slice is used to manage the state of the user's authentication. It will store
 * the user's information and the authentication token. It will also handle the
 * registration of new users and the login of existing users.
 *
 * The async thunks are used to handle the communication with the API. They will
 * handle the requests and responses for the registration and login actions.
 *
 * The reducers are used to update the state of the slice. They will handle the
 * actions that are dispatched by the async thunks.
 */


const initialState: AuthState = {
  user: null,
  token: null,
  error: null,  
};

/**
 * Register a new seller
 */
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

/**
 * Register a new shopper
 */
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

/**
 * Login with an existing user
 */
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

      if (rememberMe) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
      }

      return response.data;
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
      state.error = null;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const { userDetails, token, email, role, isActive } = action.payload;
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
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.error = action.payload as string;  
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(registerShopper.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(registerShopper.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
