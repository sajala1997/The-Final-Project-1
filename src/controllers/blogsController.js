const blogsModel = require("../models/blogsModel")
const moment = require("moment")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")


//POST-----create blogs
const createBlogs = async function (req, res) {


    try {
        let data = req.body
        let author = req.body.authorId
        let body = req.body.body
        if (!author) return res.status(400).send({ status: false, msg: "authorId is mandatory" })
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];
        let decodedToken = jwt.verify(token, "ProjectBlog");
        console.log(decodedToken.authorId)
        console.log(author)
        if (decodedToken.authorId !== author) return res.status(400).send({ status: false, msg: "Author not Authorized to create blog" })


//validate title
if (!/^[a-zA-Z0-9:-_ . ]+$/.test(data.title)) {
    return res.status(400).send({ status: false, message: `title should not be empty it contains only alphabets and numeric values and two special characters - and :` })
}

//validate body
if (!/^[a-zA-Z0-9:-_ . ]+$/.test(body)) {
    return res.status(400).send({ status: false, message: `body should not be empty it contains only alphabets and numeric values and two special characters like - and :` })
}


        let savedData = await blogsModel.create(data)
        res.status(201).send({ status: true, msg: savedData })
    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//GET----retuen blogs collection with filter
const getBlogs = async function (req, res) {
    try {

        let allQuery = req.query
        let blogsDetail = await blogsModel.find(({ $and: [allQuery, { isDeleted: false }, { isPublished: true }] }))
        console.log(blogsDetail)
        if (blogsDetail == false)
            res.status("404").send({ status: false, msg: "data not found" })
        else
            res.status(200).send({ status: true, data: blogsDetail })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//PUT----update blog
const updateBlogs = async function (req, res) {
    try {
        let update = req.body
        let blog = req.params.blogsId
        console.log(blog)
        if (!blog) return res.status(404).send({ status: false, data: "ID not Found in path param" })

        const check = await blogsModel.findById(blog)
        if (!check) return res.status(404).send({ status: false, msg: "data not found with this blog id" })
        console.log(check)
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "ProjectBlog")
        console.log(check.authorId.toString())
        if (decodedToken.authorId !== check.authorId.toString()) return res.status(401).send({ status: false, msg: "User logged is not allowed to modify the requested blogs data" })

        let updatedBlog = await blogsModel.findOneAndUpdate({ $and: [{ isDeleted: false }, { _id: req.params.blogsId }] }, { $push: update, isPublishedAt: moment(new Date()).format('DD/MM/YYYY h:mma') }, { new: true, upsert: true })

        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }

}


//DELETE----by path param
const delBlogs = async function (req, res) {
    try {

        let blog = req.params.blogsId
        if (!blog) return res.status(404).send({ status: false, data: "ID not Found in path param" })

        const check = await blogsModel.findById(blog)
        if(check.isDeleted=="true") return res.status(200).send({ status: false, msg: "data is already deleted" }) 
        if (!check) return res.status(404).send({ status: false, msg: "data not found with this blog id" })
        console.log(check)
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "ProjectBlog")
        console.log(check.authorId.toString())
        if (decodedToken.authorId !== check.authorId.toString()) return res.status(401).send({ status: false, msg: "User logged is not allowed to delete the requested blogs data" })

        let DeletedBlog = await blogsModel.updateMany({ $and: [{ isDeleted: false }, { _id: blog }] },
            { $set: { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY h:mma') } }, { new: true })

        return res.status(200).send({ status: true, data: DeletedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }


}


//DELETE----by query param
const delBlogsByQuery = async function (req, res) {

    try {
        let query = req.query
        //console.log(query)
        let data = Object.keys(query)
        if (!data.length) return res.status(411).send({ status: false, msg: "Data can not be empty" });
        let blog = await blogsModel.find(query)
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "Author is not authenticated" })
        let decodedToken = jwt.verify(token, "ProjectBlog")
        console.log(decodedToken)
        if (!decodedToken) return res.status(403).send({ status: false, msg: "User is not authorised" })
        let authorisedId = decodedToken.authorId
        console.log(authorisedId)
        let auth = blog.find(e => e.authorId == authorisedId)//here we are finding out author id which is related to query params and whose value is equal to our decodedToken. if we will find the value we will get authorid else undefined
        console.log(auth)
        if (auth === undefined) return res.status(404).send({ msg: "no such blog found to delete in your collection" })
        // console.log(req.token)//it will give us author id which is in decoded token and it will give us those author id only which is authorised to update or delete    
        let deletBlog = await blogsModel.findByIdAndUpdate(
            { _id: auth._id },
            { $set: { isDeleted: true, isDeletedAt: new Date() } },
            { new: true })
        console.log(deletBlog)
         return res.status(200).send({ status: true, msg: deletBlog })

    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}
    
        


module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.delBlogs = delBlogs
module.exports.delBlogsByQuery = delBlogsByQuery

