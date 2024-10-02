import UserModel from "../../../models/UserModel.js";

const loadProfile = async (req, res) => {
	try {
		const email = req.body.email;
		if (!email) {
			return res.status(401).send({
				message: "Invalid request",
			});
		}
		const user = await UserModel.findOne({
			where: { email: email },
			attributes: {
				exclude: ["salt", "password"],
			},
		});
		if (!user) {
			return res.status(400).json({
				message: "Not Found",
				error: "User does not exist",
				status: 400,
				ok: false,
			});
		}
		return res.status(200).json({
			email: user.email,
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

export default loadProfile;
