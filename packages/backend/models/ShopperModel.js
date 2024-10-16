import { DataTypes, Model } from "sequelize";  

class ShopperModel extends Model {
    static associate(models) {
        ShopperModel.hasMany(models.CartModel, { foreignKey: 'shopperId' });
        ShopperModel.hasMany(models.OrderItemModel, { foreignKey: 'shopperId' });
        ShopperModel.hasMany(models.OrderHistoryModel, { foreignKey: 'shopperId' });
        ShopperModel.hasMany(models.SellerOrderModel, { foreignKey: 'shopperId' });
    }
}

const initShopperModel = (sequelize) => {
    ShopperModel.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            lastName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            birthDay: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            phoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isNumeric: true,
                },
            },
            profilePicture: {
                type: DataTypes.BLOB("long"),
                allowNull: true,
            },
            pictureFormat: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',  // Use string reference to avoid circular dependency
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "shoppers",  // Table name in the database
        }
    );
};

export { ShopperModel, initShopperModel };
