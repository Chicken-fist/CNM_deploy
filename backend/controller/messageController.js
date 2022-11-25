const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const multerS3 = require("multer-s3");
const multer = require("multer");
// FILE

const storage = multer.memoryStorage({
  destination(req, file, callback) {
    callback(null, "");
  },
});
function checkFileType(file, cb) {
  const fileTypes = /doc|docx|pdf/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const minetype = fileTypes.test(file.mimetype);
  if (extname && minetype) {
    return cb(null, true);
  }
  return cb("Error: Doc only");
}
// const upload = multer({
//   storage,
//   limits: { fileSize: 2000000 },
//   fileFilter(req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

const { v4: uuid } = require("uuid");
const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.region,
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAccessKey,
});
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Paper";
const s3 = new AWS.S3({
  accessKeyId: process.env.accessKeyID,
  secretAccessKey: process.env.secretAccessKey,
});
const CLOUD_FRONT_URL = "http://d3bcs23y1o2maa.cloudfront.net/";
// FILE - END
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, chatId, pic, file } = req.body;
  if (!content || !chatId) {
    console.log("Ko co content , chatId");
    return res.sendStatus(400);
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    pic: pic,
    file: file,
  };
  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//sen file
/**
 * Single Upload
 */

// ko cần content
// stt ????
const sendFileMessage = asyncHandler(async (req, res, next) => {
  console.log("TOI UI !!!!");
  const {chatId, fileName, fileURL} = req.body;
  if(!chatId){
    return;
  }
  else{
    var newMessage = {
      sender: req.user._id,
      content: fileName,
      chat: chatId,
      file: fileURL,
    };
    console.log("file: ", newMessage);
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  }
    
});
const getFileMessageAWS = asyncHandler(async (req, res, next) => {
  const imageUrl = req.params.imageUrl;
  // console.log("Image Url:", imageUrl);
  const params = {
    TableName: tableName,
    Key: {
      image_url: imageUrl,
    },
  };
  docClient.get(params, (err, data) => {
    if (err) res.send(err);
    else {
      res.json(data);
    }
  });
});
const getAllMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const recallMessage = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.body;
    await Message.findByIdAndUpdate({ _id: id }, { recallMessage: 1 });
    var messRecall = await Message.findById({ _id: id })
      .populate("sender", "name pic")
      .populate("chat");
    messRecall = await User.populate(messRecall, {
      path: "chat.users",
      select: "name pic email",
    });
    // console.log("CONTROLLER: ", messRecall);
    res.json(messRecall);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getAllImageMessages = asyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .find({ content: "image" })
      .find({recallMessage: {$ne:1}})
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  sendMessage,
  sendFileMessage,
  getFileMessageAWS,
  getAllMessages,
  recallMessage,
  getAllImageMessages,
};
