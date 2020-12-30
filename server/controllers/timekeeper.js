const Timekeeper = require("../models/Timekeeper");

const fiveMinutesToMilliseconds = 5 * 60 * 1000;

exports.createTimekeeper = async (req, res) => {
  try {
    const { title, message, timestamp } = req.body;

    if (!title) {
      res.json({ error: "Title is required" });
      return;
    }

    if (!message) {
      res.json({ error: "Message is required" });
      return;
    }

    if (!timestamp) {
      res.json({ error: "Timestamp is required" });
      return;
    }

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      res.json({ error: "Timestamp is invalid" });
      return;
    }

    const timekeeper = new Timekeeper({
      userId: req.signedCookies.userId,
      title: title,
      message: message,
      timestamp: date,
    });

    const doc = await timekeeper.save();
    res.json({
      _id: doc._id,
      title: doc.title,
      message: doc.message,
      timestamp: doc.timestamp,
    });
  } catch (error) {
    res.json({ error: "Something went wrong" });
    console.error(error);
  }
};

exports.getAllTimekeepers = async (req, res) => {
  try {
    const timekeepers = await Timekeeper.find({
      userId: req.signedCookies.userId,
    });

    res.json(timekeepers);
  } catch (error) {
    res.json({ error: "Something went wrong" });
    console.log(error);
  }
};

exports.getTimekeeper = async (req, res) => {
  try {
    const timekeeper = await Timekeeper.findById(
      req.params.id,
      "_id title timestamp"
    );
    if (!timekeeper) {
      res.json({ error: "Timekeeper not found" });
      return;
    }

    res.json(timekeeper);
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
    console.error(error);
  }
};

exports.updateTimekeeper = async (req, res) => {
  try {
    const timekeeper = await Timekeeper.findById(req.params.id);
    if (!timekeeper) {
      res.json({ error: "Timekeeper not found" });
      return;
    }

    if (req.signedCookies.userId !== timekeeper.userId.toString()) {
      res.json({ error: "Update failed" });
      return;
    }

    const { title, message, timestamp } = req.body;

    if (title) {
      timekeeper.title = title;
    }

    if (message) {
      timekeeper.message = message;
    }

    if (timestamp) {
      const date = new Date(timestamp);

      if (!isNaN(date.getTime())) {
        timekeeper.timestamp = timestamp;
      }
    }

    const doc = await timekeeper.save();
    res.json({
      _id: doc._id,
      title: doc.title,
      message: doc.message,
      timestamp: doc.timestamp,
    });
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
    console.error(error);
  }
};

exports.deleteTimekeeper = async (req, res) => {
  try {
    const timekeeper = await Timekeeper.findById(req.params.id);
    if (!timekeeper) {
      res.json({ error: "Timekeeper not found" });
      return;
    }

    if (req.signedCookies.userId !== timekeeper.userId) {
      res.json({ error: "Delete failed" });
      return;
    }

    await timekeeper.remove();

    res.json({ status: "success" });
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
    console.error(error);
  }
};

exports.getMessage = async (req, res) => {
  try {
    const timekeeper = await Timekeeper.findById(req.params.id);
    if (!timekeeper) {
      res.json({ error: "Timekeeper not found" });
      return;
    }

    if (timekeeper.timestamp - Date.now() < fiveMinutesToMilliseconds) {
      res.json({ message: timekeeper.message });
    } else {
      res.json({ error: "Message not available" });
    }
  } catch (error) {
    res.json({
      error: "Something went wrong",
    });
    console.error(error);
  }
};
