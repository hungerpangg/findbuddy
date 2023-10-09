const { Router } = require("express");
const controller = require("../controllers/controllers");
const { checkUser, getUser } = require("../middleware/authMiddleware");

const router = Router();

router.post("/signup", controller.signup_post);
router.post("/signup2", checkUser, controller.signup2_post);
router.post("/login", controller.login);
router.get("/logout", controller.logout);
router.get("/profile/:id", controller.getProfile);
router.post("/editprofile", controller.editProfile);
router.post("/like", controller.like);
router.post("/rejection", controller.rejection);
router.post("/getusers", controller.getRelevantUsers);
router.post("/getsearchedusers", controller.getSearchedUsers);
router.delete("/deletealllikes", controller.deleteAllLikes);

module.exports = router;
