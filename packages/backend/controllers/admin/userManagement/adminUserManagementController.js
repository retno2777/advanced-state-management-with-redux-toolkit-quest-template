import { SellerModel } from "../../../models/SellerModel.js";
import { ShopperModel } from "../../../models/ShopperModel.js";
import { UserModel } from "../../../models/UserModel.js"; // Model untuk user
import { sequelizePharma as sequelize } from "../../../database/db.js"; // Impor sequelizePharma sebagai sequelize
import bcrypt from "bcryptjs";
import { AdminModel } from "../../../models/AdminModel.js";

// Admin function untuk melihat semua sellers
const viewAllSellers = async (req, res) => {
    try {
        // Ambil semua sellers dari SellerModel
        const sellers = await SellerModel.findAll({
            attributes: ['id', 'name', 'storeName', 'phoneNumber', 'userId'],  // Atribut dari SellerModel termasuk userId
        });

        if (!sellers || sellers.length === 0) {
            return res.status(404).json({ message: "No sellers found", ok: false });
        }

        // Untuk setiap seller, ambil email dari UserModel berdasarkan userId
        const sellersWithEmail = await Promise.all(sellers.map(async (seller) => {
            const user = await UserModel.findOne({ where: { id: seller.userId }, attributes: ['email'] });
            return {
                ...seller.toJSON(),
                email: user ? user.email : null,  // Tambahkan email ke data seller
            };
        }));

        return res.status(200).json({ message: "Sellers retrieved successfully", sellers: sellersWithEmail, ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

// Admin function untuk melihat semua shoppers
const viewAllShoppers = async (req, res) => {
    try {
        // Ambil semua shoppers dari ShopperModel
        const shoppers = await ShopperModel.findAll({
            attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'address', 'userId'],  // Atribut dari ShopperModel termasuk userId
        });

        if (!shoppers || shoppers.length === 0) {
            return res.status(404).json({ message: "No shoppers found", ok: false });
        }

        // Untuk setiap shopper, ambil email dari UserModel berdasarkan userId
        const shoppersWithEmail = await Promise.all(shoppers.map(async (shopper) => {
            const user = await UserModel.findOne({ where: { id: shopper.userId }, attributes: ['email'] });
            return {
                ...shopper.toJSON(),
                email: user ? user.email : null,  // Tambahkan email ke data shopper
            };
        }));

        return res.status(200).json({ message: "Shoppers retrieved successfully", shoppers: shoppersWithEmail, ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

// Admin function untuk menonaktifkan user
const deactivateUser = async (req, res) => {
    try {
        const { email } = req.body;  // Ambil email dari request
        console.log(email);

        // Cari user di UserModel berdasarkan email
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Ubah status user menjadi inactive
        await user.update({ isActive: false });

        return res.status(200).json({ message: "User deactivated successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

const activateUser = async (req, res) => {
    try {
        const { email } = req.body;  // Ambil email dari request
        console.log(email);

        // Cari user di UserModel berdasarkan email
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Ubah status user menjadi inactive
        await user.update({ isActive: true });

        return res.status(200).json({ message: "User deactivated successfully", ok: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

// Admin function to delete a user account (seller or shopper) if there are no active transactions
const deleteUser = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, userType } = req.body; // Retrieve email and userType from request

        // Find the user by email in UserModel
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found", ok: false });
        }

        // Depending on userType, delete associated child model (shopper, seller, or admin)
        if (userType === 'shopper') {
            const shopper = await ShopperModel.findOne({ where: { userId: user.id } });
            if (shopper) {
                await shopper.destroy({ transaction }); // Delete shopper first
            }
        } else if (userType === 'seller') {
            const seller = await SellerModel.findOne({ where: { userId: user.id } });
            if (seller) {
                await seller.destroy({ transaction }); // Delete seller first
            }
        } else if (userType === 'admin') {
            const admin = await AdminModel.findOne({ where: { userId: user.id } });
            if (admin) {
                await admin.destroy({ transaction }); // Delete admin first
            }
        } else {
            return res.status(400).json({ message: "Invalid user type", ok: false });
        }

        // After deleting the child, delete the user from UserModel
        await user.destroy({ transaction });

        // Commit the transaction after successful deletion
        await transaction.commit();

        return res.status(200).json({ message: "User and associated data deleted successfully", ok: true });
    } catch (error) {
        // Rollback the transaction if there's an error
        await transaction.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error during deletion", ok: false });
    }
};
// Function untuk mendaftarkan admin baru
const registerAdmin = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, password, name, phoneNumber } = req.body;

        // Cek apakah email sudah ada di UserModel
        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use", ok: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru dengan role "admin"
        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true, // User aktif secara default
        }, { transaction });

        // Buat admin baru yang terkait dengan user
        const newAdmin = await AdminModel.create({
            name,
            phoneNumber,
            userId: newUser.id, // Kaitkan dengan user yang baru dibuat
        }, { transaction });

        // Commit transaksi setelah berhasil membuat
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
        await transaction.rollback(); // Rollback transaksi jika terjadi kesalahan
        console.error(error);
        return res.status(500).json({ message: "Server error during admin registration", ok: false });
    }
};

export { viewAllSellers, viewAllShoppers, deactivateUser, deleteUser, registerAdmin, activateUser };
