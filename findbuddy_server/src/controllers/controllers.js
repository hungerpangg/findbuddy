const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

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
	const { email, name, password, country } = req.body;

	try {
		const user = await User.create({ email, name, password, country });
		const token = createToken(user._id);
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
		res.status(201).json({ redirected: true, user: user._id });
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
			age,
			lookingFor,
			country,
			description,
			occupation,
			pictureUrls,
			name,
		} = req.user;
		res.status(201).json({
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
					try{
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
				}
				catch(err){
					console.log(result, err)
				}
				}
			});
		} else {
			console.log("Authentication failed");
		}
	});
};

// const files = req.files;
// const { lookingFor, description, occupation, age } = req.body;

// console.log(req.body, files, "received");
