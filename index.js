require("dotenv").config();
const mongoose = require("mongoose");
require("./redis/saveContent");

mongoose.connect("mongodb://localhost/read-redis", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const con = mongoose.connection;
con.on("open", () => {
  console.log("database connected...");
});
