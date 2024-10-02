import UserModel from "../../models/UserModel.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
	try {
		console.log(req);
		let { username, password, email } = req.body;
		if (!username || !password || !email) {
			return res.status(400).json({ message: "Invalid Request" });
		}
		// Check if user already exists
		const user = await UserModel.findOne({ where: { username: username } });
		if (user) {
			return res
				.status(400)
				.json({ message: "User already exists", ok: false });
		}
		const emailExists = await UserModel.findOne({ where: { email: email } });
		if (emailExists) {
			return res
				.status(400)
				.json({ message: "Email already taken", ok: false });
		}

		// Password Hashing
		const salt = await bcrypt.genSalt(10);
		password = await bcrypt.hash(password, salt);

		// Create new user
		await UserModel.create({
			username: username,
			email: email,
			password: password,
			salt: salt,
			role: "blogger",
		});

		return res.status(200).json({ message: "User Created", ok: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
};

export default register;
