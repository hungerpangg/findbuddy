const { Router } = require("express");
const controller = require("../controllers/controllers");
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname);
	},
});
const upload = multer({
	storage,
	onError: (err, next) => {
		console.error("Multer Error:", err);
		next(err);
	},
});

const router = Router();

router.post("/signup", controller.signup_post);
router.post("/signup2", upload.array("files"), controller.signup2_post);

module.exports = router;
