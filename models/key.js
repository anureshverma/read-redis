const mongoose = require("mongoose");

const { Schema } = mongoose;

const Key = new Schema(
  {
    redisDatabase: String,
    keys: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Keys", Key);
