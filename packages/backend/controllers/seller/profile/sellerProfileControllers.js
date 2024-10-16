import bcrypt from "bcryptjs";
import { SellerModel } from "../../../models/SellerModel.js";
import { UserModel } from "../../../models/UserModel.js";  
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";  
import { Op } from 'sequelize';

/**
 * Converts an image buffer to a base64 string
 * @param {Buffer} imageBuffer - The image buffer to convert
 * @returns {String} - The base64 string representation of the image, or null if the imageBuffer is null or undefined
 */
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

/**
 * Loads the seller's profile information.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the seller's profile information.
 */
const loadProfile = async (req, res) => {
    try {
        // Retrieve sellerId from the token
        const sellerId = req.user.userId;

        // Find the seller in the database
        const seller = await SellerModel.findOne({
            where: { userId: sellerId },
            attributes: { exclude: ['password'] }, // Exclude password from the response
        });

        // Return if seller not found
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                ok: false,
                status: 404,
            });
        }

        // Convert profile picture to Base64 if available
        const profilePicture = seller.profilePicture
            ? `data:${seller.pictureFormat};base64,${convertImageToBase64(seller.profilePicture)}`
            : null;

        // Respond with the loaded profile information
        return res.status(200).json({
            message: "Profile loaded successfully",
            ok: true,
            status: 200,
            seller: { ...seller.toJSON(), profilePicture },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

/**
 * Update seller profile
 * @param {Object} req - The request object containing user information
 * @param {Object} res - The response object for sending the response
 * @returns {Promise} - Resolves to a JSON response with the updated seller's profile
 */
const updateProfile = async (req, res) => {
    try {
        const sellerId = req.user.userId; // Retrieve sellerId from token

        // Get the seller from the database
        const seller = await SellerModel.findOne({ where: { userId: sellerId } });

        // If seller not found, return a 404 response
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                ok: false,
                status: 404,
            });
        }

        // Update seller profile with the new information
        await seller.update({
            name: req.body.name,
            storeName: req.body.storeName,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            profilePicture: req.file ? req.file.buffer : seller.profilePicture, // Update picture if available
            pictureFormat: req.file ? req.file.mimetype : seller.pictureFormat,  // Update picture format
        });

        // Respond with a success message and the updated seller's profile
        return res.status(200).json({
            message: "Profile updated successfully",
            ok: true,
            status: 200,
            seller,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

/**
 * Change seller password in UserModel.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the result of changing the password.
 */
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from token (UserModel ID)
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old password and new password are required",
                ok: false,
                status: 400,
            });
        }

        // Find the seller's user account in UserModel
        const user = await UserModel.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                ok: false,
                status: 404,
            });
        }

        // Check if the old password is correct
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Old password is incorrect",
                ok: false,
                status: 401,
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in UserModel
        await user.update({ password: hashedPassword });

        return res.status(200).json({
            message: "Password changed successfully",
            ok: true,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

/**
 * Changes the seller's email address.
 * @param {Object} req - The request object containing user information and email details.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of the email change.
 */
const changeEmail = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from token (UserModel ID)
        const { currentEmail, newEmail, password } = req.body; // Accept currentEmail, newEmail, and password from frontend

        // Validate input fields
        if (!currentEmail || !newEmail || !password) {
            return res.status(400).json({
                message: "Current email, new email, and password are required",
                ok: false,
                status: 400,
            });
        }

        // Find the user in UserModel
        const user = await UserModel.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                ok: false,
                status: 404,
            });
        }

        // Check if the currentEmail matches the email in the database
        if (user.email !== currentEmail) {
            return res.status(400).json({
                message: "Current email does not match",
                ok: false,
                status: 400,
            });
        }

        // Verify the user's password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                ok: false,
                status: 401,
            });
        }

        // Check if the new email is already in use
        const existingEmail = await UserModel.findOne({ where: { email: newEmail } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use", ok: false });
        }

        // Update the email in UserModel
        await user.update({ email: newEmail });

        return res.status(200).json({
            message: "Email changed successfully",
            ok: true,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            ok: false,
            status: 500,
        });
    }
};
/**
 * Deletes the seller's profile after checking for active transactions.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating success or failure of profile deletion.
 */
const deleteProfile = async (req, res) => {
    try {
        // Retrieve userId from the authenticated user's token
        const userId = req.user.userId;

        // Find the seller in the database using the userId
        const seller = await SellerModel.findOne({ where: { userId } });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found", ok: false, status: 404 });
        }

        const sellerId = seller.id; // Get sellerId from the SellerModel query result

        // Check for active transactions for this seller
        const activeOrders = await SellerOrderModel.findOne({
            where: {
                sellerId,
                shippingStatus: {
                    [Op.in]: ["Pending", "Shipped", "Delivered"] // Use Op.in to check status
                }
            }
        });

        if (activeOrders) {
            return res.status(400).json({ message: "Cannot delete profile. Active transactions exist.", ok: false });
        }

        // Delete the seller and user account if no active transactions exist
        await seller.destroy(); // Delete from SellerModel table
        await UserModel.destroy({ where: { id: userId } }); // Delete from UserModel

        return res.status(200).json({ message: "Profile deleted successfully", ok: true, status: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

export { loadProfile, updateProfile, changePassword, changeEmail, deleteProfile };
