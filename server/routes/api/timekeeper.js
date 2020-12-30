const express = require("express");
const timekeeperController = require("../../controllers/timekeeper");
const cookieMiddleware = require("../../middlewares/cookies");
const paramsMiddleware = require("../../middlewares/params");

const router = express.Router();

router.post(
  "/",
  cookieMiddleware.checkUserIdExistence,
  timekeeperController.createTimekeeper
);
router.get(
  "/",
  cookieMiddleware.checkUserIdExistence,
  timekeeperController.getAllTimekeepers
);
router.get(
  "/:id",
  paramsMiddleware.checkTimekeeperIdExistence,
  timekeeperController.getTimekeeper
);
router.put(
  "/:id",
  cookieMiddleware.checkUserIdExistence,
  paramsMiddleware.checkTimekeeperIdExistence,
  timekeeperController.updateTimekeeper
);
router.patch(
  "/:id",
  cookieMiddleware.checkUserIdExistence,
  paramsMiddleware.checkTimekeeperIdExistence,
  timekeeperController.updateTimekeeper
);
router.delete(
  "/:id",
  cookieMiddleware.checkUserIdExistence,
  paramsMiddleware.checkTimekeeperIdExistence,
  timekeeperController.deleteTimekeeper
);
router.get("/message/:id", timekeeperController.getMessage);

module.exports = router;
