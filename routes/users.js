const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin1db");

const userSchema = mongoose.Schema({
  username: String,
  fullname: String,
  email: String,
  password: String,
  image: String,
  discription: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }],
  contact: Number
})

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
