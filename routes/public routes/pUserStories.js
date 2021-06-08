const express = require("express");
const router = express.Router();

// Loading Story model for public stories
const Story = require("../../models/Story");
const User = require("../../models/User");

// Route to show the stories posted by a single user
router.get("/user/:userId", async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();
    if (stories.length == 0) {
      let user = await User.find({ _id: req.params.userId });
      res.send(`<h1>No Stories posted by ${user[0].displayName} </h1>`);
      // console.log(user);
    } else {
      let detail = stories[0].user;
      res.render("public/singleUserStory", {
        layout: "public",
        stories,
        headOfPage: `Posts by ${detail.displayName}`,
        detail,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

module.exports = router;
