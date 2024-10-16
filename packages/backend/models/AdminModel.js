import { DataTypes, Model } from "sequelize";

class AdminModel extends Model {
    static associate(models) {
        this.belongsTo(models.UserModel, { foreignKey: 'userId', onDelete: 'CASCADE' });  // Associating with UserModel
    }
}

// Function to initialize the model
const initAdminModel = (sequelize) => {
    AdminModel.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,  // Automatically increment admin ID
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,  // Storing the admin's name
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,  // Admin's phone number (optional)
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',  // Use string reference to UserModel to avoid circular dependency
                key: "id",
            },
            onDelete: "CASCADE",  // If the user is deleted, the admin data is also deleted
        },
    }, {
        sequelize,  // Pass sequelize instance
        modelName: "admins",  // Table name in the database
        timestamps: true,  // Adding createdAt and updatedAt columns
    });
};

export { AdminModel, initAdminModel };
