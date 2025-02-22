const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const BlogController = require("../controller/blogController");

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
router.post("/", upload.single("imageUrl"), BlogController.createBlog);
router.put("/:id", upload.single("imageUrl"), BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

module.exports = router;