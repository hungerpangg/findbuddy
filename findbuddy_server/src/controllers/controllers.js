const User = require("../models/User");
const Like = require("../models/Like");
const Rejection = require("../models/Rejection");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const axios = require("axios");

const s3 = new aws.S3({
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_BUCKET_REGION,
});

const upload = multer({
	storage: multerS3({
		s3,
		bucket: "findbuddy-pictures",
		metadata: function (req, file, cb) {
			cb(null, { fieldName: file.fieldname });
		},
		key: function (req, file, cb) {
			const token = req.cookies.jwt;
			jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decodedToken) => {
				cb(null, decodedToken.id + "_" + file.originalname);
			});
		},
	}),
});

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: maxAge,
	});
};

// handle errors
const handleErrors = (err) => {
	let errors = {};

	// incorrect email
	if (err.message === "incorrect email") {
		errors.email = "That email is not registered";
	}

	// incorrect password
	if (err.message === "incorrect password") {
		errors.password = "That password is incorrect";
	}

	// duplicate email error
	if (err.code === 11000) {
		errors.email = "That email is already registered";
		return errors;
	}

	// validation errors
	if (err.message.includes("user validation failed")) {
		Object.values(err.errors).forEach(({ properties }) => {
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

module.exports.signup_post = async (req, res) => {
	var { email, name, password, country } = req.body;

	try {
		const user = await User.create({ email, name, password, country });
		const token = createToken(user._id);
		res.cookie("jwt", token, {
			maxAge: maxAge * 1000,
			secure: true,
			sameSite: "None",
			domain: ".findbuddyhub.com",
			path: "/",
		});
		var { email, _id, name } = user;
		const userId = _id.toString();
		const r = await axios.post(
			"https://api.chatengine.io/users/",
			{
				username: email,
				secret: userId,
				first_name: name,
				email,
			},
			{ headers: { "private-key": process.env.CHATENGINE_PRIVATE_KEY } }
		);
		res.status(201).json({ redirected: true, data: { email, userId } });
		var raw = {
			usernames: ["Admin"],
			is_direct_chat: true,
		};
		var config = {
			method: "put",
			url: "https://api.chatengine.io/chats/",
			headers: {
				"Project-ID": process.env.CHATENGINE_PROJECT_ID,
				"User-Name": email,
				"User-Secret": _id,
				"Content-Type": "application/json",
			},
			data: JSON.stringify(raw),
		};
		axios(config)
			.then((response) => console.log(response))
			.catch((error) => console.log("error", error));
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.signup2_post = async (req, res) => {
	const uploadArray = upload.array("files");
	uploadArray(req, res, (err) => {
		if (err) console.log(err);
		const token = req.cookies.jwt;
		if (token) {
			jwt.verify(
				token,
				process.env.JWT_TOKEN_SECRET,
				async (err, decodedToken) => {
					if (err) {
						console.log(err);
					} else {
						let pictureUrls = [];
						const { lookingFor, description, occupation, age } = req.body;

						for (let file of req.files) {
							pictureUrls.push(file.location);
						}
						let updatedData = {
							lookingFor,
							description,
							occupation,
							pictureUrls,
							age: parseInt(age),
						};
						try {
							let result = await User.updateOne(
								{ _id: decodedToken.id },
								{
									$set: {
										...updatedData,
									},
								}
							);
							if (result.modifiedCount === 1) {
								res
									.status(200)
									.json({ redirected: true, ok: true, id: decodedToken.id });
							} else {
								console.log(result, "No documents were modified.");
							}
						} catch (err) {
							res.status(404).json({ message: err.message });
						}
					}
				}
			);
		} else {
			console.log("Authentication failed");
		}
	});
};

module.exports.getProfile = async (req, res) => {
	var id;
	({ id } = req.params);
	if (!id) {
		({ userId: id } = req.body);
	}
	if (id.includes("@")) {
		try {
			const user = await User.findOne({ email: id });
			req.user = user;
		} catch (err) {
			req.user = null;
		}
	} else {
		try {
			const user = await User.findById(id);
			req.user = user;
		} catch (err) {
			req.user = null;
		}
	}
	if (req.user) {
		const {
			email,
			age,
			lookingFor,
			country,
			description,
			occupation,
			pictureUrls,
			name,
		} = req.user;
		res.status(201).json({
			ok: true,
			email,
			age,
			lookingFor,
			country,
			description,
			occupation,
			pictureUrls,
			name,
		});
	} else {
		res
			.status(404)
			.json({ ok: false, error: "User not found/not authenticated" });
	}
};

module.exports.editProfile = (req, res) => {
	const uploadArray = upload.array("files");
	uploadArray(req, res, (err) => {
		if (err) console.log(err);

		const token = req.cookies.jwt;
		if (token) {
			jwt.verify(
				token,
				process.env.JWT_TOKEN_SECRET,
				async (err, decodedToken) => {
					if (err) {
						console.log(err);
					} else {
						let pictureUrls = [];
						var { lookingFor, description, occupation, age, filestodelete } =
							req.body;
						if (filestodelete?.length > 0) {
							if (!Array.isArray(filestodelete)) {
								filestodelete = [filestodelete];
							}

							const objectsToDelete = filestodelete.map((filename) => {
								return { Key: filename };
							});
							const params = {
								Bucket: "findbuddy-pictures",
								Delete: {
									Objects: objectsToDelete,
								},
							};
							try {
								const result = await s3.deleteObjects(params).promise();
								console.log(result, "result from delete objects");
							} catch (error) {
								console.log("Error deleting objects", error);
							}
						}

						for (let file of req.files) {
							pictureUrls.push(file.location);
						}
						let updatedData = {
							lookingFor,
							description,
							occupation,
							age: age.length > 0 ? parseInt(age) : 0,
						};

						try {
							let result = await User.updateOne(
								{ _id: decodedToken.id },
								{
									$set: {
										...updatedData,
									},
									$push: {
										pictureUrls: { $each: pictureUrls },
									},
								}
							);
							if (filestodelete?.length > 0) {
								let deleteResult = await User.updateOne(
									{ _id: decodedToken.id },
									{
										$pull: {
											pictureUrls: { $in: filestodelete },
										},
									}
								);
							}
							res.status(201).json({ ok: true, redirected: true });
						} catch (err) {
							console.log(err);
						}
					}
				}
			);
		} else {
			console.log("Authentication failed");
		}
	});
};

module.exports.login = async (req, res) => {
	var { email, password } = req.body;
	console.log(email, "emailFromLogin");

	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie("jwt", token, {
			maxAge: maxAge * 1000,
			secure: true,
			sameSite: "None",
			domain: ".findbuddyhub.com",
			path: "/",
		});
		var { email, _id, name } = user;
		const userId = _id.toString();

		res.status(200).json({
			redirected: true,
			data: { email, userId },
		});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.getRelevantUsers = async (req, res) => {
	const { userId } = req.body;
	if (userId === "") {
		try {
			const users = await User.find({ sample: true }).limit(5);
			res.status(201).json(users);
		} catch (err) {
			console.log(err);
		}
		return;
	}
	try {
		var usersLiked = await Like.find({ sender: userId }).distinct("receiver");
		usersLiked = usersLiked.map((receiver) => {
			return receiver.toString();
		});
		var usersRejected = await Rejection.find({
			rejectingUser: userId,
		}).distinct("rejectedUser");
		usersRejected = usersRejected.map((rejectedUser) => {
			return rejectedUser.toString();
		});
		const usersSeen = [...usersLiked, ...usersRejected, userId];
		const users = await User.find({
			_id: {
				$nin: usersSeen,
			},
			$or: [
				{ sample: false },
				{ sample: { $exists: false } },
				{ admin: false },
				{ admin: { $exists: false } },
			],
		}).limit(5);
		res.status(201).json(users);
	} catch (err) {
		console.log(err);
	}
};

module.exports.getSearchedUsers = async (req, res) => {
	const { searchValue, userId } = req.body;

	try {
		var usersLiked = await Like.find({ sender: userId }).distinct("receiver");
		usersLiked = usersLiked.map((receiver) => {
			return receiver.toString();
		});
		var usersRejected = await Rejection.find({
			rejectingUser: userId,
		}).distinct("rejectedUser");
		usersRejected = usersRejected.map((rejectedUser) => {
			return rejectedUser.toString();
		});
		const usersSeen = [...usersLiked, ...usersRejected, userId];
		const regex = new RegExp(searchValue, "i");
		const searchedUsers = await User.find({
			$and: [
				{ lookingFor: regex },
				{
					_id: { $nin: usersSeen },
					$or: [{ sample: false }, { sample: { $exists: false } }],
				},
			],
		}).limit(5);

		res.status(200).json({ ok: true, data: searchedUsers });
	} catch (err) {
		console.log(err);
	}
};

module.exports.like = async (req, res) => {
	const { senderId, receiverId, senderEmail, receiverEmail } = req.body;

	var mutual = false;
	var updatedReceivedLike;
	try {
		const receivedLike = await Like.findOne({
			sender: receiverId,
			receiver: senderId,
		});
		if (receivedLike) {
			mutual = true;
			receivedLike.mutual = mutual;
			updatedReceivedLike = await receivedLike.save();
			var raw = {
				usernames: [receiverEmail],
				is_direct_chat: true,
			};
			var config = {
				method: "put",
				url: "https://api.chatengine.io/chats/",
				headers: {
					"Project-ID": process.env.CHATENGINE_PROJECT_ID,
					"User-Name": senderEmail,
					"User-Secret": senderId,
					"Content-Type": "application/json",
				},
				data: JSON.stringify(raw),
			};

			axios(config)
				.then((response) => console.log(response))
				.catch((error) => console.log("error", error));
		}
		const newLike = new Like({
			sender: senderId,
			receiver: receiverId,
			mutual,
		});
		const createdLike = await newLike.save();

		res.status(200).json({ ok: true, mutual });
	} catch (err) {
		console.log(err);
	}
};

module.exports.rejection = async (req, res) => {
	const { senderId, receiverId } = req.body;
	const newRejection = new Rejection({
		rejectingUser: senderId,
		rejectedUser: receiverId,
	});
	const createdRejection = await newRejection.save();
	res.status(200).json({ ok: true, data: createdRejection });
};

module.exports.deleteAllLikes = async (req, res) => {
	console.log("Delete ran!");
	const deleteLikes = await Like.deleteMany({});
};

module.exports.logout = (req, res) => {
	res.cookie("jwt", "", {
		maxAge: 1,
		secure: true,
		sameSite: "None",
		domain: ".findbuddyhub.com",
		path: "/",
	});
	res.status(200).json({ redirected: true });
};
