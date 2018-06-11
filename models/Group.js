const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating Group Schema

const GroupSchema = new Schema({
  users: [User],
  status: {
    type: String
  }
  //Add more elements for a group
});

module.exports = GroupSchema = mongoose.model("groups", GroupSchema);
