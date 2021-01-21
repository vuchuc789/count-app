const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CorsOriginSchema = Schema({
  origin: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("cors_origins", CorsOriginSchema);
