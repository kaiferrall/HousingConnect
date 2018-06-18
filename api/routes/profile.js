const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Auth = require("../../auth/authMiddleware");
const validateProfile = require("../../validation/validateProfile");
//Loading in profile model
const Profile = require("../../models/Profile");
//Loading in user model
const User = require("../../models/User");

// @route  POST api/profile/test
// @desc   Test the profile route
// @access Private
router.get("/test", (req, res) => {
  res.json(req.userData);
});

// @route  GET api/profile/create
// @desc   Renders the no profile route
// @access Private
router.get("/", (req, res) => {
  const user_id = req.user;
  console.log(user_id);
  User.findById(user_id).then(user => {
    if (user) {
      res.render("profileNone", { user: user });
    } else {
      console.log("Breach");
    }
  });
});

// @route  GET api/profile/create
// @desc   Renders the profile form route
// @access Private
router.get("/form", (req, res) => {
  const user_id = req.user;
  Profile.findOne({ user: user_id }).then(profile =>
    res.render("profileForm", { profile: profile })
  );
});

// @route  POST api/profile
// @desc   Create a profile for a user
// @access Private
router.post("/", (req, res) => {
  const { errors, isValid } = validateProfile(req.body);
  //Check for validation
  if (!isValid) {
    res.render("profileForm", { errors: errors });
  }

  //Get all the fields
  const profileFields = {};
  profileFields.user = req.user;
  if (req.body.handle) profileFields.handle = req.body.handle;
  if (req.body.program) profileFields.program = req.body.program;
  if (req.body.year) profileFields.year = req.body.year;
  if (req.body.bio) profileFields.bio = req.body.bio;
  profileFields.socials = {};
  if (req.body.twitter) profileFields.socials.twitter = req.body.twitter;
  if (req.body.facebook) profileFields.socials.facebook = req.body.facebook;
  if (req.body.instagram) profileFields.socials.instagram = req.body.instagram;

  Profile.findOne({ user: req.user }).then(profile => {
    if (profile) {
      // Update
      Profile.findOneAndUpdate(
        { user: req.user },
        { $set: profileFields },
        { new: true }
      ).then(profile => res.redirect("/profile"));
    } else {
      //Create the new profile

      //Check for unique handle
      Profile.findOne({ handle: profileFields.handle }).then(profile => {
        if (profile) {
          errors.handle = "That handle already exists";
          res.render("profileForm", { errors: errors });
        }

        //Save the profiles
        new Profile(profileFields)
          .save()
          .then(profile => res.redirect("/profile"));
      });
    }
  });
});

// @route  GET api/profile/all
// @desc   Display all profiles
// @access Private
router.get("/all", (req, res) => {
  Profile.find({}, null, { sort: { handle: 1 } }).then(profiles => {
    console.log(profiles);
    res.render("profileAll", { profiles: profiles });
  });
});

// @route  GET api/profile/search
// @desc   Searching for a user
// @access Private
router.post("/search", (req, res) => {
  const search = req.body.search;
  if (search) {
    Profile.find({ handle: search }).then(profile => {
      res.render("search", { profiles: profile });
    });
  }
});

module.exports = router;
