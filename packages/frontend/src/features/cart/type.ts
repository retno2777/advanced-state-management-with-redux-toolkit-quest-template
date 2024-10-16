export interface CartItem {
  productId: number;
  quantity: number;
  productName?: string;
  price?: number;
  productImage?: string;
}

export interface CartState {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
}
