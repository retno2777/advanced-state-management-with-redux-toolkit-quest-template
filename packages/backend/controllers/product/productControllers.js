import { ProductModel } from "../../models/ProductModel.js";
import { sequelizePharma as sequelize } from "../../database/db.js";
import { SellerModel } from "../../models/SellerModel.js";
import { SellerOrderModel } from "../../models/SellerOrderModel.js";
import { Op } from "sequelize";

/**
 * Converts an image buffer to a base64 string
 * @param {Buffer} imageBuffer - The image buffer to convert
 * @returns {String} - The base64 string representation of the image, or null if the imageBuffer is null or undefined
 */
const convertImageToBase64 = (imageBuffer, format) => {
    return imageBuffer ? `data:${format};base64,${imageBuffer.toString('base64')}` : null;
};

/**
 * Function to add a new product
 * @param {Object} req - The request object containing product details
 * @param {Object} res - The response object to send back the response
 * @returns {Object} - JSON response indicating success or failure
 */
const createProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productName, price, stock, description, expiry_date } = req.body;
        const userId = req.user.userId;

        // Find the seller by userId
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;

        // Create a new product
        const newProduct = await ProductModel.create({
            productName,
            price,
            stock,
            description,
            expiry_date,
            sellerId,
            productImage: req.file ? req.file.buffer : null,
            pictureFormat: req.file ? req.file.mimetype : null
        }, { transaction });

        await transaction.commit();
        return res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during product creation" });
    }
};

/**
 * Update an existing product
 * @param {Object} req - The request object containing product update details
 * @param {Object} res - The response object to send back the response
 * @returns {Promise} - Resolves to a JSON response indicating success or failure
 */
const updateProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productId } = req.params; // Retrieve productId from request parameters
        const { productName, price, stock, description, expiry_date } = req.body; // Retrieve product details from request body
        const userId = req.user.userId; // Retrieve userId from authenticated user token

        // Find the seller by userId
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id; // Get sellerId from seller object

        // Check if the product exists and is owned by the currently logged-in seller
        const product = await ProductModel.findOne({
            where: { id: productId, sellerId }, // Ensure the product belongs to the seller
            transaction
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Update product with new data, retaining existing values if not provided in the request
        await product.update({
            productName: productName || product.productName,
            price: price || product.price,
            stock: stock || product.stock,
            description: description || product.description,
            expiry_date: expiry_date || product.expiry_date,
            productImage: req.file ? req.file.buffer : product.productImage, // Update image if a new file is provided
            pictureFormat: req.file ? req.file.mimetype : product.pictureFormat // Update format if a new file is provided
        }, { transaction });

        await transaction.commit(); // Commit transaction if successful
        return res.status(200).json({ message: "Product updated successfully", product });

    } catch (error) {
        await transaction.rollback(); // Rollback transaction in case of error
        console.error(error);
        return res.status(500).json({ message: "Server error during product update" });
    }
};

/**
 * Function to delete a product
 * @param {Object} req - The request object containing the product ID to be deleted
 * @param {Object} res - The response object to send back the response
 * @returns {Promise} - Resolves to a JSON response indicating success or failure
 */
const deleteProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productId } = req.params;
        const userId = req.user.userId;  // Retrieve sellerId from the authenticated user token

        // Retrieve the seller object using the userId
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;

        // Retrieve the product object using the productId and sellerId
        const product = await ProductModel.findOne({
            where: { id: productId, sellerId },
            transaction
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found or you are not the owner", ok: false });
        }

        // Check if there are any ongoing transactions (Pending, Shipped, or Delivered) involving this product
        const ongoingTransactions = await SellerOrderModel.findOne({
            where: {
                productId,
                sellerId,
                shippingStatus: {
                    [Op.or]: ['Pending', 'Shipped', 'Delivered']
                }
            },
            transaction
        });

        if (ongoingTransactions) {
            return res.status(400).json({
                message: "Product cannot be deleted because it is still involved in an ongoing transaction.",
                ok: false
            });
        }

        // If no ongoing transactions, the product can be deleted
        await ProductModel.destroy({ where: { id: productId, sellerId }, transaction });

        await transaction.commit();
        return res.status(200).json({
            message: "Product deleted successfully.",
            ok: true
        });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during product deletion.", ok: false });
    }
};


