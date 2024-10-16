import { Router } from "express";
import login from "../controllers/authentication/login.js";
import register from "../controllers/authentication/register.js";
import { registerAdmin } from "../controllers/admin/adminUserManagementController.js"; 
import {viewLimitedProducts} from "../controllers/product/productControllers.js";

const authRoute = Router();

// Route for user registration
authRoute.post("/register", register);

// Route for user registration
authRoute.post("/register-admin", registerAdmin);

// Route for product home
authRoute.get("/view-products", viewLimitedProducts);

// Route for user login
authRoute.post("/login", login);

export default authRoute;
