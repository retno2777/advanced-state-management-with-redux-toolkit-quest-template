import { OrderItemModel } from "../../../models/OrderItemModel.js";  // Import OrderItem model
import { ProductModel } from "../../../models/ProductModel.js";      // Import Product model
import { OrderHistoryModel } from "../../../models/OrderHistoryModel.js";  // Import OrderHistory model
import { ShopperModel } from "../../../models/ShopperModel.js";
import { SellerModel } from "../../../models/SellerModel.js";
// Function to convert image buffer to Base64
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

// Function to retrieve all order items for the logged-in shopper
const getOrderItems = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from the authenticated user's token

        // Query ShopperModel to get shopperId using the userId
        const shopper = await ShopperModel.findOne({ where: { userId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;

        // Retrieve all order items for that shopper without including the product
        const orderItems = await OrderItemModel.findAll({
            where: { shopperId },
            attributes: ['id', 'productId', 'orderDate', 'quantity', 'totalAmount', 'shippingStatus', 'paymentStatus'],  // Include productId so we can find product manually
            order: [['orderDate', 'DESC']]  // Sort by the latest order date
        });

        if (!orderItems || orderItems.length === 0) {
            return res.status(404).json({ message: "No orders found", ok: false });
        }

        // For each order item, manually find the product by productId
        const orderItemsWithProductDetails = await Promise.all(orderItems.map(async (item) => {
            const product = await ProductModel.findOne({
                where: { id: item.productId },
                attributes: ['id', 'productName', 'price', 'productImage', 'pictureFormat']
            });

            if (!product) {
                return {
                    ...item.toJSON(),
                    product: null // No product found
                };
            }

            // Convert product image to base64
            const base64Image = convertImageToBase64(product.productImage);

            return {
                ...item.toJSON(),
                product: {
                    ...product.toJSON(),
                    productImage: base64Image ? `data:${product.pictureFormat};base64,${base64Image}` : null
                }
            };
        }));

        // Return response containing all order items with product details
        return res.status(200).json({
            message: "Order items retrieved successfully",
            ok: true,
            orderItems: orderItemsWithProductDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};
// Function to retrieve order history for the logged-in shopper
const getOrderHistory = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from the authenticated user's token

        // Query ShopperModel to get shopperId using the userId
        const shopper = await ShopperModel.findOne({ where: { userId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;

        // Retrieve all order history from OrderHistoryModel for that shopper
        const orderHistory = await OrderHistoryModel.findAll({
            where: { shopperId },
            attributes: [
                'id', 'orderDate', 'quantity', 'totalAmount', 'shippingStatus', 'paymentStatus', 'deliveryDate',
                'productId', 'sellerId'
            ],  // Select required fields from OrderHistoryModel
            order: [['orderDate', 'DESC']],
        });

        if (!orderHistory || orderHistory.length === 0) {
            return res.status(404).json({ message: "No order history found", ok: false });
        }

        // For each order item, manually find the product and seller details by their IDs
        const orderHistoryWithDetails = await Promise.all(orderHistory.map(async (item) => {
            const { productId, sellerId } = item;

            // Find product by productId
            const product = productId ? await ProductModel.findOne({
                where: { id: productId },
                attributes: ['id', 'productName', 'price', 'description', 'productImage', 'pictureFormat']
            }) : null;

            // Convert product image to base64 if available
            let productImage = null;
            if (product && product.productImage) {
                productImage = `data:${product.pictureFormat};base64,${convertImageToBase64(product.productImage)}`;
            }

            // Find seller by sellerId
            const seller = sellerId ? await SellerModel.findOne({
                where: { id: sellerId },
                attributes: ['id', 'storeName', 'Name']
            }) : null;

            return {
                ...item.toJSON(),
                product: product ? {
                    ...product.toJSON(),
                    productImage: productImage  // Include product image if available
                } : null,
                seller: seller ? seller.toJSON() : null,  // Include seller details if available
            };
        }));

        // Return order history with product and seller details
        return res.status(200).json({
            message: "Order history retrieved successfully",
            ok: true,
            orderHistory: orderHistoryWithDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

export { getOrderItems, getOrderHistory };
