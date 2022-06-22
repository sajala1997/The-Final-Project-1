const blogsModel = require("../models/blogsModel")
const moment = require("moment")
const mongoose = require("mongoose")


//POST-----create blogs
const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let savedData = await blogsModel.create(data)
        res.status(201).send({ status: true, msg: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//GET----retuen blogs collection with filter
const findBlogs = async function (req, res) {
    try {
        let allQuery = req.query
        let blogsDetail = await blogsModel.find(allQuery)
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
        update.isPublishedAt = moment(new Date()).format('DD/MM/YYYY');
        console.log(update)
        let updatedBlog = await blogsModel.findOneAndUpdate({ $and: [{ isDeleted: false }, { _id: req.params.blogsId }] }, { $set: update }, { new: true, upsert: true })
        let blog = req.params.blogsId
        if (!blog) return res.status(404).send({ status: false, data: "ID not Found" })
        else res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }

}

//DELETE----by path param
const delBlogs = async function (req, res) {
    try {
        let blogId = req.params.blogId
        console.log(blogId,"blogId is")
        if (blogId){
            const data = await blogsModel.findById(blogId)
            if (!data)
            return res.status(404).send({ status: false, msg: "blog Not Found with this Id" })

             const saveData = await blogsModel.findOneAndUpdate({ isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
             return res.status(201).send({ status: true, msg: saveData })
        }
         else {
             return  res.status(400).send({ status: false, msg: "id is required" })}
        
        }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//DELETE-----by query params           
const delBlogsByQuery = async function (req, res) {
    try {
        let query = req.query
        const filterByQuery = await blogsModel.find(query)

        if (filterByQuery.length == 0) {   //
            return res.status(404).send({ status: false, msg: "No blog found to delete" })
        }
        const deletedDetails = await blogsModel.updateMany(query, { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY') },//new Date.().toLocaleString()
            { new: true })
        res.status(201).send({ status: true, data: deletedDetails })

    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBlogs = createBlogs
module.exports.findBlogs = findBlogs
module.exports.updateBlogs = updateBlogs
module.exports.delBlogs = delBlogs
module.exports.delBlogsByQuery = delBlogsByQuery

