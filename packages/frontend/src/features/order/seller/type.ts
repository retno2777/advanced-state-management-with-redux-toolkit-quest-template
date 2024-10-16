// Tipe untuk produk dalam pesanan
export interface Product {
    id: number;
    productName: string;
    price: number;
    productImage: string | null;
  }
  
  // Tipe untuk item dalam pesanan penjual
  export interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
    totalAmount: number;
    product: Product;
  }
  
  // Tipe untuk pesanan penjual
  export interface SellerOrderItem {
    id: number;
    orderDate: string;
    shippingStatus: string;
    paymentStatus: string;
    orderItem: OrderItem;
  }
  
  // Tipe untuk riwayat pesanan penjual
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
  
  // Tipe untuk permintaan refund
  export interface RefundRequestItem {
    id: number;
    productName: string;
    totalAmount: number;
    orderDate: string;
    shippingStatus: string;
  }
  
  // Tipe untuk state Redux
  export interface SellerOrderState {
    sellerOrders: SellerOrderItem[]; // Daftar pesanan penjual
    orderHistory: SellerOrderHistoryItem[]; // Riwayat pesanan penjual
    refundRequests: RefundRequestItem[]; // Daftar permintaan refund
    loading: boolean; // Status loading
    error: string | null; // Pesan error (jika ada)
  }
  