/**
 * Function to view all products (for shoppers)
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - Resolves to a JSON response indicating success or failure.
 */
const viewAllProducts = async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await ProductModel.findAll({
            attributes: [
                'id',  // Product ID
                'productName',  // Product name
                'price',  // Product price
                'stock',  // Product stock
                'description',  // Product description
                'productImage',  // Product image
                'pictureFormat',  // Product image format
                'expiry_date'  // Product expiration date
            ]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products available", ok: false });
        }

        // Convert image format to Base64 if the image is stored as a Buffer
        const formattedProducts = products.map(product => ({
            id: product.id,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description,
            expiryDate: product.expiry_date,
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)
        }));

        return res.status(200).json({ products: formattedProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching products" });
    }
};

/**
 * Function to view a limited number of products (6 by default)
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with 6 products.
 */
const viewLimitedProducts = async (req, res) => {
    try {
        // Retrieve a limited number of products from the database
        // The limit can be changed by modifying the 'limit' option
        const products = await ProductModel.findAll({
            attributes: [
                'id',  // Product ID
                'productName',  // Product name
                'price',  // Product price
                'stock',  // Product stock
                'description',  // Product description
                'productImage',  // Product image
                'pictureFormat',  // Product image format
                'expiry_date'  // Product expiration date
            ],
            limit: 6,  // Limit to 6 products
            order: [['createdAt', 'DESC']]  // Order by creation date, or you can change to another column
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products available", ok: false });
        }

        // Convert image format to Base64 if the image is stored as a Buffer
        const formattedProducts = products.map(product => ({
            id: product.id,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description,
            expiryDate: product.expiry_date,
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)
        }));

        return res.status(200).json({ products: formattedProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching products" });
    }
};

/**
 * Function to view all products associated with a seller
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the list of products associated with the seller.
 */
const viewAllProductsSeller = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from authenticated user

        // Find the sellerId associated with the user
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;  // Get sellerId from seller object

        // Retrieve all products associated with the seller
        const products = await ProductModel.findAll({
            where: { sellerId }, // Filter by sellerId
            attributes: [
                'id',  // Product ID
                'productName',  // Product name
                'price',  // Product price
                'stock',  // Product stock
                'description',  // Product description
                'productImage',  // Product image
                'pictureFormat',  // Product image format
                'expiry_date'  // Product expiration date
            ]
        });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products available for this seller", ok: false });
        }

        // Convert image format to Base64 if the image is stored as a Buffer
        const formattedProducts = products.map(product => ({
            id: product.id,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description,
            expiryDate: product.expiry_date,
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)  // Use separate function
        }));

        return res.status(200).json({ products: formattedProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching products" });
    }
};

/**
 * Function to get a product by its ID
 * @param {Object} req - The request object containing the product ID in the params
 * @param {Object} res - The response object to send back the response
 * @returns {Promise} - Resolves to a JSON response with the product details or an error message
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Extract product ID from request parameters

        // Find the product by its ID from the database
        const product = await ProductModel.findOne({
            where: { id },
            attributes: ['id', 'productName', 'price', 'stock', 'description', 'productImage', 'pictureFormat', 'expiry_date']
        });

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Format the product details, including converting the image to Base64
        const formattedProduct = {
            id: product.id,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description,
            expiryDate: product.expiry_date,
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)
        };

        // Respond with the formatted product details
        return res.status(200).json({ product: formattedProduct });

    } catch (error) {
        console.error(error);
        // Handle server errors
        return res.status(500).json({ message: "Server error during fetching product by ID" });
    }
};

export { createProduct, updateProduct, deleteProduct, viewAllProducts, getProductById, viewAllProductsSeller, viewLimitedProducts };
