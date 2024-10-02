import UserModel from "../../models/UserModel.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email) {
			return res.status(401).json({
				error: "Invalid request",
				ok: false,
				status: 401,
			});
		}

		const user = await UserModel.findOne({
			where: { email: email },
			attributes: {
				exclude: ["salt"],
			},
		});
		console.log(user);
		if (!user) {
			return res.status(404).json({
				message: "User does not exist",
				ok: false,
				status: 404,
			});
		}

		const passwordMatch = await bcryptjs.compare(password, user.password);

		if (!passwordMatch) {
			return res
				.status(401)
				.json({ error: "Invalid credentials", ok: false, status: 401 });
		}

		const token = jsonwebtoken.sign(
			{ email: user.email, username: user.username, userId: user.id },
			config.TOKEN,
			{
				expiresIn: 86400,
			},
		);
		
		const createdAt = new Date(Date.now());

		res.cookie("advanced-state-management-user", token, {
			httpOnly: true,
			signed: true,
			secure: true,
			maxAge: 60 * 60 * 24,
			sameSite: "None",
			partitioned: true,
			created: createdAt.toDateString(),
			path: "/",
		});

		return res.status(200).json({
			token: token,
			username: user.username,
			userId: user.id,
			email: user.email,
			role: user.role,
			status: 200,
			ok: true,
		});
	} catch (err) {
		return res.status(503).json({
			error: "Internal server error",
			message: err,
			status: 503,
			ok: false,
		});
	}
};

export default login;
