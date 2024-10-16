import { ProductModel } from "../../models/ProductModel.js";
import { sequelizePharma as sequelize } from "../../database/db.js"; // Impor sequelizePharma as sequelize
import { SellerModel } from "../../models/SellerModel.js";  // Add SellerModel
import { SellerOrderModel } from "../../models/SellerOrderModel.js"; // Impor model transaksi
import { Op } from "sequelize";  // Untuk operator sequelize

// Function to convert image buffer to Base64
const convertImageToBase64 = (imageBuffer, format) => {
    return imageBuffer ? `data:${format};base64,${imageBuffer.toString('base64')}` : null;
};

// Function to add a new product
const createProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productName, price, stock, description, expiry_date } = req.body;  // Menggunakan expiry_date
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi

        // Lakukan pencarian sellerId berdasarkan userId
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;  // Ambil sellerId dari hasil pencarian
        console.log("Seller ID:", sellerId);  // Cetak sellerId untuk debugging

        // Buat produk baru
        const newProduct = await ProductModel.create({
            productName,
            price,
            stock,
            description,
            expiry_date,  // Simpan expiry date
            sellerId,  // Gunakan sellerId yang ditemukan
            productImage: req.file ? req.file.buffer : null,  // Simpan gambar jika ada
            pictureFormat: req.file ? req.file.mimetype : null  // Simpan format gambar jika ada
        }, { transaction });

        await transaction.commit();
        return res.status(201).json({ message: "Product created successfully", product: newProduct });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during product creation" });
    }
};

// Function to update an existing product
const updateProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productId } = req.params;
        const { productName, price, stock, description, expiry_date } = req.body;
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi

        // Lakukan pencarian sellerId berdasarkan userId
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;  // Ambil sellerId dari hasil pencarian
        // Check if the product exists and is owned by the currently logged-in seller
        const product = await ProductModel.findOne({
            where: { id: productId, sellerId },
            transaction
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Update product with new data
        await product.update({
            productName: productName || product.productName,
            price: price || product.price,
            stock: stock || product.stock,
            description: description || product.description,
            expiry_date: expiry_date || product.expiry_date,
            productImage: req.file ? req.file.buffer : product.productImage,  // Update image if provided
            pictureFormat: req.file ? req.file.mimetype : product.pictureFormat  // Update image format if provided
        }, { transaction });

        await transaction.commit();
        return res.status(200).json({ message: "Product updated successfully", product });

    } catch (error) {
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during product update" });
    }
};

// Function to delete a product
const deleteProduct = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { productId } = req.params;
        const userId = req.user.userId;  // Retrieve sellerId from the authenticated user token

        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;  // Ambil sellerId dari hasil pencarian
        // Check if the product is owned by the logged-in seller
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
                    [Op.or]: ['Pending', 'Shipped', 'Delivered']  // Cek status pengiriman
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

// Function to view all products (for shoppers)
const viewAllProducts = async (req, res) => {
    try {
        // Retrieve all products from the database
        const products = await ProductModel.findAll({
            attributes: ['id', 'productName', 'price', 'stock', 'description', 'productImage', 'pictureFormat', 'expiry_date']  // Include image and format
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
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)  // Use separate function
        }));

        return res.status(200).json({ products: formattedProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching products" });
    }
};

const viewLimitedProducts = async (req, res) => {
    try {
        // Retrieve 6 products from the database
        const products = await ProductModel.findAll({
            attributes: ['id', 'productName', 'price', 'stock', 'description', 'productImage', 'pictureFormat', 'expiry_date'],  // Include image and format
            limit: 6,  // Limit to 6 products
            order: [['createdAt', 'DESC']]  // Optional: Order by creation date, or you can change to another column
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
            productImage: convertImageToBase64(product.productImage, product.pictureFormat)  // Use separate function
        }));

        return res.status(200).json({ products: formattedProducts });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching products" });
    }
};

const viewAllProductsSeller = async (req, res) => {
    try {
        const userId = req.user.userId;  // Ambil userId dari token terverifikasi
        // Retrieve sellerId from authenticated user
        const seller = await SellerModel.findOne({ where: { userId: userId } });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const sellerId = seller.id;  // Ambil sellerId dari hasil pencarian
        // Retrieve all products for the authenticated seller from the database
        const products = await ProductModel.findAll({
            where: { sellerId }, // Filter by sellerId
            attributes: ['id', 'productName', 'price', 'stock', 'description', 'productImage', 'pictureFormat', 'expiry_date']  // Include image and format
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

// Function to get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params; // Ambil ID produk dari parameter URL

        // Cari produk berdasarkan ID
        const product = await ProductModel.findOne({
            where: { id },  // Cari produk dengan ID
            attributes: ['id', 'productName', 'price', 'stock', 'description', 'productImage', 'pictureFormat', 'expiry_date']  // Ambil atribut produk
        });

        // Jika produk tidak ditemukan
        if (!product) {
            return res.status(404).json({ message: "Product not found", ok: false });
        }

        // Format data produk dan konversi gambar menjadi Base64 jika ada
        const formattedProduct = {
            id: product.id,
            productName: product.productName,
            price: product.price,
            stock: product.stock,
            description: product.description,
            expiryDate: product.expiry_date,
            productImage: convertImageToBase64(product.productImage, product.pictureFormat) // Konversi gambar jika ada
        };

        // Kirimkan produk sebagai respon
        return res.status(200).json({ product: formattedProduct });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error during fetching product by ID" });
    }
}

export { createProduct, updateProduct, deleteProduct, viewAllProducts, getProductById, viewAllProductsSeller, viewLimitedProducts };
