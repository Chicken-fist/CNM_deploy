const express = require("express");
const { project } = require("../middleware/authenMiddleware");
const {
  sendRequest,
  unfriend,
  makeFriend,
  getListFriend,
  checkTonTai,
  getStatusFriend,
  getFriendByName
} = require("../controller/friendController");

const router = express.Router();
router.route("/sendRequest").post(project, sendRequest);
router.route("/makeFriend").post(project, makeFriend);
router.route("/unfriend").post(project, unfriend);
router.route("/checkFriend").post(project, checkTonTai);
router.route("/getListFriend").post(project, getListFriend);
router.route("/getStatusFriend").post(project, getStatusFriend)
router.route("/findUserFriend").get(project, getFriendByName)

module.exports = router;
