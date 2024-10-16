import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { SellerModel } from "../../../models/SellerModel.js";
import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { ProductModel } from "../../../models/ProductModel.js";  // Added ProductModel for handling images
import { OrderHistorySellerModel } from "../../../models/OrderHistorySellerModel.js";  // Added OrderHistorySeller model
import { ShopperModel } from "../../../models/ShopperModel.js";
import { UserModel } from "../../../models/UserModel.js";
// Function to convert image buffer to Base64
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

// Function to view all orders belonging to a seller
const getSellerOrders = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from the logged-in user's token

        // Retrieve the sellerId from SellerModel using userId
        const seller = await SellerModel.findOne({
            where: { userId },  // Find the seller by userId in SellerModel
        });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        const sellerId = seller.id;  // Get the sellerId from the found seller

        // Retrieve all seller orders from SellerOrderModel manually using sellerId
        const sellerOrders = await SellerOrderModel.findAll({
            where: { sellerId }
        });

        if (sellerOrders.length === 0) {
            return res.status(404).json({ message: "No orders found", ok: false });
        }

        const ordersWithDetails = [];

        // Loop through each seller order
        for (const sellerOrder of sellerOrders) {
            // Retrieve the related order item
            const orderItem = await OrderItemModel.findOne({
                where: { id: sellerOrder.shopperOrderId }
            });

            if (!orderItem) {
                continue; // Skip this order if order item not found
            }

            // Retrieve the related product for each order item
            const product = await ProductModel.findOne({
                where: { id: orderItem.productId },
                attributes: ['id', 'productName', 'price', 'productImage', 'pictureFormat']  // Only retrieve necessary fields
            });

            // Convert product image to base64 format
            const base64Image = product?.productImage ? convertImageToBase64(product.productImage) : null;

            // Construct the response data
            const orderDetails = {
                ...sellerOrder.toJSON(),
                orderItem: {
                    ...orderItem.toJSON(),
                    product: product ? {
                        ...product.toJSON(),
                        productImage: base64Image ? `data:${product.pictureFormat};base64,${base64Image}` : null
                    } : null
                }
            };

            ordersWithDetails.push(orderDetails);
        }

        return res.status(200).json({
            message: "Seller orders retrieved successfully",
            orders: ordersWithDetails,
            ok: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error while retrieving orders", ok: false });
    }
};


// Function to update shipping status by seller
const updateShippingStatus = async (req, res) => {
    try {
        const { orderId, shippingStatus } = req.body;  // Retrieve orderId and shippingStatus from the request
        const sellerIdFromToken = req.user.userId;  // Retrieve sellerId from the logged-in user's token

        // Step 1: Retrieve the seller from SellerModel
        const seller = await SellerModel.findOne({
            where: { userId: sellerIdFromToken }  // Assuming userId is the field in SellerModel that references the user
        });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        // Step 2: Retrieve the order from SellerOrderModel
        const order = await SellerOrderModel.findOne({
            where: { id: orderId, sellerid: seller.id }
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found", ok: false });
        }

        // Step 3: Retrieve related order item from OrderItemModel
        const orderItem = await OrderItemModel.findOne({
            where: { id: order.shopperOrderId }  // Assuming orderId in OrderItemModel refers to the order
        });

        if (!orderItem) {
            return res.status(404).json({ message: "Order item not found", ok: false });
        }

        // Step 4: Update shipping status in both models
        order.shippingStatus = shippingStatus;  // Update in SellerOrderModel
        await order.save();

        orderItem.shippingStatus = shippingStatus;  // Update in OrderItemModel
        await orderItem.save();

        return res.status(200).json({
            message: `Shipping status updated to ${shippingStatus} in both order and order item`,
            order,
            orderItem,
            ok: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error while updating shipping status", ok: false });
    }
};
// Function to view all order history belonging to a seller
const getSellerOrderHistory = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from the logged-in user's token

        // Cari sellerId berdasarkan userId dari UserModel melalui SellerModel
        const seller = await SellerModel.findOne({ where: { userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        const sellerId = seller.id;  // Retrieve sellerId from SellerModel

        // Retrieve all order history records for the seller
        const orderHistoryRecords = await OrderHistorySellerModel.findAll({
            where: { sellerId }
        });

        if (!orderHistoryRecords || orderHistoryRecords.length === 0) {
            return res.status(404).json({ message: "No order history found", ok: false });
        }

        // Fetch product and shopper details for each order history entry
        const orderHistoryWithDetails = await Promise.all(orderHistoryRecords.map(async (history) => {
            // Fetch the associated product details manually
            let productDetails = {};
            let productImage = null;
            let pictureFormat = null;

            if (history.productId) {
                const product = await ProductModel.findOne({ where: { id: history.productId } });
                if (product) {
                    productDetails = {
                        name: product.productName,
                        description: product.description,
                        price: product.price,
                    };
                    productImage = convertImageToBase64(product.productImage);
                    pictureFormat = product.pictureFormat;
                }
            }

            // Fetch the shopper details manually
            let shopperDetails = {};
            if (history.shopperId) {
                const shopper = await ShopperModel.findOne({ where: { id: history.shopperId } });
                if (shopper) {
                    const user = await UserModel.findOne({ where: { id: shopper.userId }, attributes: ['email'] });
                    shopperDetails = {
                        name: `${shopper.firstName} ${shopper.lastName}`,
                        email: user ? user.email : null
                    };
                }
            }

            return {
                id: history.id,
                orderDate: history.orderDate,
                quantity: history.quantity,
                totalAmount: history.totalAmount,
                shippingStatus: history.shippingStatus,
                paymentStatus: history.paymentStatus,
                deliveryDate: history.deliveryDate,
                productDetails: {
                    ...productDetails,
                    productImage: productImage ? `data:${pictureFormat};base64,${productImage}` : null
                },
                shopperDetails: {
                    ...shopperDetails
                }
            };
        }));

        return res.status(200).json({
            message: "Order history retrieved successfully",
            orderHistory: orderHistoryWithDetails,
            ok: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error while retrieving order history", ok: false });
    }
};


export { getSellerOrders, updateShippingStatus, getSellerOrderHistory };
