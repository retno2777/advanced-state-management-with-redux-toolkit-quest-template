import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { CreateProductResponse, ProductState, ProductResponse, Product } from './types';

// Async thunk untuk create product dengan FormData
export const createProduct = createAsyncThunk<CreateProductResponse, FormData>(
  'products/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateProductResponse>(
        '/seller/products',
        formData // Kirim FormData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk get all products
export const getProducts = createAsyncThunk<ProductResponse>(
  'products/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ProductResponse>('/seller/products');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk get limited products
export const getLimitedProducts = createAsyncThunk<ProductResponse>(
  'products/getLimited',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ProductResponse>('/auth/view-products');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk mendapatkan produk berdasarkan id
export const getProductById = createAsyncThunk<Product, number>(
  'products/getById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get<Product>(`/seller/products/${productId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk memperbarui produk
export const updateProduct = createAsyncThunk<
  CreateProductResponse,
  { id: number, formData: FormData }
>(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put<CreateProductResponse>(
        `/seller/products/${id}`,
        formData // Kirim FormData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk menghapus produk berdasarkan ID
export const deleteProduct = createAsyncThunk<
  { message: string, ok: boolean }, // Return value dari thunk jika berhasil
  number, // Parameter yang diterima oleh thunk (productId)
  { rejectValue: string } // Optional reject value
>(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.delete<{ message: string, ok: boolean }>(
        `/seller/products/${productId}`
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk untuk mendapatkan produk berdasarkan shopper
export const getProductsByShopper = createAsyncThunk<ProductResponse>(
  'products/getByShopper',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ProductResponse>('/shopper/products');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState: ProductState = {
  message: '',
  loading: false,
  error: null,
  products: [],
  selectedProduct: null,
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.message = '';
      state.loading = false;
      state.error = null;
      state.products = [];
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product lifecycle
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Get products lifecycle
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Get limited products lifecycle
      .addCase(getLimitedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLimitedProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.loading = false;
      })
      .addCase(getLimitedProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Get product by ID lifecycle
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Update product lifecycle
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Delete product lifecycle
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.meta.arg);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Get products by shopper lifecycle
      .addCase(getProductsByShopper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByShopper.fulfilled, (state, action) => {
        state.products = action.payload.products; // Simpan produk dari shopper
        state.loading = false;
      })
      .addCase(getProductsByShopper.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Export reducer dan actions
export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
