import { Router } from "express";
import createPost from "../controllers/access/controls/createPost.js";
import deletePost from "../controllers/access/controls/deletePost.js";
import updatePost from "../controllers/access/controls/updatePost.js";
import loadUserPosts from "../controllers/access/controls/loadUserPosts.js";
import tokenVerification from "../security/authentication.js";
import allPosts from "../controllers/access/controls/allPosts.js";

const accessControlRoutes = Router({ mergeParams: true });

accessControlRoutes.post("/post/create", tokenVerification, (req, res) =>
	createPost(req, res),
);
accessControlRoutes.delete("/post/delete", tokenVerification, (req, res) =>
	deletePost(req, res),
);
accessControlRoutes.put("/post/update", tokenVerification, (req, res) =>
	updatePost(req, res),
);

// no auth needed routes
accessControlRoutes.get("/user/:username", (req, res) =>
	loadUserPosts(req, res),
);
accessControlRoutes.get("/all", (req, res) => allPosts(req, res));

export default accessControlRoutes;
