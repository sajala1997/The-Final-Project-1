const express = require('express');
const router = express.Router();
const commonMW = require ("../middleware/commonMW")


const authorController= require("../controllers/authorController")
const blogsController = require("../controllers/blogsController")

router.post("/authors", authorController.createAuthor)//create author
router.post("/blogs",commonMW.validation,blogsController.createBlogs)//create blogs
router.get("/blogs",blogsController.findBlogs)//get blogs details
router.put("/blogs/:blogsId/tags",blogsController.updateBlogs) //update blogs by path param
router.delete("/delblogs/:blogId", blogsController.delBlogs)//delete by path params
router.delete("/blogs", blogsController.delBlogsByQuery)//delete by query params



module.exports = router;
