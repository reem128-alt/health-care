const Blog = require('../model/Blog');
const errorHandler = require('../middleware/error');
const fs = require('fs');

// Get all blogs
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }); // Sort by newest first
    if (!blogs) {
      return next(errorHandler(404, 'No blogs found'));
    }
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
};

// Get a single blog by ID
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, 'Blog not found'));
    }
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
};

// Create a new blog
const createBlog = async (req, res, next) => {
  try {
    const blogData = req.body;
    
    // Add image URL if an image was uploaded
    if (req.file) {
      blogData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const blog = new Blog(blogData);
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
};

// Update a blog
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, 'Blog not found'));
    }

    const updateData = req.body;

    // Handle image update if a new image is uploaded
    if (req.file) {
      // Delete old image if it exists
      if (blog.imageUrl) {
        const oldImagePath = blog.imageUrl.replace('/uploads/', '');
        const fullPath = `uploads/${oldImagePath}`;
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
};

// Delete a blog
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(errorHandler(404, 'Blog not found'));
    }

    // Delete associated image if it exists
    if (blog.imageUrl) {
      const imagePath = blog.imageUrl.replace('/uploads/', '');
      const fullPath = `uploads/${imagePath}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};