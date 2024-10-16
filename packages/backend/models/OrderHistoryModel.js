import { DataTypes, Model } from "sequelize";

class OrderHistoryModel extends Model {
    static associate(models) {
        this.belongsTo(models.ShopperModel, { foreignKey: 'shopperId', onDelete: 'CASCADE' });
        this.belongsTo(models.ProductModel, { foreignKey: 'productId', onDelete: 'SET NULL' });
        this.belongsTo(models.SellerModel, { foreignKey: 'sellerId', onDelete: 'SET NULL' });
    }
}

// Function to initialize the model
const initOrderHistoryModel = (sequelize) => {
    OrderHistoryModel.init(
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
                type: DataTypes.ENUM(
                    "Pending", 
                    "Shipped", 
                    "Delivered", 
                    "Returned", 
                    "Cancelled", 
                    "Refund Requested"
                ),
                allowNull: false,
                defaultValue: "Pending",  // Default shipping status is "Pending"
            },
            shopperId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'shoppers',  // Using string reference to ShopperModel
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: true,  // Product might be deleted from the system
                references: {
                    model: 'products',  // Using string reference to ProductModel
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'sellers',  // Using string reference to SellerModel
                    key: "id",
                },
                onDelete: "SET NULL",
            },
            deliveryDate: {
                type: DataTypes.DATE,
                allowNull: true,  // Optional delivery date
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "orderHistory",
            tableName: "order_history",
            timestamps: true,  // Store createdAt and updatedAt timestamps
        }
    );
};

export { OrderHistoryModel, initOrderHistoryModel };
