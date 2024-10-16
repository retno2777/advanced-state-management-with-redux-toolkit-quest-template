import { UserModel } from "../../models/UserModel.js";  // Import UserModel and init function
import { AdminModel } from "../../models/AdminModel.js"; // Import AdminModel and init function
import { SellerModel} from "../../models/SellerModel.js"; // Import SellerModel and init function
import { ShopperModel } from "../../models/ShopperModel.js"; // Import ShopperModel and init function
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                ok: false,
                status: 400,
            });
        }

        // Find user by email in UserModel
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
                ok: false,
                status: 404,
            });
        }
        const isActive = user.isActive;

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                ok: false,
                status: 401,
            });
        }

        // Based on role, retrieve specific data from the appropriate role model
        let roleData;
        if (user.role === "admin") {
            roleData = await AdminModel.findOne({ where: { userId: user.id } });
        } else if (user.role === "seller") {
            roleData = await SellerModel.findOne({ where: { userId: user.id } });
        } else if (user.role === "shopper") {
            roleData = await ShopperModel.findOne({ where: { userId: user.id } });
        }

        // If no data is found in the corresponding role model
        if (!roleData) {
            return res.status(404).json({
                message: `User data not found in the associated role model (${user.role})`,
                ok: false,
                status: 404,
            });
        }

        // Create JWT token with user role and isActive status
        const token = jsonwebtoken.sign(
            {
                email: user.email,
                userId: user.id,
                role: user.role,
                isActive: user.isActive,  // Add isActive status to the token
            },
            config.TOKEN,
            { expiresIn: '1d' }  // Token valid for 1 day
        );

        // Return response with token and user data
        return res.status(200).json({
            token: token,  // Only return token in JSON
            email: user.email,
            role: user.role,
            isActive: user.isActive,  // Include active status in the response
            userDetails: roleData,  // Send additional data from role model
            status: 200,
            ok: true,
        });

    } catch (err) {
        console.error(err);  // Error logging
        return res.status(503).json({
            message: "Internal server error",
            status: 503,
            ok: false,
        });
    }
};

export default login;
