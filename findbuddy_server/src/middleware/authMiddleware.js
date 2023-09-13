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

// get user
module.exports.getUser = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
			var id;
			({ id } = req.params);
			if (!id) {
				({ userId: id } = req.body);
			}
			if (id.includes("@")) {
				try {
					const user = await User.findOne({ email: id });
					console.log(user, "user email");
					req.user = user;
					next();
				} catch (err) {
					console.log("cannot find");
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
		});
	} else {
		res.locals.user = null;
		next();
	}
};

//update user buddy info
// module.export.updateUser=async (req, res, next) => {
// 	const token=req.cookies.jwt;
// 	if (token){
// 		jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
// 			const {acceptedBuddies, rejectedBuddies}=req.body;
// 			try {
// 				const user=await User.updateOne(
// 					{ _id: decodedToken.id },
// 					{
// 						$set: {
// 							...updatedData,
// 						},
// 						$push: {
// 							pictureUrls: { $each: pictureUrls },
// 						},
// 					}
// 				);
// 			}
// 		})
// 	}
// 	else {
// 		res.locals.user=null;
// 		next();
// 	}
// }

//get users
// module.export.getRelevantUsers = async (req, res, next) => {
// 	const token = req.cookies.jwt;
// 	if (token) {
// 		jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
// 			const {}
// 			try {
// 				const users=await User.
// 			}
// 		})
// 	}
// 	else {
// 		res.locals.user=null;
// 		next();
// 	}
// };
