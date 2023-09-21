const { Router } = require("express");
const controller = require("../controllers/controllers");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const { checkUser, getUser } = require("../middleware/authMiddleware");

const s3 = new aws.S3({
	accessKeyId: process.env.S3_ACCESS_KEY,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: process.env.S3_BUCKET_REGION,
});

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "./uploads");
// 	},
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + "-" + file.originalname);
// 	},
// });
// const upload = multer({
// 	storage,
// 	onError: (err, next) => {
// 		console.error("Multer Error:", err);
// 		next(err);
// 	},
// });

const router = Router();

router.post("/signup", controller.signup_post);
router.post("/signup2", checkUser, controller.signup2_post);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/profile/:id", getUser, controller.getProfile);
router.post("/editprofile", controller.editProfile);
// router.post("/getusers", controller.getRelevantUsers);
router.post("/updateuserbuddies", controller.updateUserBuddies);
router.post("/like", controller.like);
router.post("/rejection", controller.rejection);
router.post("/getusers", controller.getRelevantUsers);
router.post('/getsearchedusers', controller.getSearchedUsers)
router.delete('/deletealllikes', controller.deleteAllLikes)
// router.post("/createchat", controller.createChat);
// router.post('/authenticateChat', getUser, controller.authenticateChat);

module.exports = router;
