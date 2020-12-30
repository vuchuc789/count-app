exports.checkUserIdExistence = (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.json({ error: "Missing UserID" });
    return;
  }

  next();
};
