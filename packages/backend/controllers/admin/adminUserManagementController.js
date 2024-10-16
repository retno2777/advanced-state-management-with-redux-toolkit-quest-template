import { SellerModel } from "../../models/SellerModel.js";
import { ShopperModel } from "../../models/ShopperModel.js";
import { UserModel } from "../../models/UserModel.js";
import { sequelizePharma as sequelize } from "../../database/db.js";
import bcrypt from "bcryptjs";
import { AdminModel } from "../../models/AdminModel.js";
import { Op } from 'sequelize';
import { SellerOrderModel } from "../../models/SellerOrderModel.js";
import { OrderItemModel } from "../../models/OrderItemModel.js";

/**
 * Admin function to view all sellers.
 * Retrieves all sellers from the SellerModel, including their email and active status from UserModel.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the list of sellers and their details.
 */
const viewAllSellers = async (req, res) => {
    try {
        // Fetch all sellers from SellerModel with specific attributes
        const sellers = await SellerModel.findAll({
            attributes: ['id', 'name', 'storeName', 'phoneNumber', 'userId'], // Attributes from SellerModel including userId
        });

        // If no sellers are found, return a 404 response
        if (!sellers || sellers.length === 0) {
            return res.status(404).json({ message: "No sellers found", ok: false });
        }

        // For each seller, fetch email and active status from UserModel using userId
        const sellersWithEmail = await Promise.all(sellers.map(async (seller) => {
            const user = await UserModel.findOne({ where: { id: seller.userId }, attributes: ['email', 'isActive'] });
            return {
                ...seller.toJSON(),
                email: user ? user.email : null,  // Include email if found, otherwise null
                active: user ? user.isActive : null,  // Include active status if found, otherwise null
            };
        }));

        // Return a successful response with the list of sellers and their details
        return res.status(200).json({ message: "Sellers retrieved successfully", sellers: sellersWithEmail, ok: true });
    } catch (error) {
        // Log error and return a server error response
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Admin function to view all shoppers.
 * Retrieves all shoppers from the ShopperModel, including their email and active status from UserModel.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the list of shoppers and their details.
 */
const viewAllShoppers = async (req, res) => {
    try {
        // Fetch all shoppers from ShopperModel with specific attributes
        const shoppers = await ShopperModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'address', 'userId'], // Attributes from ShopperModel including userId
        });

        if (!shoppers || shoppers.length === 0) {
            return res.status(404).json({ message: "No shoppers found", ok: false });
        }

        // For each shopper, fetch email and active status from UserModel using userId
        const shoppersWithEmail = await Promise.all(shoppers.map(async (shopper) => {
            const user = await UserModel.findOne({ where: { id: shopper.userId }, attributes: ['email', 'isActive'] });
            return {
                ...shopper.toJSON(),
                email: user ? user.email : null,  // Include email if found, otherwise null
                active: user ? user.isActive : null,  // Include active status if found, otherwise null
            };
        }));

        // Return a successful response with the list of shoppers and their details
        return res.status(200).json({ message: "Shoppers retrieved successfully", shoppers: shoppersWithEmail, ok: true });
    } catch (error) {
        // Log error and return a server error response
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Deactivates a user account.
 * @param {Object} req - The request object containing the email to deactivate.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of deactivation.
 */
const deactivateUser = async (req, res) => {
    try {
        const { email } = req.body;  // Retrieve email from the request

        // Find the user in UserModel based on the email
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Set the user's status to inactive
        await user.update({ isActive: false });

        return res.status(200).json({ message: "User deactivated successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

/**
 * Activates a user account.
 * @param {Object} req - The request object containing the email to activate.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of activation.
 */
const activateUser = async (req, res) => {
    try {
        const { email } = req.body;  // Retrieve email from the request

        // Find the user in UserModel based on the email
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Set the user's status to active
        await user.update({ isActive: true });

        return res.status(200).json({ message: "User activated successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};


/**
 * Admin function to delete a user account (seller or shopper) if there are no active transactions.
 * @param {Object} req - The request object containing the email and userType to delete.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of deletion.
 */
const deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, userType } = req.body; // Retrieve email and userType from request

        // Find the user by email in UserModel
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Mencari shopperId atau sellerId berdasarkan userId dari token (diambil dari UserModel)
        let shopper = null;
        let seller = null;

        if (userType === 'shopper') {
            // Find the shopper with the corresponding userId
            shopper = await ShopperModel.findOne({ where: { userId: user.id } });

            if (!shopper) {
                return res.status(404).json({ message: "Shopper not found", ok: false });
            }

            // Check if the shopper has active orders (status Pending or Shipped)
            const activeOrder = await OrderItemModel.findOne({
                where: {
                    shopperId: shopper.id,
                    shippingStatus: {
                        [Op.in]: ['Pending', 'Shipped'],
                    },
                },
            });

            if (activeOrder) {
                return res.status(400).json({ message: "User has active orders and cannot be deleted", ok: false });
            }
        } else if (userType === 'seller') {
            // Find the seller with the corresponding userId
            seller = await SellerModel.findOne({ where: { userId: user.id } });

            if (!seller) {
                return res.status(404).json({ message: "Seller not found", ok: false });
            }

            // Check if the seller has active orders (status Pending or Shipped)
            const activeOrder = await SellerOrderModel.findOne({
                where: {
                    sellerId: seller.id,
                    shippingStatus: {
                        [Op.in]: ['Pending', 'Shipped'],
                    },
                },
            });

            if (activeOrder) {
                return res.status(400).json({ message: "User has active orders and cannot be deleted", ok: false });
            }
        } else {
            return res.status(400).json({ message: "Invalid user type", ok: false });
        }

        // Delete process after no active orders
        await user.destroy({ transaction });

        // Commit transaction after deletion
        await transaction.commit();

        return res.status(200).json({ message: "User and associated data deleted successfully", ok: true });
    } catch (error) {
        // Rollback if any error occurs
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during deletion", ok: false });
    }
};
/**
 * Registers a new admin in the system.
 * 
 * @param {Object} req - The request object containing admin details.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of admin registration.
 */
const registerAdmin = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, password, name, phoneNumber } = req.body;

        // Check if the email already exists in UserModel
        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use", ok: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with role "admin"
        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true, // User is active by default
        }, { transaction });

        // Create a new admin associated with the user
        const newAdmin = await AdminModel.create({
            name,
            phoneNumber,
            userId: newUser.id, // Link to the newly created user
        }, { transaction });

        // Commit the transaction after successful creation
        await transaction.commit();

        return res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newUser.email,
                phoneNumber: newAdmin.phoneNumber,
            },
            ok: true,
        });
    } catch (error) {
        await transaction.rollback(); // Rollback the transaction in case of error
        console.error(error);
        return res.status(500).json({ message: "Server error during admin registration", ok: false });
    }
};

export { viewAllSellers, viewAllShoppers, deactivateUser, deleteUser, registerAdmin, activateUser };
