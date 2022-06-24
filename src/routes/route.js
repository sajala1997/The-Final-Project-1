const express = require('express');
const router = express.Router();
const commonMW = require ("../middleware/commonMW")


const authorController= require("../controllers/authorController")
const blogsController = require("../controllers/blogsController")

router.post("/authors", authorController.createAuthor)//create author
router.post("/blogs",commonMW.validation, commonMW.authenticate, blogsController.createBlogs)//create blogs
router.get("/blogs",commonMW.authenticate,  blogsController.findBlogs)//get blogs details
router.put("/blogs/:blogsId/tags",commonMW.authenticate,commonMW.authorised,blogsController.updateBlogs) //update blogs by path param
router.delete("/delblogs/:blogId",commonMW.authenticate, commonMW.authorised, blogsController.delBlogs)//delete by path params
router.delete("/blogs", commonMW.authenticate,  blogsController.delBlogsByQuery)//delete by query params

router.post("/login", authorController.loginAuthor)



module.exports = router;
