import { DataTypes, Model } from "sequelize";

class CartModel extends Model {
    static associate(models) {
        this.belongsTo(models.ShopperModel, { foreignKey: 'shopperId', onDelete: 'CASCADE' });
        this.belongsTo(models.ProductModel, { foreignKey: 'productId', onDelete: 'CASCADE' });
    }
}

// Function to initialize the model
const initCartModel = (sequelize) => {
    CartModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,  // Ensure that the quantity is at least 1
                },
            },
            shopperId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'shoppers',  // Using string reference for ShopperModel
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',  // Using string reference for ProductModel
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "cartItems",
            indexes: [
                {
                    unique: true,
                    fields: ["shopperId", "productId"],  // Ensure that the combination of shopperId and productId is unique
                },
            ],
        }
    );
};

export { CartModel, initCartModel };
