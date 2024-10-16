// Order item interface
export interface OrderItem {
    id: number;
    productId: number;
    orderDate: string;
    quantity: number;
    totalAmount: number;
    shippingStatus: string;
    paymentStatus: string;
    product: {
        id: number;
        productName: string;
        price: number;
        productImage: string | null; // Tetap menyimpan productImage
        // Hapus pictureFormat
    };
}

// Order history interface
export interface OrderHistoryItem {
    id: number;
    orderDate: string;
    quantity: number;
    totalAmount: number;
    shippingStatus: string;
    paymentStatus: string;
    deliveryDate: string;
    sellerName: string;
    storeName: string;
    productName: string;
    productPrice: number;
    productDescription: string;
    productId: number;
    productImage: string | null; // Tetap menyimpan productImage
    // Hapus pictureFormat
}


// Order state interface
export interface OrderState {
    orderItems: OrderItem[];
    orderHistory: OrderHistoryItem[];
    loading: boolean;
    error: string | null;
}
