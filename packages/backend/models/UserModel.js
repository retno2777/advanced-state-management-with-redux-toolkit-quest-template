import { DataTypes, Model } from "sequelize";  

class UserModel extends Model {
    static associate(models) {
        // Define associations
        UserModel.hasOne(models.ShopperModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
        UserModel.hasOne(models.SellerModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
        UserModel.hasOne(models.AdminModel, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
}

// Function to initialize the model
const initUserModel = (sequelize) => {
    UserModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {  // Menambahkan atribut role kembali
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,  // Set default value to true, indicating the user is active by default
        },
    }, {
        sequelize,
        modelName: 'User',  // Use singular name for the model
        tableName: 'users',  // Explicitly set the table name to 'users'
        timestamps: true,
    });
};

export { UserModel, initUserModel };
