import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";  // Add SellerOrderModel
import { ShopperModel } from "../../../models/ShopperModel.js";  // Add ShopperModel for shopperId
import { sequelizePharma as sequelize } from "../../../database/db.js"; // Import sequelizePharma as sequelize

// Function to simulate payment and update payment status to "Paid"
const simulatePayment = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { orderId } = req.body;  // Retrieve orderId from the request
        const userId = req.user.userId;  // Retrieve userId from the authenticated user's token

        // Query ShopperModel to get shopperId using the userId
        const shopper = await ShopperModel.findOne({ where: { userId }, transaction });

        if (!shopper) {
            await transaction.rollback();
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;

        // Retrieve the order item that matches the orderId and shopperId
        const orderItem = await OrderItemModel.findOne({
            where: { id: orderId, shopperId, paymentStatus: "Pending" },
            transaction
        });

        if (!orderItem) {
            await transaction.rollback();
            return res.status(404).json({ message: "Order not found or already paid", ok: false });
        }

        // Update payment status in OrderItemModel to "Paid"
        orderItem.paymentStatus = "Paid";
        await orderItem.save({ transaction });

        // Update payment status in the corresponding SellerOrderModel
        const sellerOrder = await SellerOrderModel.findOne({
            where: { shopperOrderId: orderItem.id },  // Use shopperOrderId to match with orderId from OrderItemModel
            transaction
        });

        if (!sellerOrder) {
            await transaction.rollback();
            return res.status(404).json({ message: "Seller order not found", ok: false });
        }

        // Update payment status in SellerOrderModel to "Paid"
        sellerOrder.paymentStatus = "Paid";
        await sellerOrder.save({ transaction });

        // Commit the transaction
        await transaction.commit();

        return res.status(200).json({ message: "Payment marked as Paid successfully in both shopper and seller orders", ok: true });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during payment simulation", ok: false });
    }
};

export { simulatePayment };
