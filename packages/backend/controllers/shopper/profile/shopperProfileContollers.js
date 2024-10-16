import {ShopperModel} from "../../../models/ShopperModel.js";
import {UserModel} from "../../../models/UserModel.js";  // Connects to UserModel
import {OrderItemModel} from "../../../models/OrderItemModel.js";  // Connects to OrderItemModel to check transactions
import bcrypt from "bcryptjs";

// Function to convert image buffer to Base64
const convertImageToBase64 = (imageBuffer) => {
    return imageBuffer ? imageBuffer.toString('base64') : null;
};

// Load Profile
const loadProfile = async (req, res) => {
    try {
        const shopperId = req.user.userId;

        const shopper = await ShopperModel.findOne({
            where: { userId: shopperId },
            attributes: { exclude: ['password'] },
        });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Convert profile picture to Base64
        const profilePicture = shopper.profilePicture
            ? `data:${shopper.pictureFormat};base64,${convertImageToBase64(shopper.profilePicture)}`
            : null;

        return res.status(200).json({
            message: "Profile loaded successfully",
            ok: true,
            status: 200,
            shopper: { ...shopper.toJSON(), profilePicture },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {
        const shopperId = req.user.userId;
        const { firstName, lastName, address, phoneNumber, birthDay } = req.body;

        const shopper = await ShopperModel.findOne({ where: { userId: shopperId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        await shopper.update({
            firstName,
            lastName,
            address,
            phoneNumber,
            birthDay,
            profilePicture: req.file ? req.file.buffer : shopper.profilePicture,
            pictureFormat: req.file ? req.file.mimetype : shopper.pictureFormat,
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            ok: true,
            status: 200,
            shopper,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {
        const shopperId = req.user.userId;
        const { oldPassword, newPassword } = req.body;

        const shopper = await UserModel.findOne({ where: { id: shopperId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        const passwordMatch = await bcrypt.compare(oldPassword, shopper.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Old password is incorrect", ok: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await shopper.update({ password: hashedPassword });

        return res.status(200).json({ message: "Password changed successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

const changeEmail = async (req, res) => {
    try {
        const shopperId = req.user.userId; // Retrieve the user ID from the token (UserModel ID)
        const { newEmail, password } = req.body; // Accept newEmail and password from the frontend

        // Check if newEmail and password are provided
        if (!newEmail || !password) {
            return res.status(400).json({ message: "New email and password are required", ok: false });
        }

        // Find the shopper by ID in the database
        const shopper = await UserModel.findOne({ where: { id: shopperId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        // Verify the provided password with the hashed password stored in the database
        const isPasswordValid = await bcrypt.compare(password, shopper.password); // bcrypt.compare returns true if the password is valid
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password", ok: false });
        }

        // Check if the new email is already in use
        const existingEmail = await UserModel.findOne({ where: { email: newEmail } });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use", ok: false });
        }

        // Update the user's email
        await shopper.update({ email: newEmail });

        return res.status(200).json({ message: "Email updated successfully. Please verify your new email.", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

// Delete Profile (Only if there are no active transactions)
const deleteProfile = async (req, res) => {
    try {
        const shopperId = req.user.userId;

        // Check if there are active transactions (Pending or Shipped)
        const activeOrder = await OrderItemModel.findOne({
            where: {
                shopperId,
                shippingStatus: ['Pending', 'Shipped']
            }
        });

        if (activeOrder) {
            return res.status(400).json({ message: "Cannot delete profile. There are active transactions.", ok: false });
        }

        // If no active transactions, proceed with deleting the profile
        const shopper = await ShopperModel.findOne({ where: { userId: shopperId } });

        if (!shopper) {
            return res.status(404).json({ message: "Shopper not found", ok: false });
        }

        await shopper.destroy();
        await UserModel.destroy({ where: { id: shopper.userId } });

        return res.status(200).json({ message: "Profile deleted successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error", ok: false });
    }
};

export { loadProfile, updateProfile, changePassword, deleteProfile, changeEmail };
