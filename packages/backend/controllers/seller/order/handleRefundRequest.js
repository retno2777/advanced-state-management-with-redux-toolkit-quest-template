import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { ProductModel } from "../../../models/ProductModel.js";  
import { OrderHistoryModel } from "../../../models/OrderHistoryModel.js";  
import { OrderHistorySellerModel } from "../../../models/OrderHistorySellerModel.js";  
import { sequelizePharma as sequelize } from "../../../database/db.js"; 
import { SellerModel } from "../../../models/SellerModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";  
import { UserModel } from "../../../models/UserModel.js";  

/**
 * Handles refund request for a given order item.
 * Updates the order status and payment status of the order item and seller order
 * to either "Cancelled" and "Refunded" (if approved) or "Paid" (if rejected).
 * Updates product stock and moves data to OrderHistoryModel (for shopper) and
 * OrderHistorySellerModel (for seller).
 * @param {Object} req - Request object containing orderId and action (approve/reject)
 * @param {Object} res - Response object to send back the response.
 * @returns {Promise} - Resolves to the response object.
 */
const handleRefundRequest = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { orderId, action } = req.body;
        const userId = req.user.userId;  // Retrieve userId from the authenticated user's token

        // Retrieve the seller based on the userId from UserModel to SellerModel
        const seller = await SellerModel.findOne({
            where: { userId },  
        });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        const sellerId = seller.id;  
        const sellerName = seller.name;
        const storeName = seller.storeName;

        // Retrieve the specific seller order
        const sellerOrder = await SellerOrderModel.findOne({
            where: { id: orderId, sellerId },
        });

        if (!sellerOrder) {
            return res.status(404).json({ message: "Order not found", ok: false });
        }

        // Retrieve productId and shopperId from sellerOrder
        const { productId, shopperId } = sellerOrder;

        // Retrieve the order item from OrderItemModel for the shopper
        const orderItem = await OrderItemModel.findOne({
            where: { id: orderId, productId, shopperId },
            transaction
        });

        if (!orderItem) {
            return res.status(404).json({ message: "Order item for shopper not found", ok: false });
        }

        // Retrieve the product from ProductModel
        const product = await ProductModel.findOne({
            where: { id: productId },
            transaction
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Retrieve the shopper details from ShopperModel and UserModel
        const shopper = await ShopperModel.findOne({
            where: { id: shopperId },
            transaction
        });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const user = await UserModel.findOne({
            where: { id: shopper.userId },  
            attributes: ['email']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        if (action === "approve") {
            // Update order status to 'Cancelled' and 'Refunded'
            orderItem.shippingStatus = "Cancelled";
            orderItem.paymentStatus = "Refunded";
            sellerOrder.shippingStatus = "Cancelled";
            sellerOrder.paymentStatus = "Refunded";

            // Update product stock
            product.stock += orderItem.quantity;
            await product.save({ transaction });
            await orderItem.save({ transaction });
            await sellerOrder.save({ transaction });

            // Move data to OrderHistoryModel (for shopper)
            await OrderHistoryModel.create({
                orderDate: orderItem.orderDate,
                quantity: orderItem.quantity,
                totalAmount: orderItem.totalAmount,
                shippingStatus: "Cancelled",
                paymentStatus: "Refunded",
                shopperId: orderItem.shopperId,
                productId: orderItem.productId,
                sellerId: orderItem.sellerId,
                productName: product.productName,
                productPrice: product.price,
                productDescription: product.description,
                sellerName: sellerName,  // Save seller name
                storeName: storeName,  // Save store name
            }, { transaction });

            // Move data to OrderHistorySellerModel (for seller)
            await OrderHistorySellerModel.create({
                orderDate: orderItem.orderDate,
                quantity: orderItem.quantity,
                totalAmount: orderItem.totalAmount,
                shippingStatus: "Cancelled",
                paymentStatus: "Refunded",
                shopperId: orderItem.shopperId,
                productId: orderItem.productId,
                sellerId: orderItem.sellerId,
                shopperOrderId: orderItem.id,
                productName: product.productName,
                productPrice: product.price,
                productDescription: product.description,
                shopperName: `${shopper.firstName} ${shopper.lastName}`,  // Store shopper's name
                shopperEmail: user.email,  // Store shopper's email from UserModel
            }, { transaction });

            // Remove the order from the active order tables
            await OrderItemModel.destroy({ where: { id: orderId }, transaction });
            await SellerOrderModel.destroy({ where: { id: orderId }, transaction });

            await transaction.commit();
            return res.status(200).json({ message: "Refund approved, order cancelled, product stock updated, and moved to order history.", ok: true });
        } else if (action === "reject") {
            // Update order status to 'Paid'
            orderItem.shippingStatus = "Paid";
            sellerOrder.shippingStatus = "Pending";
            await orderItem.save({ transaction });
            await sellerOrder.save({ transaction });

            await transaction.commit();
            return res.status(200).json({ message: "Refund request rejected.", ok: true });
        } else {
            return res.status(400).json({ message: "Invalid action", ok: false });
        }
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during refund handling", ok: false });
    }
};

export { handleRefundRequest };
