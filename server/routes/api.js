const express = require("express");

const router = express.Router();

router.use("/user", require("./api/user"));
router.use("/timekeeper", require("./api/timekeeper"));

module.exports = router;
