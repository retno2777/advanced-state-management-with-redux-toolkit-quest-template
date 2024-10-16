import {CartModel} from "../../../models/CartModel.js";
import {ProductModel} from "../../../models/ProductModel.js";
import {ShopperModel} from "../../../models/ShopperModel.js";

// Add a product to the cart
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;  // Product and quantity to add
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi
        // Lakukan pencarian sellerId berdasarkan userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;
        console.log("Shopper ID:", shopperId);  // Cetak shopperId untuk debugging
        // Check if the product exists in the database
        const product = await ProductModel.findOne({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Check if the product has enough stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock", ok: false });
        }

        // Check if the product is already in the cart
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

// Reduce the quantity of an item in the cart by productId
const reduceItemInCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi

        // Lakukan pencarian sellerId berdasarkan userId
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

// Function to remove an item after confirmation
const removeItemFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi

        // Lakukan pencarian sellerId berdasarkan userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;

        // Check if the product is in the cart before removing it
        const cartItem = await CartModel.findOne({ where: { productId, shopperId } });
        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in cart", ok: false });
        }

        // Remove item from the cart
        await CartModel.destroy({ where: { productId, shopperId } });
        return res.status(200).json({ message: "Product removed from cart", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

// Function to view the contents of the cart
const viewCart = async (req, res) => {
    try {
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi

        // Lakukan pencarian sellerId berdasarkan userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Seller not found" });
        }
        const shopperId = shopper.id;
        // Retrieve all items in the cart owned by the shopper
        const cartItems = await CartModel.findAll({
            where: { shopperId },
            include: [
                {
                    model: ProductModel,  // Include product information
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

        return res.status(200).json({ cartItems: formattedCartItems });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

export { addItemToCart, reduceItemInCart, removeItemFromCart, viewCart };
