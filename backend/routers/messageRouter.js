const express = require("express");
const { project } = require("../middleware/authenMiddleware");
const {
  sendMessage,
  sendFileMessage,
  getFileMessageAWS,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
} = require("../controller/messageController");


// FILE - END
const router = express.Router();
router.route("/").post(project, sendMessage);
// upload.single('file'), 
router.route("/file").post(project, sendFileMessage);
router
  .route("/file/:imageUrl")
  .get(project, getFileMessageAWS);
router.route("/recallMessage").post(project, recallMessage);
router.route("/:chatId").get(project, getAllMessages);
router.route("/image/:chatId").get(project, getAllImageMessages);

module.exports = router;
