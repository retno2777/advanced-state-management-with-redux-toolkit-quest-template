import { ShopperModel } from "../../../models/ShopperModel.js";
import { UserModel } from "../../../models/UserModel.js";
import { OrderItemModel } from "../../../models/OrderItemModel.js";
import bcrypt from "bcryptjs";
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
 * Loads the profile of the shopper
 * @param {Object} req - The request object containing user information
 * @param {Object} res - The response object for sending the response
 * @returns {Promise} - Resolves to a JSON response with the shopper's profile information
 */
const loadProfile = async (req, res) => {
    try {
        const shopperId = req.user.userId; // Retrieve shopperId from the authenticated user's token

        // Query ShopperModel to get the shopper by userId
        const shopper = await ShopperModel.findOne({
            where: { userId: shopperId },
            attributes: { exclude: ['password'] }, // Exclude password from the response
        });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Convert profile picture to Base64 if available
        const profilePicture = shopper.profilePicture
            ? `data:${shopper.pictureFormat};base64,${convertImageToBase64(shopper.profilePicture)}`
            : null;

        return res.status(200).json({
            message: "Profile loaded successfully",
            ok: true,
            shopper: { ...shopper.toJSON(), profilePicture },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};


/**
 * Update the shopper's profile information.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with the updated shopper's profile.
 */
const updateProfile = async (req, res) => {
    try {
        const shopperId = req.user.userId; // Retrieve shopperId from the authenticated user's token
        const { firstName, lastName, address, phoneNumber, birthDay } = req.body;

        // Find the shopper in the database
        const shopper = await ShopperModel.findOne({ where: { userId: shopperId } });

        // If shopper is not found, return a 404 response
        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Update the shopper's profile with the new information
        await shopper.update({
            firstName,
            lastName,
            address,
            phoneNumber,
            birthDay,
            profilePicture: req.file ? req.file.buffer : shopper.profilePicture, // Update profile picture if available
            pictureFormat: req.file ? req.file.mimetype : shopper.pictureFormat, // Update picture format
        });

        // Respond with a success message and the updated shopper's profile
        return res.status(200).json({
            message: "Profile updated successfully",
            ok: true,
            shopper,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

/**
 * Changes the shopper's password
 * @param {Object} req - The request object containing old password, new password, and user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response with whether the password was changed successfully or not.
 */
const changePassword = async (req, res) => {
    try {
        const shopperId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        // Find the shopper in the database
        const shopper = await UserModel.findOne({ where: { id: shopperId } });

        // If shopper is not found, return a 404 response
        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Check if the old password is correct
        const passwordMatch = await bcrypt.compare(oldPassword, shopper.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect", ok: false });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        await shopper.update({ password: hashedPassword });

        // Respond with a success message
        return res.status(200).json({ message: "Password changed successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

/**
 * Changes the shopper's email address.
 * @param {Object} req - The request object containing user information and new email details.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating the success or failure of the email change.
 */
const changeEmail = async (req, res) => {
    try {
        const shopperId = req.user.userId; // Retrieve userId from the authenticated user's token
        const { newEmail, currentEmail, password } = req.body; // Extract newEmail, currentEmail, and password from request body

        // Validate if newEmail, currentEmail, or password are missing
        if (!newEmail || !currentEmail || !password) {
            return res.status(400).json({
                message: "Current email, new email, and password are required",
                ok: false
            });
        }

        // Find the user in UserModel using the userId
        const shopper = await UserModel.findOne({ where: { id: shopperId } });

        // If the user is not found, return a 404 response
        if (!shopper) {
            return res.status(404).json({
                message: "User not found",
                ok: false
            });
        }

        // Validate whether the currentEmail matches the email in the database
        if (shopper.email !== currentEmail) {
            return res.status(400).json({
                message: "Current email does not match our records",
                ok: false
            });
        }

        // Verify the user's password
        const isPasswordValid = await bcrypt.compare(password, shopper.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                ok: false
            });
        }

        // Check if the new email is already in use by another user
        const existingEmail = await UserModel.findOne({ where: { email: newEmail } });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already in use",
                ok: false
            });
        }

        // Update the user's email in the database
        await shopper.update({ email: newEmail });

        // Respond with a success message upon successful email change
        return res.status(200).json({
            message: "Email updated successfully. Please verify your new email.",
            ok: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            ok: false
        });
    }
};

/**
 * Deletes the shopper's profile if there are no active transactions.
 * @param {Object} req - The request object containing user information.
 * @param {Object} res - The response object for sending the response.
 * @returns {Promise} - Resolves to a JSON response indicating success or failure of profile deletion.
 */
const deleteProfile = async (req, res) => {
    try {
        // Retrieve userId from the authenticated user's token
        const userId = req.user.userId;

        // Find the shopper in the database using the userId
        const shopper = await ShopperModel.findOne({ where: { userId: userId } });
        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Check for active transactions with statuses 'Pending' or 'Shipped'
        const activeOrder = await OrderItemModel.findOne({
            where: {
                shopperId: shopper.id,
                shippingStatus: {
                    [Op.in]: ['Pending', 'Shipped'],
                },
            },
        });

        // If active transactions exist, prevent profile deletion
        if (activeOrder) {
            return res.status(400).json({ message: "Cannot delete profile. There are active transactions.", ok: false });
        }

        // Delete the shopper's profile from the database
        await shopper.destroy();
        // Also remove corresponding user account from UserModel
        await UserModel.destroy({ where: { id: shopper.userId } });

        // Respond with a success message upon successful deletion
        return res.status(200).json({ message: "Profile deleted successfully", ok: true });
    } catch (error) {
        console.error(error);
        // Return a server error response if an exception occurs
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

export { loadProfile, updateProfile, changePassword, deleteProfile, changeEmail };
