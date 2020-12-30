const express = require("express");
const userControllers = require("../../controllers/user");
const cookieMiddleware = require("../../middlewares/cookies");

const router = express.Router();

router.post("/register", userControllers.register);
router.post("/sign-in", userControllers.signIn);
router.get(
  "/id",
  cookieMiddleware.checkUserIdExistence,
  userControllers.getUserId
);
router.get(
  "/nickname",
  cookieMiddleware.checkUserIdExistence,
  userControllers.getNickname
);

module.exports = router;
