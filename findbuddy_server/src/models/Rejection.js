const mongoose = require("mongoose");

const rejectionSchema = new mongoose.Schema({
	rejectingUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	rejectedUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
	// Add other fields as needed
});

const Rejection = mongoose.model("rejection", rejectionSchema);

module.exports = Rejection;
