const express = require('express');
const router = express.Router();
const commonMW = require ("../middleware/commonMW")


const authorController= require("../controllers/authorController")
const blogsController = require("../controllers/blogsController")

router.post("/authors", authorController.createAuthor)//create author //Done
router.post("/login", authorController.loginAuthor)//login author //Done
router.post("/blogs",commonMW.authenticate,blogsController.createBlogs)//create blogs //Done
router.get("/blogs",commonMW.authenticate,blogsController.getBlogs)//get blogs details //Done
router.put("/blogs/:blogsId",commonMW.authenticate,blogsController.updateBlogs) //update blogs by path param tags category authorid
router.delete("/blogs/:blogsId",commonMW.authenticate,blogsController.delBlogs)//delete by path params //Done
router.delete("/blogs",commonMW.authenticate,blogsController.delBlogsByQuery)//delete by query params



module.exports = router;
