const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimekeeperSchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("timekeepers", TimekeeperSchema);
