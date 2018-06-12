const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating Group Schema

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String
  },
  title: {
    type: String
  },
  text: {
    type: String,
    require: true
  },
  date: {
    type: String
  },
  type: {
    type: String
  },
  upVotes: [String],
  upVotesCount: {
    type: Number
    //Lenght of upVotes array
  }
});

module.exports = Post = mongoose.model("posts", PostSchema);
