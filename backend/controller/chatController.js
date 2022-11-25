const asycnHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asycnHandler(async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not send with request ");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    // chat 1 - 1
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});
const accessChatMobile = asycnHandler(async (req, res, next) => {
  // add, create chat 1-1
  // 1. gui id ->
  // 2. Co User : tìm hết tất cả các Chat của User đó ->
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId not send with request ");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    // chat 1 - 1
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]._id);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat._id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
});
const fetchChat = asycnHandler(async (req, res) => {
  // get all from user cu the
  try {
    Chat.find({
      $or: [
        {
          $and: [
            {isGroupChat: true },
            { users: { $elemMatch: { $eq: req.user._id } } },
          ],
        },
        {
          $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { latestMessage: { $ne: null } },
          ],
        },
      ],
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      // .populate({ path: "latestMessage" })
      .sort({ updateAt: 1 })
      .then(async (rs) => {
        rs = await User.populate(rs, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(rs);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChat = asycnHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).send({ message: "Please fill all the fields" });
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form the group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChatMobile = asycnHandler(async (req, res, next) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).send({ message: "Please fill all the fields" });
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form the group chat");
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id });
    res.status(200).json(fullGroupChat._id);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const renameGroup = asycnHandler(async (req, res, next) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});
const addFromGroup = asycnHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;
  const updateGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (updateGroup) res.json(updateGroup);
  else {
    res.status(404);
    throw new Error("Chat is not found");
  }
});
const removeFromGroup = asycnHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;
  const chat = await Chat.findById(chatId);
  if (chat.groupAdmin != userId) {
    console.log("XOA KO XOA ADMIN");
    const updateGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (updateGroup) res.json(updateGroup);
    else {
      res.status(404);
      throw new Error("Chat is not found");
    }
  } else if (chat.groupAdmin == userId && chat.users.length > 1) {
    console.log("XOA ADMIN");
    const updateGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    );
    const adminNextGeneration = updateGroup.users[0];
    console.log("adminNextGeneration", adminNextGeneration);
    const updateGroup2 = await Chat.findByIdAndUpdate(chatId, {
      groupAdmin: adminNextGeneration,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (updateGroup) res.json(updateGroup2);
    else {
      res.status(404);
      throw new Error("Chat is not found");
    }
  } else {
    const x = await Chat.findByIdAndDelete(chatId);
    res.json({ data: "Mat het" });
    console.log("xoa het");
  }
});
const searchGroupChat = asycnHandler(async (req, res) => {
  try {
    // console.log(ObjectId(req.query.id));
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.query.id } },
    }).find({
      chatName: { $regex: req.query.chatName, $options: "i" },
    });
    console.log(chats);
    res.send(chats);
  } catch (error) {
    res.status(404);
    throw new Error("Chat is not found");
  }
});

module.exports = {
  accessChat,
  accessChatMobile,
  fetchChat,
  createGroupChat,
  createGroupChatMobile,
  renameGroup,
  removeFromGroup,
  addFromGroup,
  searchGroupChat,
};
