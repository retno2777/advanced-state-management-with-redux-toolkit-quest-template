import { DataTypes, Model } from "sequelize";  

class SellerOrderModel extends Model {
    static associate(models) {
        // Define associations
        this.belongsTo(models.SellerModel, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
        this.belongsTo(models.ProductModel, { foreignKey: 'productId', onDelete: 'CASCADE' });
        this.belongsTo(models.ShopperModel, { foreignKey: 'shopperId', onDelete: 'CASCADE' });
        this.belongsTo(models.OrderItemModel, { foreignKey: 'shopperOrderId', onDelete: 'CASCADE' });
    }
}

// Function to initialize the model
const initSellerOrderModel = (sequelize) => {
    SellerOrderModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,  // Automatically increment the order ID
            },
            orderDate: {
                type: DataTypes.DATE,
                allowNull: false,
                comment: "The date when the order was placed by the shopper",
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,  // Ensure at least 1 item is ordered
                },
                comment: "The quantity of items ordered in the order",
            },
            totalAmount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    min: 0,  // Ensure the total amount is not negative
                },
                comment: "The total price for the ordered items",
            },
            shippingStatus: {
                type: DataTypes.ENUM("Pending", "Shipped", "Delivered", "Returned", "Cancelled", "Refund Requested"),
                allowNull: false,
                defaultValue: "Pending",  // Default status when the order is created
                comment: "The shipping status of the order, including Refund Requested",
            },
            paymentStatus: {
                type: DataTypes.ENUM("Pending", "Paid", "Refunded"),
                allowNull: false,
                defaultValue: "Pending",  // Default status when the order is created
                comment: "The payment status of the order",
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sellers',  // String reference to SellerModel
                    key: "id",
                },
                onDelete: "CASCADE",
                comment: "Reference to the Seller selling the product",
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',  // String reference to ProductModel
                    key: "id",
                },
                onDelete: "CASCADE",
                comment: "Reference to the ordered product",
            },
            shopperId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'shoppers',  // String reference to ShopperModel
                    key: "id",
                },
                onDelete: "CASCADE",
                comment: "Reference to the Shopper placing the order",
            },
            shopperOrderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'orderItems',  // String reference to OrderItemModel
                    key: "id",
                },
                onDelete: "CASCADE",
                comment: "Reference to the orderId from ShopperOrderItem",
            },
            deliveryDate: {
                type: DataTypes.DATE,
                allowNull: true,
                comment: "The date when the order was delivered, if shipped",
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "sellerOrders",
            tableName: "seller_orders",  // Optional table name in the database
            timestamps: true,  // Adds createdAt and updatedAt columns
        }
    );
};

export { SellerOrderModel, initSellerOrderModel };
