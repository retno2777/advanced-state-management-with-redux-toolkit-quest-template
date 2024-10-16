import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";
import { sequelizePharma as sequelize } from "../../../database/db.js";


/**
 * Simulates the payment process for an order.
 * Updates the payment status in both the OrderItemModel and SellerOrderModel to "Paid".
 * 
 * @param {Object} req - The request object containing orderId and userId.
 * @param {Object} res - The response object to send back the response.
 * @returns {Promise} - Resolves with a JSON response indicating success or failure.
 */
const simulatePayment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { orderId } = req.body;
        const userId = req.user.userId;

        // Retrieve shopper information using userId
        const shopper = await ShopperModel.findOne({ where: { userId }, transaction });

        if (!shopper) {
            // Rollback transaction if shopper not found
            await transaction.rollback();
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;

        // Retrieve the order item with matching orderId, shopperId, and payment status "Pending"
        const orderItem = await OrderItemModel.findOne({
            where: { id: orderId, shopperId, paymentStatus: "Pending" },
            transaction
        });

        if (!orderItem) {
            // Rollback transaction if order item not found or already paid
            await transaction.rollback();
            return res.status(404).json({ message: "Order not found or already paid", ok: false });
        }

        // Update payment status in OrderItemModel to "Paid"
        orderItem.paymentStatus = "Paid";
        await orderItem.save({ transaction });

        // Retrieve corresponding seller order using shopperOrderId
        const sellerOrder = await SellerOrderModel.findOne({
            where: { shopperOrderId: orderItem.id },
            transaction
        });

        if (!sellerOrder) {
            // Rollback transaction if seller order not found
            await transaction.rollback();
            return res.status(404).json({ message: "Seller order not found", ok: false });
        }

        // Update payment status in SellerOrderModel to "Paid"
        sellerOrder.paymentStatus = "Paid";
        await sellerOrder.save({ transaction });

        // Commit the transaction if everything is successful
        await transaction.commit();

        return res.status(200).json({ message: "Payment marked as Paid successfully in both shopper and seller orders", ok: true });

    } catch (error) {
        // Rollback transaction in case of an error
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during payment simulation", ok: false });
    }
};

export { simulatePayment };
