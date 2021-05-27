const express = require("express");
const router = express.Router();

// Loading Story model for public stories
const Story = require("../../models/Story");
const User = require("../../models/User");

// Loading the homepage for no logged in users
router.get("/", async (req, res) => {
  const resPerPage = 18; // results per page
  let page = req.query.page || 1; // assigning the page query
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean()
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);

    const numOfStories = await Story.countDocuments({ status: "public" });

    res.render("public/pstories", {
      layout: "public",
      stories,
      currentPage: page,
      pages: Math.ceil(numOfStories / resPerPage),
    });
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

/* Showing all the users */

router.get("/Users", async (req, res) => {
  let users = await User.find({}).sort({ firstName: 1 }).lean();

  res.render("public/users.hbs", {
    layout: "public",
    users,
  });
});

/* Show Stories according to the category */

// @desc    Show blogs category
// @route   GET /public/category/blogs
router.get("/public/category/blogs", async (req, res) => {
  try {
    const stories = await Story.find({ status: "public", category: "blog" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    let category = "Blogs";
    res.render("public/category", {
      layout: "public",
      stories,
      category,
    });
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

// @desc    Show story category
// @route   GET /public/category/story
router.get("/public/category/story", async (req, res) => {
  try {
    const stories = await Story.find({ status: "public", category: "story" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    let category = "Stories";

    res.render("public/category", {
      layout: "public",
      stories,
      category,
    });
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

// @desc    Show poem category
// @route   GET /public/category/poems
router.get("/public/category/poems", async (req, res) => {
  try {
    const stories = await Story.find({ status: "public", category: "poem" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    let category = "Poems";

    res.render("public/category", {
      layout: "public",
      stories,
      category,
    });
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

// @desc    Show writeUp category
// @route   GET /public/category/poems
router.get("/public/category/writeups", async (req, res) => {
  try {
    const stories = await Story.find({ status: "public", category: "writeUp" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    let category = "Write-Ups";

    res.render("public/category", {
      layout: "public",
      stories,
      category,
    });
  } catch (err) {
    console.error(err);
    res.render("error/public_error/500");
  }
});

module.exports = router;
