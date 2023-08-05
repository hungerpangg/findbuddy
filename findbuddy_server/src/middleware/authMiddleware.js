const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports.requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	if (token) {
		jwt.verify(token, "findbuddy-sg2023", (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				// res.redirect('/login');
				res.json({ error: "error" });
			} else {
				console.log(decodedToken, "decodedToken");
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
		jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
			if (err) {
				res.locals.user = null;
				next();
			} else {
				let user = await User.findById(decodedToken.id);
				req.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
};
