const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add')
})

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    
    req.body.user = req.user.id
    await Story.create(req.body)
    
    res.redirect('/login/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// Searching Posts
router.post('/search', async (req,res)=>{ 
  let fltrTitle = req.body.fltrTitle
  try {
    const stories = await Story.find({ $text: { $search: fltrTitle } }).populate('user').sort({createdAt: 'desc'}).lean()
    res.render('stories/index', {
      stories,
      pageHeading: `Search results for '${fltrTitle}'`,
    })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuth,async (req, res) => {
  const resPerPage = 18; // results per page
  let page = req.query.page || 1 // assigning the page query
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
      .skip((resPerPage * page) - resPerPage)
      .limit(resPerPage)
    
    const numberOfStories = await Story.countDocuments({status: 'public'});
    res.render('stories/index', {
      stories,
      pageHeading: "All Posts",
      currentPage: page,
      pages: Math.ceil(numberOfStories/resPerPage)
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean()

    if (!story) {
      return res.render('error/404')
    }
    let requestPostId = req.params.id;
    let comments = story.comments
    let date = story.createdAt.toDateString();
    let loggedUser = req.user.id;
    console.log(loggedUser);
    let arrayOfLikers = story.idOfLikers;
    let buttonContent;
    if(arrayOfLikers != undefined && arrayOfLikers.includes(loggedUser)){
      buttonContent = 'Unlike';
    } else {
      buttonContent = 'Like';
    }

    Story.findOneAndUpdate({_id: requestPostId}, {$inc: {visits: 1}}, (err,post)=>{
      if (story.user._id != req.user.id && story.status == 'private') {
        res.render('error/404')
      } else {
        res.render('stories/show', {
          story,
          vis: post.visits,
          comments,
          loggedIn: req.user.displayName,
          loggedInId: req.user._id,
          buttonContent,
          date,
        })
      }
    })


  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})


// Likes
router.post('/:id/act', ensureAuth, async (req, res, next) => {
  const action = req.body.action;
  const idOfLikers = req.body.userId;
  let story = await Story.findById(req.params.id).populate('user').lean()
  let checkIfLiked = story.idOfLikers;
  // const counter = action === 'Like' ? 1 : -1;
  if(action === 'Like'){
    // Check if already liked
    if(checkIfLiked.includes(idOfLikers)){
      console.log("You bastard!");     
    } else {
      Story.updateOne({_id: req.params.id}, {$inc: {likers: 1}}, {}, (err, numberAffected) => {
        console.log(err);
      });
      Story.updateOne({_id: req.params.id}, {$push: {idOfLikers: idOfLikers}}, {}, (err, numberAffected) => {
        console.log(err);
      });
    }
      
  } else {
    if(checkIfLiked.length === 0){
      console.log("Smart bn rha hai saale?")
    } else {
      Story.updateOne({_id: req.params.id}, {$inc: {likers: -1}}, {}, (err, numberAffected) => {
        console.log(err);
      });
      Story.updateOne({_id: req.params.id}, {$pull: {idOfLikers: idOfLikers}}, {}, (err, numberAffected) => {
        console.log(err);
      });
    }
    
  }
  
});

// Reading comments of a single post
router.get('/:id/comments', ensureAuth, async (req,res)=>{
  try {
    let post = await Story.findById(req.params.id).populate('user').lean();

    let comments = post.comments
    let idOfPost = req.params.id
    res.render('stories/readComments', {
      post,
      layout: 'main',
      comments,
      idOfPost,
    })
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      res.render('stories/edit', {
        story,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/login/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      await Story.remove({ _id: req.params.id })
      res.redirect('/login/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete comment on story
// @route   DELETE /stories/comment/:id
// /stories/comment/{{_id}}
router.post('/:id/:name/:comment', ensureAuth, async (req,res)=>{
  try {
    let storyId = req.params.id
    let commentorName = req.params.name
    let commentValue = req.params.comment
    let story = await Story.findById(req.params.id).lean()
    if (!story) {
      return res.render('error/404')
    }
    if(commentorName != req.user.displayName){
      console.log("Redirected")
      res.redirect(`/stories/${storyId}`)
    }  
    else {
      await Story.updateOne({_id: req.params.id}, { $pull: { comments: {"username": commentorName, "comment": commentValue } } }, {}, (err, effect)=>{console.log(err)}) 
      res.redirect(`/stories/${storyId}`)
    }

  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()
    let detail = stories[0].user
    res.render('stories/single', {
      stories,
      detail,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

/* Show Stories according to the category */

// @desc    Show blogs category
// @route   GET /stories/category/blogs
router.get('/category/blogs', ensureAuth,async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'blog' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()
    let category = "Blogs"
    res.render('stories/categoryPosts', {
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show story category
// @route   GET /stories/category/story
router.get('/category/story', ensureAuth,async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'story' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

      let category = "Stories"

    res.render('stories/categoryPosts', {
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show poem category
// @route   GET /stories/category/poems
router.get('/category/poems', ensureAuth,async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'poem' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    let category = "Poems"

    res.render('stories/categoryPosts', {
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show writeUp category
// @route   GET /stories/category/poems
router.get('/category/writeups', ensureAuth,async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public', category: 'writeUp' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    let category = "Write-Ups"

    res.render('stories/categoryPosts', {
      stories,
      category,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
