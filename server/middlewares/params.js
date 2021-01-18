const ObjectId = require("mongoose").Types.ObjectId;

exports.checkTimekeeperIdExistence = (req, res, next) => {
  if (!req.params.id || !ObjectId.isValid(req.params.id)) {
    res.json({ error: "Missing Timekeeper ID" });
    return;
  }

  next();
};
