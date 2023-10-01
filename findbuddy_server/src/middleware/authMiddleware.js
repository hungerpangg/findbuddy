const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
			if (err) {
				res.json({ error: "error" });
			} else {
				req.id = decodedToken.id;
				next();
			}
		});
	} else {
		res.redirect("/login");
	}
};

// check current user
module.exports.checkUser = (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(
			token,
			process.env.JWT_TOKEN_SECRET,
			async (err, decodedToken) => {
				if (err) {
					res.locals.user = null;
					next();
				} else {
					let user = await User.findById(decodedToken.id);
					req.user = user;
					next();
				}
			}
		);
	} else {
		res.locals.user = null;
		next();
	}
};

// get user
module.exports.getUser = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(
			token,
			process.env.JWT_TOKEN_SECRET,
			async (err, decodedToken) => {
				var id;
				({ id } = req.params);
				if (!id) {
					({ userId: id } = req.body);
				}
				if (id.includes("@")) {
					try {
						const user = await User.findOne({ email: id });
						req.user = user;
						next();
					} catch (err) {
						res.locals.user = null;
						next();
					}
				} else {
					try {
						const user = await User.findById(id);
						req.user = user;
						next();
					} catch (err) {
						res.locals.user = null;
						next();
					}
				}
			}
		);
	} else {
		res.locals.user = null;
		next();
	}
};
