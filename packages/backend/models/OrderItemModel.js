import { DataTypes, Model } from "sequelize";

class OrderItemModel extends Model {
    static associate(models) {
        this.belongsTo(models.ShopperModel, { foreignKey: 'shopperId', onDelete: 'CASCADE' });
        this.belongsTo(models.ProductModel, { foreignKey: 'productId' });
        this.belongsTo(models.SellerModel, { foreignKey: 'sellerId' });
    }
}

// Function to initialize the model
const initOrderItemModel = (sequelize) => {
    OrderItemModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            orderDate: {
                type: DataTypes.DATE,
                allowNull: false,  // The date when the order is placed
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
                    min: 0,  // Total amount should be a positive value
                },
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
                defaultValue: "Pending",  // Default status when the order is created
            },
            paymentStatus: {
                type: DataTypes.ENUM("Pending", "Paid", "Refunded"),
                allowNull: false,
                defaultValue: "Pending",  // Default status when the order is created
            },
            shopperId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'shoppers',  // String reference to ShopperModel
                    key: "id",
                },
                onDelete: "CASCADE",  // If shopper is deleted, the associated orders are also deleted
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',  // String reference to ProductModel
                    key: "id",
                }
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sellers',  // String reference to SellerModel
                    key: "id",
                }
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "orderItems",  // Model name in the database
        }
    );
};

export { OrderItemModel, initOrderItemModel };
