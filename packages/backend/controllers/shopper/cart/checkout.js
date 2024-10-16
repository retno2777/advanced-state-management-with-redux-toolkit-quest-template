import { CartModel } from "../../../models/CartModel.js";
import { OrderItemModel } from "../../../models/OrderItemModel.js";
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";
import { ProductModel } from "../../../models/ProductModel.js";
import { sequelizePharma as sequelize } from "../../../database/db.js"; // Impor sequelizePharma as sequelize
import { ShopperModel } from "../../../models/ShopperModel.js";
// Checkout function to move items from Cart to OrderItemModel and SellerOrderModel
const checkoutSelectedItems = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productIds, singleProductId, singleProductQuantity } = req.body;  // Array of productIds or single product checkout
        const userId = req.user.userId;

        // Query ShopperModel to get shopperId using the userId
        const shopper = await ShopperModel.findOne({ where: { userId }, transaction });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const shopperId = shopper.id;

        if ((!productIds || productIds.length === 0) && (!singleProductId || !singleProductQuantity)) {
            return res.status(400).json({ message: "No products selected for checkout", ok: false });
        }

        let cartItems = [];

        // Case 1: Checkout from cart
        if (productIds && productIds.length > 0) {
            // Retrieve all selected items from the cart
            cartItems = await CartModel.findAll({
                where: { productId: productIds, shopperId },
                transaction
            });

            if (cartItems.length === 0) {
                return res.status(400).json({ message: "No matching items found in cart", ok: false });
            }
        }

        // Case 2: Direct checkout (not from cart)
        if (singleProductId && singleProductQuantity) {
            // Retrieve product information directly
            const product = await ProductModel.findOne({ where: { id: singleProductId }, transaction });

            if (!product) {
                return res.status(404).json({ message: "Product not found", ok: false });
            }

            // Check if product stock is sufficient
            if (product.stock < singleProductQuantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}`, ok: false });
            }

            // Add the single product to the cartItems array (as if it's from cart)
            cartItems.push({
                productId: product.id,
                shopperId,
                quantity: singleProductQuantity,
                product: product
            });
        }

        // Process the checkout for each item (from cart or direct)
        for (const item of cartItems) {
            // If it's from cart, find the product using item.productId
            const product = item.product || await ProductModel.findOne({ where: { id: item.productId }, transaction });

            // Check if product stock is sufficient
            if (product.stock < item.quantity) {
                await transaction.rollback();
                return res.status(400).json({ message: `Insufficient stock for product: ${product.name}`, ok: false });
            }

            // Reduce product stock
            product.stock -= item.quantity;
            await product.save({ transaction });

            // Create entry in OrderItemModel for the shopper
            const orderItem = await OrderItemModel.create({
                productId: item.productId,
                shopperId: item.shopperId,
                sellerId: product.sellerId,
                quantity: item.quantity,
                totalAmount: product.price * item.quantity,
                orderDate: new Date(),
                shippingStatus: "Pending",
                paymentStatus: "Pending"
            }, { transaction });

            // Create entry in SellerOrderModel for the seller
            await SellerOrderModel.create({
                productId: item.productId,
                shopperId: item.shopperId,
                sellerId: product.sellerId,
                quantity: item.quantity,
                totalAmount: product.price * item.quantity,
                orderDate: new Date(),
                shippingStatus: "Pending",
                paymentStatus: "Pending",
                shopperOrderId: orderItem.id
            }, { transaction });

            // Remove item from the cart (only if it was from cart)
            if (productIds && productIds.length > 0) {
                await CartModel.destroy({ where: { productId: item.productId, shopperId }, transaction });
            }
        }

        // Commit the transaction after all items are successfully checked out
        await transaction.commit();
        return res.status(200).json({ message: "Selected items checked out successfully", ok: true });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during checkout", ok: false });
    }
};

export { checkoutSelectedItems };
