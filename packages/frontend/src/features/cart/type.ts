/**
 * This file contains the type definition for the cart state and cart items.
 */
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
