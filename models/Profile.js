const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating User Schema

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    Required: true
  },
  program: {
    type: String,
    Required: true
  },
  year: {
    type: Number,
    Required: true
  },
  bio: {
    type: String
  },
  socials: {
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    instagram: {
      type: String
    }
  }
});

module.exports = Profile = mongoose.model("profiles", ProfileSchema);
