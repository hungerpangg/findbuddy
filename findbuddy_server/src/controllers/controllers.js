const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
		res.status(201).json({ user: user._id });
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
};
