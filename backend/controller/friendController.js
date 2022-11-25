const asyncHandler = require("express-async-handler");
const Friend = require("../models/friendModel");
const User = require("../models/userModel");
const checkTonTai = asyncHandler(async (req, res) => {
  try {
    var check = await Friend.find({status: 2}).find({
      $or: [
        { $and: [{ user: req.body.user }, { friend: req.body.friend }] },
        { $and: [{ friend: req.body.user }, { user: req.body.friend }] },
      ],
    });
    res.json(check);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getStatusFriend = asyncHandler(async (req, res) => {
  try {
    var check = await Friend.find({
      $or: [
        { $and: [{ user: req.body.user }, { friend: req.body.friend }] },
        { $and: [{ friend: req.body.user }, { user: req.body.friend }] },
      ],
    });
    res.json(check);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendRequest = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  var sendRequestFriend = {
    user: req.body.user,
    friend: req.body.friend,
  };
  var check = await Friend.find({
    $or: [
      { $and: [{ user: req.body.user }, { friend: req.body.friend }] },
      { $and: [{ friend: req.body.user }, { user: req.body.friend }] },
    ],
  });
  if (check.length > 0) {
    // console.log("Co roi: ", check);
    res.json(check);
  } else {
    try {
      var requestFriend = await Friend.create(sendRequestFriend);
      requestFriend = await requestFriend.populate("user", "-password");
      requestFriend = await requestFriend.populate("friend", "-password");
      // console.log(requestFriend);
      res.json(requestFriend);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
const unfriend = asyncHandler(async (req, res) => {
  console.log("UINFIEND:" , req.body);
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  try {
    var requestFriend = await Friend.findOneAndDelete({
      $or: [
        { $and: [{ user: req.body.user }, { friend: req.body.friend }] },
        { $and: [{ friend: req.body.user }, { user: req.body.friend }] },
      ],
    });
    console.log(requestFriend);
    res.json(requestFriend);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const makeFriend = asyncHandler(async (req, res) => {
  if (!req.body.user || !req.body.friend) {
    console.log("Chưa có user, friend");
    return res.sendStatus(400);
  }
  var check = await Friend.find({
    $or: [
      { $and: [{ user: req.body.user }, { friend: req.body.friend }] },
      { $and: [{ friend: req.body.user }, { user: req.body.friend }] },
    ],
  });
  if (check.length == 0) {
    // console.log("Chua co sao update");
    res.send(check);
  } else {
    try {
      var requestFriend = await Friend.findOneAndUpdate(
        { user: req.body.friend, friend: req.body.user },
        { friend: req.body.user, status: 2 } ///////
      );
      requestFriend = await requestFriend.populate("user", "-password");
      requestFriend = await requestFriend.populate("friend", "-password");
      console.log("MAKE FRIEND", requestFriend);
      res.json(requestFriend);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
const getListFriend = asyncHandler(async (req, res) => {
  var userId = req.body.userId;
  if (!userId) {
    console.log("Chua co User");
    return res.sendStatus(400);
  } else {
    try {
      var listFriend = [];
      const getListFriend = await Friend.find({
        $or: [
          {
            user: userId,
          },
          { friend: userId },
        ],
      })
        .find({ status: 2 })
        .select("user friend -_id");
      getListFriend.forEach((friend) => {
        if (!friend.user._id.toString().includes(userId))
          listFriend.push(friend.user._id.toString());
        if (!friend.friend._id.toString().includes(userId))
          listFriend.push(friend.friend._id.toString());
      });
      var kq = [];
      listFriend.forEach(async (user) => {
        var temp = await User.findOne({ _id: user });
        kq.push(temp);
      });
      setTimeout(() => {
        res.json(kq);
        console.log("KQ:", kq);
      }, 1000);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
const getFriendByName = asyncHandler(async (req, res) => {
  console.log("toi chua 3");
  var userId = req.query.userId;
  if (!userId) {
    console.log("Chua co User");
    return res.sendStatus(400);
  } else {
    try {
      var listFriend = [];
      const getListFriend = await Friend.find({
        $or: [
          {
            user: userId,
          },
          { friend: userId },
        ],
      })
        .find({ status: 2 })
        .select("user friend -_id");
      getListFriend.forEach((friend) => {
        if (!friend.user._id.toString().includes(userId))
          listFriend.push(friend.user._id.toString());
        if (!friend.friend._id.toString().includes(userId))
          listFriend.push(friend.friend._id.toString());
      });
      var kq = [];
      listFriend.forEach(async (user) => {
        var temp = await User.findOne({ _id: user })
          .findOne({ name: { $regex: req.query.search, $options: "i" }});
        if(temp){
          kq.push(temp);
        }
      });
      setTimeout(() => {
        res.json(kq);
        console.log("KQ:", kq);
      }, 1000);
      // const keyword = req.query.search
      //   ? {
      //       name: { $regex: req.query.search, $options: "i" },
      //     }
      //   : {};
      // const users = await kq.find(keyword).find({
      //   _id: { $ne: req.query.userId },
      // });
      // console.log(users);
      // res.json(users);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
module.exports = {
  sendRequest,
  unfriend,
  makeFriend,
  getListFriend,
  checkTonTai,
  getStatusFriend,
  getFriendByName
};
