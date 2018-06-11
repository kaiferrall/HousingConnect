const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const validateRegister = require("../../validation/validateRegister");
const validateLogin = require("../../validation/validateLogin");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const keys = require("../../config/keys");
//const Auth = require("../../auth/authMiddleware");

//Loading User model from ../../models/User
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Test the users route
// @access Private
router.get("/test", authCheck(), (req, res) => {
  res.send("logged in");
});

// @route  POST api/users/register
// @desc   Register a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    res.render("register", { errors: errors });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        errors.email = "Email already exists.";
        //return res.status(400).json(errors);
        res.render("register", { errors: errors });
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        //Encrypting password with bcryptjs
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            //Save new user in database
            newUser
              .save()
              .then()
              .catch(err => console.log(err));
          });
        });
        res.redirect("/login");
      }
    });
  }
});

// @route  POST api/users/login
// @desc   Login a user
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    //  return res.status(400).json(errors);
    res.render("login", { errors: errors });
    console.log(errors);
  } else {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
      if (!user) {
        errors.email = "Email not found";
        res.render("login", { errors: errors });
        console.log(errors);
      } else {
        bcrypt.compare(password, user.password).then(Matched => {
          if (Matched) {
            user_id = user.id;
            //res.send(user_id);
            req.login(user_id, err => {
              res.redirect("/");
            });
          } else {
            errors.password = "Incorrect Password";
            console.log(errors);
            res.render("login", { errors: errors });
          }
        });
      }
    });
  }
});

// @route  POST api/users/logout
// @desc   Logout a user
// @access Private
router.get("/logout", authCheck(), (req, res) => {
  req.logout();
  res.redirect("/login");
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

function authCheck() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else if (!req.isAuthenticated()) {
      res.redirect("/login");
    }
  };
}

module.exports = router;
