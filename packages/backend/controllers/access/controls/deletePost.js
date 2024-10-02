import BlogModel from "../../../models/BlogModel.js";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;

const deletePost = async (req, res) => {
	console.log(req.body);
	try {
		const token = req.signedCookies["advanced-state-management-user"];
		const user = jwt.verify(token, config.TOKEN);
		const authorUserName = user.username ?? null;
		const authorId = user.userId ?? null;

		if (!authorUserName || !authorId) {
			return res.status(401).json({
				error: "Invalidated data",
				message: "Unauthorized or cookie has expired",
				status: 401,
				ok: false,
			});
		}

		const { id: blogPostId, title } = req.body;
		if (!title) {
			return res.status(400).json({
				error: "Malformed Input",
				message: "Title or description cannot be empty",
				status: 400,
				ok: false,
			});
		}

		const isDeleted = await BlogModel.destroy({
			where: { id: blogPostId, authorId: authorId, title: title },
		});

		if (!isDeleted) {
			return res.status(404).json({
				error: "Not Found",
				message: "Not able to delete specified resource.",
				status: 404,
				ok: false,
			});
		}

		return res.status(200).json({
			message: "Successfully deleted a blog post!",
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

export default deletePost;
