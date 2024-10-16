import bcrypt from "bcryptjs";
import { SellerModel } from "../../../models/SellerModel.js";
import { UserModel } from "../../../models/UserModel.js";  // Import UserModel since password and email are stored there
import { SellerOrderModel } from "../../../models/SellerOrderModel.js";  // Import model to check for active transactions

// Function to convert image buffer to Base64
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

// Load seller profile
const loadProfile = async (req, res) => {
    try {
        const sellerId = req.user.userId; // Retrieve sellerId from token

        const seller = await SellerModel.findOne({
            where: { userId: sellerId },
            attributes: { exclude: ['password'] }, // Exclude password
        });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                ok: false,
                status: 404,
            });
        }

        // Convert profile picture to Base64
        const profilePicture = seller.profilePicture
            ? `data:${seller.pictureFormat};base64,${convertImageToBase64(seller.profilePicture)}`
            : null;

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

// Update seller profile
const updateProfile = async (req, res) => {
    try {
        const sellerId = req.user.userId; // Retrieve sellerId from token

        const { name, storeName, address, phoneNumber } = req.body;

        const seller = await SellerModel.findOne({ where: { userId: sellerId } });
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                ok: false,
                status: 404,
            });
        }

        // Update seller profile
        await seller.update({
            name,
            storeName,
            address,
            phoneNumber,
            profilePicture: req.file ? req.file.buffer : seller.profilePicture, // Update picture if available
            pictureFormat: req.file ? req.file.mimetype : seller.pictureFormat,  // Update picture format
        });
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

// Change seller password (UserModel)
const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from token (UserModel ID)
        const { oldPassword, newPassword } = req.body;

        // Validasi input
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

// Change seller email (UserModel)
const changeEmail = async (req, res) => {
    try {
        const userId = req.user.userId;  // Retrieve userId from token (UserModel ID)
        const { currentEmail, newEmail, password } = req.body; // Accept currentEmail, newEmail, and password from frontend

        // Validasi input
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

        // Cek apakah currentEmail yang diberikan sesuai dengan email saat ini di database
        if (user.email !== currentEmail) {
            return res.status(400).json({
                message: "Current email does not match",
                ok: false,
                status: 400,
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // password yang diberikan dan password yang di-hash
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password",
                ok: false,
                status: 401,
            });
        }

        // Check if the new email is already used
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
// Delete seller profile, but check for active transactions first
const deleteProfile = async (req, res) => {
    try {
        const sellerId = req.user.userId;

        // Check if there are any active transactions for this seller
        const activeOrders = await SellerOrderModel.findOne({
            where: {
                sellerId,
                shippingStatus: ["Pending", "Shipped", "Delivered"]  // Only allow deletion if no active transactions
            }
        });

        if (activeOrders) {
            return res.status(400).json({
                message: "Cannot delete profile. Active transactions exist.",
                ok: false,
            });
        }

        // Proceed to delete seller and user account if no active transactions
        const seller = await SellerModel.findOne({ where: { userId: sellerId } });

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                ok: false,
                status: 404,
            });
        }

        await seller.destroy();
        await UserModel.destroy({ where: { id: seller.userId } });

        return res.status(200).json({
            message: "Profile deleted successfully",
            ok: true,
            status: 200,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

export { loadProfile, updateProfile, changePassword, changeEmail, deleteProfile };
