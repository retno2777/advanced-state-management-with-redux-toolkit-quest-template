import { Sequelize } from "sequelize";
import { UserModel, initUserModel } from "../models/UserModel.js";
import { ShopperModel, initShopperModel } from "../models/ShopperModel.js";
import { ProductModel, initProductModel } from "../models/ProductModel.js"; // Include init function
import { CartModel, initCartModel } from "../models/CartModel.js"; // Include init function
import { OrderHistoryModel, initOrderHistoryModel } from "../models/OrderHistoryModel.js"; // Include init function
import { SellerModel, initSellerModel } from "../models/SellerModel.js"; // Include init function
import { OrderItemModel, initOrderItemModel } from "../models/OrderItemModel.js"; // Include init function
import { SellerOrderModel, initSellerOrderModel } from "../models/SellerOrderModel.js"; // Include init function
import { OrderHistorySellerModel, initOrderHistorySellerModel } from "../models/OrderHistorySellerModel.js"; // Include init function
import { AdminModel, initAdminModel } from "../models/AdminModel.js"; // Include init function

// Changing the database name to pharmaDB.sqlite
const sequelizePharma = new Sequelize({
    database: "pharmaDB",
    dialect: "sqlite",
    storage: "./database/pharmaDB.sqlite",
    logging: false,
});

// Initialize models
initUserModel(sequelizePharma); // Initialize UserModel
initShopperModel(sequelizePharma); // Initialize ShopperModel
initProductModel(sequelizePharma); // Initialize ProductModel
initCartModel(sequelizePharma); // Initialize CartModel
initOrderHistoryModel(sequelizePharma); // Initialize OrderHistoryModel
initSellerModel(sequelizePharma); // Initialize SellerModel
initOrderItemModel(sequelizePharma); // Initialize OrderItemModel
initSellerOrderModel(sequelizePharma); // Initialize SellerOrderModel
initOrderHistorySellerModel(sequelizePharma); // Initialize OrderHistorySellerModel
initAdminModel(sequelizePharma); // Initialize AdminModel

// Call associate methods after all models are initialized
UserModel.associate({ ShopperModel, SellerModel, AdminModel });
ShopperModel.associate({ UserModel, CartModel, OrderItemModel, OrderHistoryModel, SellerOrderModel });
SellerModel.associate({ UserModel, ProductModel, OrderItemModel, SellerOrderModel, OrderHistoryModel, OrderHistorySellerModel });
ProductModel.associate({ SellerModel, CartModel, OrderItemModel, OrderHistoryModel, SellerOrderModel, OrderHistorySellerModel });
CartModel.associate({ ShopperModel, ProductModel });
OrderItemModel.associate({ ShopperModel, ProductModel, SellerModel });
SellerOrderModel.associate({ SellerModel, ProductModel, ShopperModel, OrderItemModel });
OrderHistoryModel.associate({ ShopperModel, ProductModel, SellerModel });
OrderHistorySellerModel.associate({ ShopperModel, ProductModel, SellerModel, OrderItemModel });

// Function to sync and authenticate the database
const syncDatabase = async () => {
    try {
        await sequelizePharma.authenticate();
        console.log("Connection established for pharmaDB");

        await sequelizePharma.sync({ force: false });
        console.log("Database is synchronized for pharmaDB");
    } catch (err) {
        console.error("Unable to connect or synchronize to pharmaDB database: ", err);
    }
};

// Sync the database when this module is called
syncDatabase();

export { sequelizePharma }; // named export
