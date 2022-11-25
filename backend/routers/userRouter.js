const express = require("express");
const router = express.Router();
const {
  register,
  authUser,
  allUsers,
  updateProfile,
  verify,
} = require("../controller/userController");
const { project } = require("../middleware/authenMiddleware");

router.route("/").get(project, allUsers);
router.route("/").post(register);
router.post("/login", authUser);
router.get("/verify", verify);
router.post("/updateProfile", updateProfile);

module.exports = router;
