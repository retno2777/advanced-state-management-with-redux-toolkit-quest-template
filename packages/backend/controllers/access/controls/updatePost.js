import BlogModel from "../../../models/BlogModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const updatePost = async (req, res) => {
	try {
		const token = req.signedCookies["advanced-state-management-user"];
		const user = jwt.verify(token, config.TOKEN);
		const authorUserName = user.username ?? null;
		const authorId = user.userId ?? null;

		if (!authorUserName || !authorId) {
			return res.status(401).json({
				error: "Unauthorized or cookie has expired",
				status: 401,
				ok: false,
			});
		}

		const { id: blogPostId, title, content } = req.body;
		if (!blogPostId || !title || !content) {
			return res.status(400).json({
				error: "Malformed Input. Invalid Request",
				message: "One or more of the inputs are empty",
				status: 400,
				ok: false,
			});
		}

		const post = await BlogModel.findOne({
			where: {
				id: blogPostId,
				authorId: authorId,
			},
		});

		post.title = title;
		post.content = content;
		post.updatedAt = Date.now();

		await post.save();

		return res.status(200).json({
			message: "Successfully updated blog post!",
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

export default updatePost;
