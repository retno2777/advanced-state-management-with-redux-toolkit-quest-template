import { UserModel } from "../../models/UserModel.js";
import { SellerModel } from "../../models/SellerModel.js";
import { ShopperModel } from "../../models/ShopperModel.js";  // Pastikan ShopperModel diimport
import bcrypt from "bcryptjs";
import { sequelizePharma as sequelize } from "../../database/db.js";  // Import sequelize instance

const register = async (req, res) => {
    const t = await sequelize.transaction();  // Start a transaction
    try {
        let { role, firstName, lastName, name, storeName, password, email, address, phoneNumber, birthDay } = req.body;

        // Basic input validation
        if (!role || !password || !email) {
            return res.status(400).json({ message: "Role, email, and password are required", ok: false });
        }

        // Validate the role
        const validRoles = ['seller', 'shopper'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role", ok: false });
        }

        // Check if the email is already in use
        const emailExists = await UserModel.findOne({ where: { email: email } });
        if (emailExists) {
            return res.status(400).json({ message: "Email is already taken", ok: false });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Register the user in UserModel
        const user = await UserModel.create({
            email: email,
            password: hashedPassword,
            role: role,
            isActive: true,  // Default: user is active when registered
        }, { transaction: t });  // Attach to transaction

        // Logic for seller registration
        if (role === "seller") {
            if (!storeName || !phoneNumber || !name) {
                return res.status(400).json({ message: "Store name, phone number, and name are required for sellers", ok: false });
            }

            // Create seller data
            await SellerModel.create({
                name: name,
                storeName: storeName,
                address: address || null,
                phoneNumber: phoneNumber,
                userId: user.id,
            }, { transaction: t });  // Attach to transaction

            // Commit the transaction if everything is successful
            await t.commit();
            return res.status(200).json({ message: "Seller registered successfully", ok: true });

        }
        // Logic for shopper registration
        else if (role === "shopper") {
            if (!firstName || !lastName || !phoneNumber) {
                return res.status(400).json({ message: "First name, last name, and phone number are required for shoppers", ok: false });
            }

            // Create shopper data
            await ShopperModel.create({
                firstName: firstName,
                lastName: lastName,
                birthDay: birthDay || null,
                address: address || null,
                phoneNumber: phoneNumber,
                userId: user.id,
            }, { transaction: t });  // Attach to transaction

            // Commit the transaction if everything is successful
            await t.commit();
            return res.status(200).json({ message: "Shopper registered successfully", ok: true });
        }

    } catch (error) {
        // Rollback the transaction in case of an error
        await t.rollback();

        // Optionally, log the error for debugging
        console.error(error);
        return res.status(500).json({ message: "Server error", ok: false });
    }
};

export default register;
