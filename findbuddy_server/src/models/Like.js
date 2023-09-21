const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	receiver: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	likedAt: {
		type: Date,
		default: Date.now,
	},
	mutual: {
		type: Boolean,
		default: false,
	},
});

const Like = mongoose.model("like", likeSchema);

module.exports = Like;
