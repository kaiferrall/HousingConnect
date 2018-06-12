const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const Auth = require("../../auth/authMiddleware");
const validatePost = require("../../validation/validatePost");
const dateFormat = require("dateFormat");
//Loading in profile model
const Profile = require("../../models/Profile");
//Loading in user model
const User = require("../../models/User");
//Loading in post model
const Post = require("../../models/Post");

// @route  GET api/posts/form
// @desc   Displaying post form
// @access Private
router.get("/form", authCheck(), (req, res) => {
  const user = req.user;
  Profile.findOne({ user: user }).then(profile =>
    res.render("postForm", { profile: profile })
  );
});

// @route  POST api/posts/create
// @desc   Create post route
// @access Private
router.post("/create", authCheck(), (req, res) => {
  const { errors, isValid } = validatePost(req.body);
  const postFields = {};

  if (!isValid) {
    res.render("postForm", { errors: errors });
  } else {
    postFields.user = req.user;
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.text) postFields.text = req.body.text;
    if (req.body.type) postFields.type = req.body.type;
    Profile.findOne({ user: postFields.user }).then(profile => {
      postFields.handle = profile.handle;
      Post.create({
        title: postFields.title,
        user: postFields.user,
        handle: postFields.handle,
        text: postFields.text,
        type: postFields.type
      }).then(post => {
        const now = new Date();
        const date = dateFormat(now, "fullDate");
        post.date = date;
        post
          .save()
          .then(res.redirect("/api/posts/feed"))
          .catch(err => console.log(err));
      });
    });
  }
});

// @route  GET api/posts/feed
// @desc   Display the post feed
// @access Private
router.get("/feed", authCheck(), (req, res) => {
  Post.find({}, null, { sort: { date: 1 } }).then(posts => {
    res.render("postFeed", { posts: posts });
    //res.send(posts);
  });
});

// @route  POST api/posts/like/:id
// @desc   User liking post
// @access Private
router.post("/like/:id", (req, res) => {
  const user_id = req.user;
  const post_id = req.params.id;
  User.findOne({ _id: user_id }).then(user => {
    Post.findOne({ _id: post_id }).then(post => {
      const index = post.upVotes.indexOf(user_id);
      //console.log(index);
      if (index == -1) {
        //console.log("liked");
        post.upVotes.unshift(user_id);
        post.upVotesCount = post.upVotes.length;
        post
          .save()
          .then(res.redirect("/api/posts/feed"))
          .catch(err => console.log(err));
      } else {
        //console.log(index);
        post.upVotes.splice(index, 1);
        post.upVotesCount = post.upVotes.length;
        post
          .save()
          .then(res.redirect("/api/posts/feed"))
          .catch(err => console.log(err));
      }
    });
  });
});

//authCheck function
function authCheck() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else if (!req.isAuthenticated()) {
      res.redirect("/login");
    }
    console.log(req.isAuthenticated());
  };
}

module.exports = router;
