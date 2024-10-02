import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const config = process.env;

const jwt = jsonwebtoken;

const tokenVerification = (req, res, next) => {
	const [, token] = req.headers.authorization.split(" ");

	if (!token) {
		return res.status(403).send({
			ok: false,
			message: "Token is not provided",
			status: 403,
		});
	}

	try {
		jwt.verify(token, config.TOKEN);
	} catch (_err) {
		console.error("Failed to authenticate token");
		return res.status(401).send({
			ok: false,
			message: "Failed to authenticate token.",
			status: 401,
		});
	}
	return next();
};

export default tokenVerification;
