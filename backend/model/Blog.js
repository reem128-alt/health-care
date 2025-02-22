const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;