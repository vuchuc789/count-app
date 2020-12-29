const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    timekeepers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Timekeeper",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
