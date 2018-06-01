const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const validateRegister = require("../../validation/validateRegister");
const validateLogin = require("../../validation/validateLogin");
const jwt = require("jsonwebtoken");
const path = require("path");

//Loading User model from ../../models/User
const User = require("../../models/User");

// @route  GET api/routes/test
// @desc   Test the users route
// @access Public
router.get("/test", (req, res) => {
  res.json("Test works");
});

// @route  POST api/routes/register
// @desc   Register a user
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegister(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists.";
      return res.status(400).json(errors);
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
            .then(user => res.json(user))
            .catch(err => consol.log(err));
        });
      });
    }
  });
});

// @route  POST api/routes/login
// @desc   Login a user
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "Email not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(Matched => {
      if (Matched) {
        const payload = { id: user.id, name: user.name };

        jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
          res.json({ token });
        });
      } else {
        errors.password = "Incorrect Password";
        res.status(400);
        console.log(errors);
      }
    });
  });
});

// @route  GET api/routes/current
// @desc   Get the current logged in user
// @access Private

module.exports = router;
