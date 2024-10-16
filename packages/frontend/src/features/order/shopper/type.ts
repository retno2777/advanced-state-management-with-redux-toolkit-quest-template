/**
 * This file contains the type definition for the shopper order state and order items.
 *
 * The definitions include the type for the order item and order history.
 * The order item type contains the id, product id, order date, quantity, total amount, shipping status, payment status, and product details.
 * The order history type contains the id, order date, quantity, total amount, shipping status, payment status, delivery date, seller name, store name, product name, product price, product description, and product id.
 */

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
        productImage: string | null;
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
    productImage: string | null;
}


// Order state interface
export interface OrderState {
    orderItems: OrderItem[];
    orderHistory: OrderHistoryItem[];
    loading: boolean;
    error: string | null;
}
