import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Adjust the path to your API service
import { CartItem, CartState } from './type'; // Import types

// Initial state for the cart
const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

// Async thunk for adding a product to the cart
export const addItemToCart = createAsyncThunk<CartItem, { productId: number; quantity: number }, { rejectValue: string }>(
  'cart/addItemToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await api.post('shopper/cart/add', { productId, quantity });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add product to cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for reducing the quantity of an item in the cart
export const reduceItemInCart = createAsyncThunk<CartItem, { productId: number }, { rejectValue: string }>(
  'cart/reduceItemInCart',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.post('shopper/cart/reduce', { productId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to reduce product quantity';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for removing an item from the cart
export const removeItemFromCart = createAsyncThunk<{ productId: number }, { productId: number }, { rejectValue: string }>(
  'cart/removeItemFromCart',
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await api.post('shopper/cart/remove', { productId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove product from cart';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for viewing the cart
export const viewCart = createAsyncThunk<CartItem[], void, { rejectValue: string }>(
  'cart/viewCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('shopper/cart');
      return response.data.cartItems;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to retrieve cart items';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for checking out selected items
// Thunk untuk checkout
export const checkoutSelectedItems = createAsyncThunk<
  { message: string },
  { productIds: number[], singleProductId?: number, singleProductQuantity?: number },
  { rejectValue: string }
>(
  'cart/checkoutSelectedItems',
  async ({ productIds, singleProductId, singleProductQuantity }, { rejectWithValue }) => {
    try {
      // Buat body request tergantung apakah ada productIds atau singleProductId
      const requestBody = productIds.length > 0
        ? { productIds } // Jika ada productIds, checkout dari keranjang
        : { singleProductId, singleProductQuantity }; // Jika tidak, checkout langsung satu produk

      // Panggil API untuk checkout
      const response = await api.post('shopper/checkout', requestBody);

      return response.data; // Berhasil checkout, return response
    } catch (error: any) {
      // Handle error dari server
      const errorMessage = error.response?.data?.message || error.message || 'Failed to checkout selected items';
      return rejectWithValue(errorMessage);
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reset cart state
    resetCartState: (state) => {
      state.cartItems = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        const existingItemIndex = state.cartItems.findIndex(item => item.productId === action.payload.productId);
        if (existingItemIndex >= 0) {
          // If the product already exists in the cart, update the quantity
          state.cartItems[existingItemIndex].quantity += action.payload.quantity;
        } else {
          // Otherwise, add the new item to the cart
          state.cartItems.push(action.payload);
        }
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reduce item in cart
      .addCase(reduceItemInCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reduceItemInCart.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cartItems.findIndex(item => item.productId === action.payload.productId);
        if (index !== -1 && action.payload.quantity > 0) {
          state.cartItems[index].quantity = action.payload.quantity;
        }
      })
      .addCase(reduceItemInCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(item => item.productId !== action.meta.arg.productId);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // View cart
      .addCase(viewCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(viewCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(viewCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Checkout selected items
      .addCase(checkoutSelectedItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutSelectedItems.fulfilled, (state, action) => {
        state.loading = false;
        // Clear cart after checkout
        state.cartItems = state.cartItems.filter(item => !action.meta.arg.productIds.includes(item.productId));
      })
      .addCase(checkoutSelectedItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
