import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { CreateProductResponse, ProductState, ProductResponse, Product } from './types';
/**
 * Product feature slice
 *
 * This file contains the product feature slice. It defines the initial state,
 * reducers, and async thunks for the product feature.
 *
 * The slice is used to manage the state of the products. It will store the list
 * of products, the loading state, and the error state. It will also handle the
 * actions that are dispatched by the async thunks.
 *
 * The async thunks are used to handle the communication with the API. They will
 * handle the requests and responses for the create product, get limited products,
 * get product by id, update product, and delete product actions.
 *
 * The reducers are used to update the state of the slice. They will handle the
 * actions that are dispatched by the async thunks.
 */

/**
 * Async thunk for creating a new product
 *
 * This thunk is used to create a new product. It will handle the request
 * and response for the create product action. The request body should
 * contain the product data in the form of a FormData object.
 *
 * @param {FormData} formData - The product data in the form of a FormData object.
 * @param {{rejectValue: string}} thunkAPI - The thunk API.
 * @returns {Promise<CreateProductResponse>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
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

/**
 * Async thunk for getting all products
 *
 * This thunk is used to get all products. It will handle the request
 * and response for the get all products action.
 *
 * @returns {Promise<ProductResponse>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
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

/**
 * Async thunk for getting limited products
 *
 * This thunk is used to get limited products. It will handle the request
 * and response for the get limited products action.
 *
 * @returns {Promise<ProductResponse>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
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

/**
 * Async thunk for getting a product by its ID
 *
 * This thunk is used to get a product by its ID. It will handle the request
 * and response for the get product by ID action.
 *
 * @param {number} productId - The ID of the product.
 * @returns {Promise<Product>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
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

/**
 * Async thunk for updating a product
 *
 * This thunk is used to update a product. It will handle the request
 * and response for the update product action.
 *
 * @param {{id: number, formData: FormData}} data - The data for the update product. It should contain the
 *                                                    product ID and the product data in the form of a FormData
 *                                                    object.
 * @returns {Promise<CreateProductResponse>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const updateProduct = createAsyncThunk<
  CreateProductResponse,
  { id: number, formData: FormData }
>(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put<CreateProductResponse>(
        `/seller/products/${id}`,
        formData
      );
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Async thunk for deleting a product
 *
 * This thunk is used to delete a product. It will handle the request
 * and response for the delete product action.
 *
 * @param {number} productId - The ID of the product to be deleted.
 * @returns {Promise<{ message: string, ok: boolean }>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
export const deleteProduct = createAsyncThunk<
  { message: string, ok: boolean }, 
  number, 
  { rejectValue: string } 
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

/**
 * Async thunk for getting products by shopper
 *
 * This thunk is used to get products by shopper. It will handle the request
 * and response for the get products by shopper action.
 *
 * @returns {Promise<ProductResponse>} The response from the API.
 * @throws {string} An error message if the request fails.
 */
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
        state.products = action.payload.products; 
        state.loading = false;
      })
      .addCase(getProductsByShopper.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Export reducer and actions
export const { resetProductState } = productSlice.actions;
export default productSlice.reducer;
