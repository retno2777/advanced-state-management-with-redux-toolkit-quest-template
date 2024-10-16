import { DataTypes, Model } from "sequelize";

class SellerModel extends Model {
    static associate(models) {
        // Define associations
        this.belongsTo(models.UserModel, { foreignKey: 'userId', onDelete: 'CASCADE' });  // Association with UserModel
        this.hasMany(models.ProductModel, { foreignKey: 'sellerId' });  // Association with ProductModel
        this.hasMany(models.OrderItemModel, { foreignKey: 'sellerId' });  // Association with OrderItemModel
        this.hasMany(models.SellerOrderModel, { foreignKey: 'sellerId' });  // Association with SellerOrderModel
        this.hasMany(models.OrderHistoryModel, { foreignKey: 'sellerId' });  // Association with OrderHistoryModel
        this.hasMany(models.OrderHistorySellerModel, { foreignKey: 'sellerId' });  // Association with OrderHistorySellerModel
    }
}

// Function to initialize the model
const initSellerModel = (sequelize) => {
    SellerModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,  // Automatically increment seller ID
        },
        storeName: {
            type: DataTypes.STRING,
            allowNull: false,  // Store name is required
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,  // Name is required and cannot be NULL
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,  // Address is optional
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,  // Phone number is required
            validate: {
                isNumeric: true,  // Ensure phone number contains only numbers
            },
        },
        profilePicture: {
            type: DataTypes.BLOB("long"),  // Stores large binary objects (image)
            allowNull: true,  // Profile picture is optional
        },
        pictureFormat: {
            type: DataTypes.STRING,  // Format of the image (e.g., image/jpeg or image/png)
            allowNull: true,  // Format of the picture is optional
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,  // Foreign key to UserModel is required
            references: {
                model: 'users',  // Use string reference to avoid circular dependency
                key: "id",
            },
            onDelete: "CASCADE",  // Delete seller if the associated user is deleted
        },
    }, {
        sequelize,  // Pass sequelize instance
        modelName: "sellers",  // Name of the table in the database
    });
};

export { SellerModel, initSellerModel };
