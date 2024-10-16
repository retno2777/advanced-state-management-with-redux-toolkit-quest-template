import { DataTypes, Model } from "sequelize";

class ProductModel extends Model {
    static associate(models) {
        this.belongsTo(models.SellerModel, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
    }
}

// Function to initialize the model
const initProductModel = (sequelize) => {
    ProductModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,  // Automatically increment product ID
            },
            productName: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: [1, 255],  // Limit the length of the product name
                },
            },
            price: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    min: 0,  // Ensure the price is not negative
                },
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,  // Ensure stock quantity is not negative
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
                validate: {
                    len: [0, 1000],  // Maximum 1000 characters for the description
                },
            },
            productImage: {
                type: DataTypes.BLOB("long"),  // Stores large binary objects (image)
                allowNull: true,
            },
            pictureFormat: {
                type: DataTypes.STRING,  // Format of the image (e.g., image/jpeg or image/png)
                allowNull: true,
            },
            expiry_date: {  // Field for expiry date
                type: DataTypes.DATE,  // Date type for expiry date
                allowNull: true,  // Can be null if expiry date is not provided
            },
            sellerId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'sellers',  // String reference to SellerModel
                    key: "id",
                },
                onDelete: "CASCADE",  // Delete products if the associated seller is deleted
            },
        },
        {
            sequelize,  // Pass sequelize instance
            modelName: "products",  // Table name in the database
            timestamps: true,  // Adds createdAt and updatedAt columns
        }
    );
};

export { ProductModel, initProductModel };
