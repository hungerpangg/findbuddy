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
			// console.log(file, 'inside key')
			cb(null, file.originalname);
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
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};

module.exports.signup2_post = async (req, res) => {
	const uploadArray = upload.array("files");
	uploadArray(req, res, (err) => {
		if (err) console.log(err);
		console.log(req.files);
	});

	// const files = req.files;
	// const { lookingFor, description, occupation, age } = req.body;

	// console.log(req.body, files, "received");
};
