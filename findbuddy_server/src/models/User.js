const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Please enter an email"],
		unique: true,
		lowercase: true,
		validate: [isEmail, "Please enter a valid email"],
	},
	name: {
		type: String,
		required: [true, "Please enter a name"],
	},
	country: {
		type: String,
		required: [true, "Please enter a country"],
	},
	description: {
		type: String,
	},
	lookingFor: {
		type: String,
	},
	occupation: {
		type: String,
	},
	age: {
		type: Number,
	},
	pictureUrls: {
		type: [
			{
				type: String,
			},
		],
	},
	rejectedBuddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
	acceptedBuddies: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minlength: [6, "Minimum password length is 6 characters"],
	},
	salt: {
		type: String,
	},
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
	if (this.isNew) {
		const salt = await bcrypt.genSalt();
		this.password = await bcrypt.hash(this.password, salt);
		next();
	}
});
// userSchema.pre("save", async function (next) {
// 	if (this.isNew) {
// 		console.log("pre hooked ran!");
// 		const salt = crypto.randomBytes(16).toString("hex");
// 		const hash = crypto.createHash("sha256");
// 		hash.update(this.password + salt);
// 		const hashedPassword = hash.digest("hex");
// 		this.password = hashedPassword;
// 		this.salt = salt;
// 	}
// });

// static method to login user
userSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		console.log(password, user.password, auth);
		if (auth) {
			return user;
		}
		throw Error("incorrect password");
	}
	throw Error("incorrect email");
};
// userSchema.statics.login = async function (email, password) {
// 	const user = await this.findOne({ email });
// 	if (user) {
// 		const loginHash = crypto.createHash("sha256");
// 		console.log(user, user.password, user.salt);
// 		loginHash.update(password + user.salt);
// 		const hashedLoginPassword = loginHash.digest("hex");
// 		console.log(hashedLoginPassword);
// 		if (hashedLoginPassword === user.password) {
// 			return user;
// 		} else throw Error("incorrect password");
// 	} else throw Error("incorrect email");
// };

const User = mongoose.model("user", userSchema);

module.exports = User;
