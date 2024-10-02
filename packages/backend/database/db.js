import { Sequelize } from "sequelize";

const sequelizeBlogs = new Sequelize({
	database: "blogs",
	dialect: "sqlite",
	storage: "./database/blogs.sqlite",
	logging: false,
});

sequelizeBlogs
	.authenticate()
	.then(async () => {
		await sequelizeBlogs
			.sync({ alter: true })
			.then(() => console.log("Database is synchronised for blogs db"));
		console.log("Connection established for blogs db");
	})
	.catch((err) => console.error("Unable to connect to blogs database: ", err));

const sequelizeUsers = new Sequelize({
	database: "users",
	dialect: "sqlite",
	storage: "./database/users.sqlite",
	logging: false,
});

sequelizeUsers
	.authenticate()
	.then(async () => {
		await sequelizeUsers
			.sync({ alter: true })
			.then(() => console.log("Database is synchronised for users db"));
		console.log("Connection established for users db");
	})
	.catch((err) => console.error("Unable to connect to users database: ", err));

export { sequelizeBlogs, sequelizeUsers };
