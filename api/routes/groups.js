const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

//Loading in models
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Group = require("../../models/Group");

// @route  GET api/groups/form
// @desc   Displaying group form
// @access Private
router.get("/form", (req, res) => {
  const user = req.user;
  res.render("groupForm");
});

// @route  POST api/groups/create
// @desc   Allows user to create a group
// @access Private
router.post("/create", (req, res) => {
  const user_id = req.user;

  const groupFields = {};
  if (req.body.name) groupFields.name = req.body.name;
  if (req.body.size) groupFields.size = req.body.size;
  if (req.body.status) groupFields.status = req.body.status;

  User.findOne({ _id: user_id }).then(user => {
    Group.create({
      name: groupFields.name,
      size: groupFields.size,
      status: groupFields.status
    }).then(group => {
      group.users.push(user);
      user.groups.push(group);
      console.log(group);

      user
        .save()
        .then(
          group
            .save()
            .then(console.log("saved"))
            .catch(err => console.log(err))
        )
        .catch(err => console.log(err));
    });
  });
});

// @route  GET api/groups
// @desc   Allows user to create a group
// @access Private
router.get("/", (req, res) => {
  const user_id = req.user;
  User.findOne({ _id: user_id }).then(user => {
    const groups = user.groups;
    res.render("groupExists", { groups: groups });
  });
});

// @route  GET api/groups/id/:id
// @desc   View individual group
// @access Private
router.get("/group_id/:id", (req, res) => {
  const group_id = req.params.id;
  Group.findOne({ _id: group_id }).then(group => {
    //console.log(group);
    res.render("groupIndividual", { group: group });
    //res.send(group);
  });
});

// @route  GET api/groups/find
// @desc   Display profiles for adding to group
// @access Private
router.get("/find/:id", (req, res) => {
  const groupId = req.params.id;
  //console.log(groupId);
  Profile.find({}, null, { sort: { handle: 1 } }).then(profiles => {
    const groupId = req.params.id;
    res.render("addMembers", { profiles: profiles, groupId: groupId });
  });
});

// @route  POST api/groups/add/:id
// @desc   View individual group
// @access Private
router.post("/add/:id", (req, res) => {
  const profileId = req.params.id;
  const groupId = req.body.add;
  Profile.findOne({ _id: profileId }).then(profile => {
    //Create request object
    const request = {
      group_id: groupId,
      active: true
    };
    //Add to requests array
    profile.requests.push(request);
    profile.save().then(profile => res.json(profile));
  });
});

module.exports = router;
