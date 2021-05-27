const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: { 
    type: String,
    default: 'public',
    enum: ['public', 'private'],
  },
  category: {
    type: String,
    default: 'blog',
    enum: ['blog','story', 'poem', 'writeUp'],
  },
  visits: {
    type: Number,
  },
  comments: {
    type: Array,
    default: [],
  },
  likers: {
    type: Number,
  },
  idOfLikers: {
    type: Array,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Story', StorySchema)
