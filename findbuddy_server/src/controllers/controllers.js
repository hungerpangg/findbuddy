const User = require("../models/User");
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
			// console.log(file, 'inside key');
			const token = req.cookies.jwt;
			jwt.verify(token, "findbuddy-sg2023", (err, decodedToken) => {
				console.log(decodedToken, "inside multer");
				cb(null, decodedToken.id + "_" + file.originalname);
			});
			// cb(null, file.originalname);
		},
	}),
});

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, "findbuddy-sg2023", {
		expiresIn: maxAge,
	});
};

// handle errors
const handleErrors = (err) => {
	// console.log(err);
	console.log(err.errors, "err.errors");
	console.log(err);
	// console.log(err.message, 'message');
	// console.log(err._message, '_message');
	// let errors = { email: '', password: '' };
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
		//   console.log(err);
		Object.values(err.errors).forEach(({ properties }) => {
			// console.log(val);
			// console.log(properties);
			errors[properties.path] = properties.message;
		});
	}

	return errors;
};

module.exports.signup_post = async (req, res) => {
	console.log(req.body, "req body ----------------");
	var { email, name, password, country } = req.body;

	try {
		const user = await User.create({ email, name, password, country });
		const token = createToken(user._id);
		res.cookie("jwt", token, { maxAge: maxAge * 1000 });
		var { email, _id, name } = user;
		const userId = _id.toString();
		const r = await axios.put(
			"https://api.chatengine.io/users/",
			{
				username: email,
				secret: userId,
				first_name: name,
			},
			{ headers: { "private-key": "e35f6993-6750-49ff-ba12-b410cf57ac88" } }
		);
		res.status(201).json({ redirected: true, data: { email, userId } });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.signup2_post = async (req, res) => {
	const uploadArray = upload.array("files");
	uploadArray(req, res, (err) => {
		if (err) console.log(err);
		console.log(req.files, "reqfiles");
		console.log(req.body, "reqbody");
		console.log(req.user, "request user");

		const token = req.cookies.jwt;
		if (token) {
			jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
				if (err) {
					console.log(err);
				} else {
					let pictureUrls = [];
					const { lookingFor, description, occupation, age } = req.body;
					// console.log(age, "lookingFor");
					for (let file of req.files) {
						// console.log(file.location);
						pictureUrls.push(file.location);
					}
					let updatedData = {
						lookingFor,
						description,
						occupation,
						pictureUrls,
						age: parseInt(age),
					};
					console.log(updatedData);
					// console.log(decodedToken.id, "decoded");
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
							console.log("Document updated successfully.");
							res
								.status(200)
								.json({ redirected: true, ok: true, id: decodedToken.id });
						} else {
							console.log(result, "No documents were modified.");
						}
					} catch (err) {
						console.log("An error occured", err.message);
						res.status(404).json({ message: err.message });
					}
				}
			});
		} else {
			console.log("Authentication failed");
		}
	});
};

module.exports.getProfile = (req, res) => {
	console.log(req.user, "checkUser");
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
		res.status(404).json({ error: "User not found/not authenticated" });
	}
};

module.exports.editProfile = (req, res) => {
	const uploadArray = upload.array("files");
	uploadArray(req, res, (err) => {
		if (err) console.log(err);
		console.log(req.files, "req files");
		console.log(req.body, "reqbody");
		console.log(req.user, "request user");
		const token = req.cookies.jwt;
		if (token) {
			jwt.verify(token, "findbuddy-sg2023", async (err, decodedToken) => {
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
						console.log(filestodelete, "filestodelete");
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
							console.log("Deleted objects:", result);
						} catch (error) {
							console.log("Error deleting objects", error);
						}
					}
					// console.log(age, "lookingFor");
					for (let file of req.files) {
						// console.log(file.location);
						pictureUrls.push(file.location);
					}
					let updatedData = {
						lookingFor,
						description,
						occupation,
						age: parseInt(age),
					};
					// console.log(decodedToken.id, "decoded");
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
							console.log(deleteResult, "deleteResult");
						}
						res.status(201).json({ ok: true, redirected: true });
					} catch (err) {
						console.log(result, err);
					}
				}
			});
		} else {
			console.log("Authentication failed");
		}
	});
};

module.exports.login = async (req, res) => {
	var { email, password } = req.body;
	console.log(email, password);

	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);
		res.cookie("jwt", token, { maxAge: maxAge * 1000 });
		var { email, _id, name } = user;
		const userId = _id.toString();
		// const r = await axios.put(
		// 	"https://api.chatengine.io/users/",
		// 	{
		// 		username: email,
		// 		secret: userId,
		// 		first_name: name,
		// 	},
		// 	{ headers: { "private-key": "d2e2907d-c2b7-4472-bf8a-2b5f2fcb3698" } }
		// );
		res.status(200).json({
			redirected: true,
			data: { email, userId },
		});
	} catch (err) {
		console.log(err);
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.updateUserBuddies = async (req, res) => {
	const { acceptedBuddies, rejectedBuddies, userId } = req.body;
	try {
		const user = await User.findById(userId);
		user.rejectedBuddies.push(...rejectedBuddies);
		user.acceptedBuddies.push(...acceptedBuddies);
		const updatedUser = await user.save();
		console.log(updatedUser, "Updated user");
		res.status(200).json({ ok: true, data: updatedUser });
	} catch (err) {
		console.log(err);
	}
};

module.exports.getRelevantUsers = async (req, res) => {
	const { userId } = req.body;
	console.log(userId, "useId");
	try {
		const user = await User.findById(userId);
		// user.rejectedBuddies = [];
		// user.acceptedBuddies = [];
		// await user.save();
		const seenBuddies = [
			...user.rejectedBuddies,
			...user.acceptedBuddies,
			user._id.toString(),
		];
		console.log(seenBuddies, "Seen");
		const users = await User.find({ _id: { $nin: seenBuddies } }).limit(5);
		res.status(201).json(users);
	} catch (err) {
		console.log(err);
	}
};

// module.exports.createChat=(req, res)=>{
// 	var data = '{\n    "usernames": ["adam_la_morre", "bob_baker", "wendy_walker"],\n    "title": "Another Surprise Party!",\n    "is_direct_chat": false\n}';

// var config = {
//   method: 'put',
// maxBodyLength: Infinity,
//   url: 'https://api.chatengine.io/chats/',
//   headers: {
//     'Project-ID': '{{project_id}}',
//     'User-Name': '{{user_name}}',
//     'User-Secret': '{{user_secret}}'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });
// }

module.exports.logout = (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.status(200).json({ redirected: true });
};

// module.exports.authenticateChat = async (req, res) => {
// 	const { userId } = req.body;
// 	const { name, email, _id } = req.user;
// 	// const userId = _id.toString();
// 	console.log(userId, userId.length, email);
// 	try {
// 		const r = await axios.put(
// 			"https://api.chatengine.io/users/",
// 			{
// 				username: email,
// 				secret: userId,
// 				first_name: name,
// 			},
// 			{ headers: { "private-key": "d2e2907d-c2b7-4472-bf8a-2b5f2fcb3698" } }
// 		);
// 		const { username, secret, first_name } = r.data;
// 		console.log(r.data);
// 		res
// 			.status(201)
// 			.json({ ok: true, data: { username, secret: userId, first_name } });
// 	} catch (err) {
// 		console.log(err.message);
// 		res.status(400).json({ ok: false, err });
// 	}
// };

// const files = req.files;
// const { lookingFor, description, occupation, age } = req.body;

// console.log(req.body, files, "received");
