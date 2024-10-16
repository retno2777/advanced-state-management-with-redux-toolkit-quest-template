import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { SellerModel } from "../../../models/SellerModel.js";
import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { ProductModel } from "../../../models/ProductModel.js";  
import { OrderHistorySellerModel } from "../../../models/OrderHistorySellerModel.js";  
import { ShopperModel } from "../../../models/ShopperModel.js";
import { UserModel } from "../../../models/UserModel.js";

/**
 * Converts an image buffer to a base64 string
 * @param {Buffer} imageBuffer - The image buffer to convert
 * @returns {String} - The base64 string representation of the image, or null if the imageBuffer is null or undefined
 */
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

/**
 * Retrieves all orders belonging to a seller and their associated details.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with seller orders and their details.
 */
const getSellerOrders = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from the logged-in user's token

        // Retrieve the sellerId from SellerModel using userId
        const seller = await SellerModel.findOne({
            where: { userId },  // Find the seller by userId in SellerModel
        });

        // If seller not found, return a 404 response
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        const sellerId = seller.id;  // Get the sellerId from the found seller

        // Retrieve all seller orders from SellerOrderModel using sellerId
        const sellerOrders = await SellerOrderModel.findAll({
            where: { sellerId }
        });

        // If no orders are found, return a 404 response
        if (sellerOrders.length === 0) {
            return res.status(404).json({ message: "No orders found", ok: false });
        }

        const ordersWithDetails = [];  // Initialize an array to hold orders with details

        // Loop through each seller order to gather additional details
        for (const sellerOrder of sellerOrders) {
            // Retrieve the related order item
            const orderItem = await OrderItemModel.findOne({
                where: { id: sellerOrder.shopperOrderId }
            });

            // If order item is not found, skip to the next order
            if (!orderItem) {
                continue;
            }

            // Retrieve the related product for each order item
            const product = await ProductModel.findOne({
                where: { id: orderItem.productId },
                attributes: ['id', 'productName', 'price', 'productImage', 'pictureFormat']  // Only retrieve necessary fields
            });

            // Convert product image to base64 format if available
            const base64Image = product?.productImage ? convertImageToBase64(product.productImage) : null;

            // Construct the response data with all details
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

            // Add the order details to the array
            ordersWithDetails.push(orderDetails);
        }

        // Return the response with the gathered order details
        return res.status(200).json({
            message: "Seller orders retrieved successfully",
            orders: ordersWithDetails,
            ok: true
        });
    } catch (error) {
        console.error(error);
        // Return a 500 server error response if an exception occurs
        return res.status(500).json({ message: "Server error while retrieving orders", ok: false });
    }
};


/**
 * Updates the shipping status for a given order by the seller.
 * 
 * @param {Object} req - The request object containing order ID and shipping status.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of the update.
 */
const updateShippingStatus = async (req, res) => {
    try {
        const { orderId, shippingStatus } = req.body; // Retrieve orderId and shippingStatus from the request
        const sellerIdFromToken = req.user.userId; // Retrieve sellerId from the logged-in user's token

        // Step 1: Retrieve the seller from SellerModel
        const seller = await SellerModel.findOne({
            where: { userId: sellerIdFromToken } // Assuming userId is the field in SellerModel that references the user
        });

        if (!seller) {
            // Respond with 404 if seller is not found
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        // Step 2: Retrieve the order from SellerOrderModel
        const order = await SellerOrderModel.findOne({
            where: { id: orderId, sellerid: seller.id }
        });

        if (!order) {
            // Respond with 404 if order is not found
            return res.status(404).json({ message: "Order not found", ok: false });
        }

        // Step 3: Retrieve related order item from OrderItemModel
        const orderItem = await OrderItemModel.findOne({
            where: { id: order.shopperOrderId } // Assuming orderId in OrderItemModel refers to the order
        });

        if (!orderItem) {
            // Respond with 404 if order item is not found
            return res.status(404).json({ message: "Order item not found", ok: false });
        }

        // Step 4: Update shipping status in both models
        order.shippingStatus = shippingStatus; // Update in SellerOrderModel
        await order.save();

        orderItem.shippingStatus = shippingStatus; // Update in OrderItemModel
        await orderItem.save();

        // Respond with success message and updated order details
        return res.status(200).json({
            message: `Shipping status updated to ${shippingStatus} in both order and order item`,
            order,
            orderItem,
            ok: true
        });
    } catch (error) {
        console.error(error);
        // Respond with server error
        return res.status(500).json({ message: "Server error while updating shipping status", ok: false });
    }
};
/**
 * Retrieves all order history belonging to a seller with detailed product and shopper information.
 * 
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with seller's order history and details.
 */
const getSellerOrderHistory = async (req, res) => {
    try {
        // Retrieve userId from the logged-in user's token
        const userId = req.user.userId;

        // Retrieve sellerId based on userId from UserModel through SellerModel
        const seller = await SellerModel.findOne({ where: { userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        const sellerId = seller.id;

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
