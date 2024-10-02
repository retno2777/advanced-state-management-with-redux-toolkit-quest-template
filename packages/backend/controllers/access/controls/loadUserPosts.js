import BlogModel from "../../../models/BlogModel.js";
import UserModel from "../../../models/UserModel.js";

const loadUserPosts = async (req, res) => {
	try {
		const { username: authorUserName } = req.params;

		const user = await UserModel.findOne({
			where: { username: authorUserName },
			attributes: {
				exclude: ["salt", "password"],
			},
		});
		if (!user) {
			return res.status(404).json({
				error: "User does not exist",
				ok: false,
				status: 404,
			});
		}

		const all = await BlogModel.findAll({
			where: {
				authorUserName: authorUserName,
			},
		}).catch((err) => console.error(`Failed to find all with ${err}`));
		if (!all) {
			return res.status(400).json({
				error: "User has not posted ever!",
				message: "Empty resource",
				status: 400,
				ok: false,
			});
		}

		return res.status(200).json({
			message: "Successfully updated blog post!",
			status: 200,
			ok: true,
			author: authorUserName,
			authorId: user.id,
			posts: all,
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

export default loadUserPosts;
