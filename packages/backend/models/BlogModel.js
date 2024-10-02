import { DataTypes, Model } from "sequelize";
import { sequelizeBlogs } from "../database/db.js";

class BlogModel extends Model {}
BlogModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		authorUserName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize: sequelizeBlogs,
		modelName: "blogs",
	},
);

export default BlogModel;
