const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating Group Schema

const GroupSchema = new Schema({
  users: [{ type: Schema.Types.Mixed, ref: "users" }],
  name: {
    type: String
  },
  size: {
    type: Number
  },
  status: {
    type: String
  }
  //Add more elements for a group
});

module.exports = Group = mongoose.model("groups", GroupSchema);
