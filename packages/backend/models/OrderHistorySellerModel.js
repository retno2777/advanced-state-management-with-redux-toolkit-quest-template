import { DataTypes, Model } from "sequelize";

class OrderHistorySellerModel extends Model {
    static associate(models) {
        this.belongsTo(models.ShopperModel, { foreignKey: 'shopperId', onDelete: 'SET NULL' });
        this.belongsTo(models.ProductModel, { foreignKey: 'productId', onDelete: 'SET NULL' });
        this.belongsTo(models.SellerModel, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
    }
}

// Function to initialize the model
const initOrderHistorySellerModel = (sequelize) => {
    OrderHistorySellerModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            orderDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,  // Minimum quantity should be 1
                },
            },
            totalAmount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    min: 0,  // Total amount should be a positive number
                },
            },
            paymentStatus: {
                type: DataTypes.ENUM("Pending", "Paid", "Refunded"),
                allowNull: false,
                defaultValue: "Pending",  // Default payment status is "Pending"
            },
            shippingStatus: {
                type: DataTypes.ENUM("Pending", "Shipped", "Delivered", "Returned", "Cancelled", "Refund Requested"),
                allowNull: false,
                defaultValue: "Pending",  // Default shipping status is "Pending"
            },
            shopperId: {
                type: DataTypes.INTEGER,
                allowNull: true,  // Shopper might be deleted from the system
                references: {
                    model: 'shoppers',  // String reference to ShopperModel
                    key: "id",
                },
                onDelete: "SET NULL",  // Keep history even if the shopper is deleted
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'products',  // String reference to ProductModel
                    key: "id",
                },
                onDelete: "SET NULL",  // Product might be deleted, but order history remains
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sellers',  // String reference to SellerModel
                    key: "id",
                },
                onDelete: "CASCADE",  // If the seller is deleted, their order history is also deleted
            },
            deliveryDate: {
                type: DataTypes.DATE,
                allowNull: true,  // Optional delivery date
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "orderHistorySeller",
            tableName: "order_history_seller",  // Table name in the database
            timestamps: true,  // Store createdAt and updatedAt timestamps
        }
    );
};

export { OrderHistorySellerModel, initOrderHistorySellerModel };
