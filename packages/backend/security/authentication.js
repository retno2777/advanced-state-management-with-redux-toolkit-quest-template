import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

/**
 * Middleware to verify the token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const tokenVerification = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).send({
            ok: false,
            message: "Token is not provided or invalid",
            status: 403,
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jsonwebtoken.verify(token, config.TOKEN);

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            isActive: decoded.isActive
        };

        next();
    } catch (error) {
        console.error("Failed to authenticate token:", error);
        return res.status(401).send({
            ok: false,
            message: "Failed to authenticate token.",
            status: 401,
        });
    }
};
// Middleware to check if the user is active
const isActiveCheck = (req, res, next) => {
    try {
        // Check the isActive status from the decoded token
        if (!req.user.isActive) {
            return res.status(403).json({
                ok: false,
                message: "Your account is deactivated.",
                status: 403,
            });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error("Failed to check user active status from token", error);
        return res.status(500).json({
            ok: false,
            message: "Server error while checking user status",
            status: 500,
        });
    }
};


// Middleware to check admin access role
const adminAccess = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            ok: false,
            message: "Access denied: Admins only.",
            status: 403,
        });
    }
    next(); // Proceed if the role is admin
};

// Middleware to check seller access role
const sellerAccess = (req, res, next) => {
    if (req.user.role !== "seller") {
        return res.status(403).json({
            ok: false,
            message: "Access denied: Sellers only.",
            status: 403,
        });
    }
    next(); // Proceed if the role is seller
};

// Middleware to check shopper access role
const shopperAccess = (req, res, next) => {
    if (req.user.role !== "shopper") {
        return res.status(403).json({
            ok: false,
            message: "Access denied: Shoppers only.",
            status: 403,
        });
    }
    next(); // Proceed if the role is shopper
};

export { tokenVerification, isActiveCheck, adminAccess, sellerAccess, shopperAccess };
