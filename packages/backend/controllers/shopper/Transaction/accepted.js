import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { OrderHistoryModel } from "../../../models/OrderHistoryModel.js";
import { OrderHistorySellerModel } from "../../../models/OrderHistorySellerModel.js";
import { ProductModel } from "../../../models/ProductModel.js";
import { SellerModel } from "../../../models/SellerModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";
import { UserModel } from "../../../models/UserModel.js";
import { sequelizePharma as sequelize } from "../../../database/db.js";

/**
 * Function to confirm order receipt
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Promise} - Promise that resolves to the response object
 */
const confirmOrderReceipt = async (req, res) => {
    const transaction = await sequelize.transaction(); 
    try {
        const { orderId } = req.body;
        const userId = req.user.userId; 

        // Ambil informasi shopper berdasarkan userId
        const shopper = await ShopperModel.findOne({
            where: { userId },
            attributes: { exclude: ['password'] },
        });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;
        const shopperName = `${shopper.firstName} ${shopper.lastName}`; 

        const shopperEmail = await UserModel.findOne({
            where: { id: userId },
            attributes: ['email'], 
        });

        const orderItem = await OrderItemModel.findOne({ where: { id: orderId, shopperId }, transaction });
        if (!orderItem) {
            await transaction.rollback();
            return res.status(404).json({ message: "Order not found", ok: false });
        }

        const product = await ProductModel.findOne({ where: { id: orderItem.productId }, transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        const sellerOrder = await SellerOrderModel.findOne({ where: { shopperOrderId: orderItem.id }, transaction });
        if (!sellerOrder) {
            await transaction.rollback();
            return res.status(404).json({ message: "Seller order not found", ok: false });
        }
        const seller = await SellerModel.findOne({ where: { id: orderItem.sellerId }, transaction });
        if (!seller) {
            await transaction.rollback();
            return res.status(404).json({ message: "Seller not found", ok: false });
        }

        // Update order status to "Delivered" and payment status to "Paid"
        orderItem.shippingStatus = "Delivered";
        orderItem.paymentStatus = "Paid";
        sellerOrder.shippingStatus = "Delivered";
        sellerOrder.paymentStatus = "Paid";

        // Save the updated order and seller order
        await orderItem.save({ transaction });
        await sellerOrder.save({ transaction });

        // Create order history and seller order history
        await OrderHistoryModel.create({
            orderDate: orderItem.orderDate,
            quantity: orderItem.quantity,
            totalAmount: orderItem.totalAmount,
            shippingStatus: "Delivered",
            paymentStatus: "Paid",
            shopperId: orderItem.shopperId,
            productId: orderItem.productId,
            sellerId: orderItem.sellerId,
            productName: product.productName,  
            productDescription: product.description,  
            productPrice: product.price,  
            sellerName: seller.name,  
            storeName: seller.storeName,  
        }, { transaction });

        await OrderHistorySellerModel.create({
            orderDate: orderItem.orderDate,
            quantity: orderItem.quantity,
            totalAmount: orderItem.totalAmount,
            shippingStatus: "Delivered",
            paymentStatus: "Paid",
            shopperId: orderItem.shopperId,
            productId: orderItem.productId,
            sellerId: orderItem.sellerId,
            shopperOrderId: orderItem.id,
            productName: product.productName,  
            productDescription: product.description,  
            productPrice: product.price,  
            shopperName: shopperName,  
            shopperEmail: shopperEmail.email,  
        }, { transaction });

        // Delete order and seller order
        await OrderItemModel.destroy({
            where: { id: orderId },
            transaction
        });
        await SellerOrderModel.destroy({
            where: { shopperOrderId: orderId },
            transaction
        });

        // Commit the transaction
        await transaction.commit();  
        return res.status(200).json({
            message: "Order confirmed successfully and moved to order history.",
            ok: true
        });

    } catch (error) {
        // Rollback the transaction if there is an error
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during order confirmation", ok: false });
    }
};


export { confirmOrderReceipt };
