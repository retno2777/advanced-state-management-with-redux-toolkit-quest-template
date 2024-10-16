import { Router } from "express";
import { tokenVerification, isActiveCheck, adminAccess } from "../../security/authentication.js";
import { viewAllSellers, viewAllShoppers, deactivateUser, deleteUser,activateUser } from "../../controllers/admin/adminUserManagementController.js";

// Create a new router for admin
const adminRoute = Router();

// Route to view all sellers
adminRoute.get("/sellers", tokenVerification, isActiveCheck, adminAccess, viewAllSellers);

// Route to view all shoppers
adminRoute.get("/shoppers", tokenVerification, isActiveCheck, adminAccess, viewAllShoppers);

// Route to deactivate a user (seller/shopper)
adminRoute.put("/deactivate-user", tokenVerification, isActiveCheck, adminAccess, deactivateUser);

// Route to activate a user (seller/shopper)
adminRoute.put("/activate-user", tokenVerification, isActiveCheck, adminAccess, activateUser);

// Route to delete a user (seller/shopper)
adminRoute.delete("/delete-user", tokenVerification, isActiveCheck, adminAccess, deleteUser);

export default adminRoute;
