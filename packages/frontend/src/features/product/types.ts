/**
 * This file contains the type definition for the product state and product item.
 *
 * The definitions include the type for the product item and product state.
 * The product item type contains the id, product name, price, stock, description, expiry date, and product image.
 * The product state type contains the message, loading, error, products, and selected product.
 */

// Interface for Product
export interface Product {
  id: number;
  productName: string;
  price: number;
  stock: number;
  description: string;
  expiryDate: string | null;
  productImage: string | null;
}

// Interface for response dari getProducts
export interface ProductResponse {
  products: Product[];
}

// Interface for ProductState di Redux store
export interface ProductState {
  message: string;
  loading: boolean;
  error: string | null;
  products: Product[];
  selectedProduct: Product | null;
}

// Interface for Create Product Response
export interface CreateProductResponse {
  message: string;
}
