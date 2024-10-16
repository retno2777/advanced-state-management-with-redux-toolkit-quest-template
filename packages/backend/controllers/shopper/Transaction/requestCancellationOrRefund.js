import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { ProductModel } from "../../../models/ProductModel.js";  
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";  
import { OrderHistoryModel } from "../../../models/OrderHistoryModel.js";  
import { OrderHistorySellerModel } from "../../../models/OrderHistorySellerModel.js";  
import { SellerModel } from "../../../models/SellerModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";  
import { sequelizePharma as sequelize } from "../../../database/db.js"; 
import { UserModel } from "../../../models/UserModel.js";

const requestCancellationOrRefund = async (req, res) => {
    const transaction = await sequelize.transaction();  
    try {
        const { orderId } = req.body;
        const userId = req.user.userId;  // Ambil userId dari token autentikasi

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

        // Ambil email dari UserModel
        const shopperEmail = await UserModel.findOne({
            where: { id: userId },
            attributes: ['email'],  
        });

        // Cari order item yang sesuai dengan orderId dan shopperId
        const orderItem = await OrderItemModel.findOne({ where: { id: orderId, shopperId }, transaction });
        if (!orderItem) {
            await transaction.rollback();
            return res.status(404).json({ message: "Order not found", ok: false });
        }

        // Ambil produk terkait
        const product = await ProductModel.findOne({ where: { id: orderItem.productId }, transaction });
        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Ambil order seller terkait
        const sellerOrder = await SellerOrderModel.findOne({ where: { shopperOrderId: orderItem.id }, transaction });
        if (!sellerOrder) {
            await transaction.rollback();
            return res.status(404).json({ message: "Seller order not found", ok: false });
        }

        // Jika payment status "Pending", izinkan pembatalan tanpa persetujuan seller
        if (orderItem.paymentStatus === "Pending") {
            orderItem.shippingStatus = "Cancelled";
            sellerOrder.shippingStatus = "Cancelled";  

            // Kembalikan stok produk
            product.stock += orderItem.quantity;
            await product.save({ transaction });
            await orderItem.save({ transaction });
            await sellerOrder.save({ transaction });

            // Ambil informasi seller
            const seller = await SellerModel.findOne({ where: { id: orderItem.sellerId }, transaction });
            if (!seller) {
                await transaction.rollback();
                return res.status(404).json({ message: "Seller not found", ok: false });
            }

            // Pindahkan data ke OrderHistoryModel untuk shopper
            await OrderHistoryModel.create({
                orderDate: orderItem.orderDate,
                quantity: orderItem.quantity,
                totalAmount: orderItem.totalAmount,
                shippingStatus: "Cancelled",
                paymentStatus: orderItem.paymentStatus === "Paid" ? "Refunded" : "Pending",
                shopperId: orderItem.shopperId,
                productId: orderItem.productId,
                sellerId: orderItem.sellerId,
                productName: product.productName,  
                productDescription: product.description,  
                productPrice: product.price,  
                sellerName: seller.name,  
                storeName: seller.storeName  
            }, { transaction });

            // Pindahkan data ke OrderHistorySellerModel untuk seller
            await OrderHistorySellerModel.create({
                orderDate: orderItem.orderDate,
                quantity: orderItem.quantity,
                totalAmount: orderItem.totalAmount,
                shippingStatus: "Cancelled",
                paymentStatus: orderItem.paymentStatus === "Paid" ? "Refunded" : "Pending",
                shopperId: orderItem.shopperId,
                productId: orderItem.productId,
                sellerId: orderItem.sellerId,
                shopperOrderId: orderItem.id,
                productName: product.productName,  
                productDescription: product.description,  
                productPrice: product.price,  
                shopperName: shopperName,  
                shopperEmail: shopperEmail.email  
            }, { transaction });

            // Hapus entri terkait di SellerOrderModel dan OrderItemModel
            await SellerOrderModel.destroy({
                where: { shopperOrderId: orderId },  
                transaction
            });

            await OrderItemModel.destroy({
                where: { id: orderId },  
                transaction
            });

            await transaction.commit();  
            return res.status(200).json({
                message: "Order cancelled successfully, product stock updated, and moved to order history.",
                ok: true
            });
        }

        // Jika status pembayaran sudah "Paid", ajukan permintaan pengembalian dana
        if (orderItem.paymentStatus === "Paid") {
            orderItem.shippingStatus = "Refund Requested";  
            sellerOrder.shippingStatus = "Refund Requested";  
            await orderItem.save({ transaction });
            await sellerOrder.save({ transaction });

            await transaction.commit();
            return res.status(200).json({
                message: "Refund request submitted, awaiting seller confirmation.",
                ok: true
            });
        } else {
            await transaction.rollback();
            return res.status(400).json({
                message: "Order is not paid or already refunded.",
                ok: false
            });
        }
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during request", ok: false });
    }
};

export { requestCancellationOrRefund };
