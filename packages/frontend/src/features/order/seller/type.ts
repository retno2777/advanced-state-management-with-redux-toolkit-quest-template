/**
 * This file contains the type definition for the seller order state and order items.
 */
export interface Product {
  id: number;
  productName: string;
  price: number;
  productImage: string | null;
}


export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  totalAmount: number;
  product: Product;
}


export interface SellerOrderItem {
  id: number;
  orderDate: string;
  shippingStatus: string;
  paymentStatus: string;
  orderItem: OrderItem;
}

export interface SellerOrderHistoryItem {
  id: number;
  orderDate: string;
  productDetails: {
    name: string;
    description: string;
    price: number;
    productImage: string | null;
  };
  shopper: {
    name: string;
    email: string;
  };
}
export interface RefundRequestItem {
  id: number;
  productName: string;
  totalAmount: number;
  orderDate: string;
  shippingStatus: string;
}

export interface SellerOrderState {
  sellerOrders: SellerOrderItem[];
  orderHistory: SellerOrderHistoryItem[];
  refundRequests: RefundRequestItem[];
  loading: boolean;
  error: string | null;
}
