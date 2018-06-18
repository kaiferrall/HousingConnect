const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Creating User Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  groups: [{ type: Schema.Types.Mixed, ref: "groups" }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
