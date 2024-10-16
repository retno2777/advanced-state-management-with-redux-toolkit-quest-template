// Interface untuk Product
export interface Product {
  id: number;
  productName: string;
  price: number;
  stock: number;
  description: string;
  expiryDate: string | null;
  productImage: string | null;
}

// Interface untuk response dari getProducts
export interface ProductResponse {
  products: Product[];
}

// Interface untuk ProductState di Redux store
export interface ProductState {
  message: string;
  loading: boolean;
  error: string | null;
  products: Product[]; // Daftar produk
  selectedProduct: Product | null; // Produk yang dipilih untuk update
}
// Interface untuk Create Product Response
export interface CreateProductResponse {
  message: string;
}
