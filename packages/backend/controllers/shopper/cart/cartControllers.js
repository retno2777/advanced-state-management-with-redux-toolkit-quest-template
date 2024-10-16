import { CartModel } from "../../../models/CartModel.js";
import { ProductModel } from "../../../models/ProductModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";

/**
 * Add a product to the cart
 * @param {Object} req - Request object containing the request body
 * @param {Object} res - Response object for sending the response
 * @returns {Promise} - Resolves to a JSON response with a success message
 */
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        // Find the shopper by userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;

        // Find the product by productId
        const product = await ProductModel.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Check if the product has enough stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock", ok: false });
        }

        // Find the cart item by productId and shopperId
        const cartItem = await CartModel.findOne({ where: { productId, shopperId } });
        if (cartItem) {
            // If it's already in the cart, increase the quantity
            cartItem.quantity += quantity;
            await cartItem.save();
        } else {
            // If not in the cart, add a new item
            await CartModel.create({
                productId,
                shopperId,
                quantity,
            });
        }

        return res.status(200).json({ message: "Product added to cart", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Reduce the quantity of an item in the cart by productId
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with either a confirmation or the updated cart item.
 */
const reduceItemInCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;

        // Find the shopper by userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;

        // Check if the product is in the cart
        const cartItem = await CartModel.findOne({ where: { productId, shopperId } });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart", ok: false });
        }

        // If quantity is 1, ask for confirmation before removing
        if (cartItem.quantity === 1) {
            return res.status(200).json({
                message: "Are you sure you want to remove the item from the cart?",
                confirm: true,  // Send a confirmation flag
                productId: productId,
                ok: true
            });
        } else {
            // Reduce the quantity if greater than 1
            cartItem.quantity -= 1;
            await cartItem.save();
            return res.status(200).json({ message: "Product quantity decreased by 1", ok: true });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Function to remove an item from the cart after confirmation
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with a confirmation message.
 */
const removeItemFromCart = async (req, res) => {
    try {
        // Retrieve the product ID from the request body
        const { productId } = req.body;
        // Retrieve the userId from the authenticated user's token
        const userId = req.user.userId;

        // Find the shopper by userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        // Retrieve the shopperId from the shopper object
        const shopperId = shopper.id;

        // Check if the product is in the cart before removing it
        const cartItem = await CartModel.findOne({ where: { productId, shopperId } });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart", ok: false });
        }

        // Remove item from the cart
        await CartModel.destroy({ where: { productId, shopperId } });
        // Return a successful response with a confirmation message
        return res.status(200).json({ message: "Product removed from cart", ok: true });
    } catch (error) {
        console.error(error);
        // Return a server error response with a generic message
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Function to view the contents of the cart
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the cart items.
 */
const viewCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Retrieve the shopper's information from the authenticated user's token
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;

        // Retrieve all items in the cart owned by the shopper
        // Include product information using an inner join
        const cartItems = await CartModel.findAll({
            where: { shopperId },
            include: [
                {
                    model: ProductModel,  // Include product model
                    attributes: ['id', 'productName', 'price', 'productImage', 'pictureFormat']  // Retrieve necessary fields
                }
            ]
        });

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "No items in cart", ok: false });
        }

        // Format the image to Base64 if available
        const formattedCartItems = cartItems.map(item => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            productName: item.product.productName,
            price: item.product.price,
            productImage: item.product.productImage
                ? `data:${item.product.pictureFormat};base64,${item.product.productImage.toString('base64')}`
                : null
        }));

        // Return the list of cart items with the formatted image
        return res.status(200).json({ cartItems: formattedCartItems });
    } catch (error) {
        console.error(error);
        // Return a server error response with a generic message
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

export { addItemToCart, reduceItemInCart, removeItemFromCart, viewCart };
