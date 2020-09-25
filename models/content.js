const mongoose = require("mongoose");

const { Schema } = mongoose;

const Content = new Schema(
  {
    content: String,
    key: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contents", Content);
