const cookieOption = require("../helpers/cookieOption");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    if (!req.body.nickname) {
      res.json({ error: "Nickname is required" });
      return;
    }

    if (req.signedCookies.userId) {
      const user = await User.findById(
        req.signedCookies.userId,
        "_id nickname"
      );

      if (user) {
        res.json(user);
        return;
      }
    }

    const user = new User({
      nickname: req.body.nickname,
    });

    const doc = await user.save();
    res.cookie("userId", doc._id, cookieOption).json({
      _id: doc._id,
      nickname: doc.nickname,
    });
  } catch (error) {
    res.json({ error: "Something went wrong" });
    console.error(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    if (!req.body.userId) {
      res.json({ error: "UserId is required" });
      return;
    }

    const user = await User.findById(req.body.userId, "_id nickname");
    if (!user) {
      res.json({ error: "User not found" });
      return;
    }

    res.cookie("userId", user._id, cookieOption).json(user);
  } catch (error) {
    res.json({ error: "Something went wrong" });
  }
};

exports.getUserId = (req, res) => {
  res.json({ userId: req.signedCookies.userId });
};

exports.getNickname = async (req, res) => {
  const user = await User.findById(req.signedCookies.userId);
  if (!user) {
    res.json({ error: "User not found" });
    return;
  }

  res.json({ nickname: user.nickname });
};
