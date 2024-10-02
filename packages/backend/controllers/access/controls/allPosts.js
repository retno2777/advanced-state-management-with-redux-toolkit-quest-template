import BlogModel from "../../../models/BlogModel.js";

const allPosts = async (_req, res) => {
	try {
		const all = await BlogModel.findAll().catch((err) => {
			return res.status(404).json({
				error: err,
				message: "No posts found",
				status: 404,
				ok: false,
			});
		});

		return res.status(200).json({
			message: "Successfully updated blog post!",
			status: 200,
			ok: true,
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

export default allPosts;
