const blogsModel = require("../models/blogsModel")
const moment = require("moment")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
//const isvalid = require('isvalid')
// const isValid = function(data.title){
//     return mongoose.Types.(data.title).isValid(data.title)
// }

//POST-----create blogs
const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let author = req.body.authorId
        if (!author) return res.status(400).send({ status: false, msg: "authorId is mandatory" })
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];
        let decodedToken = jwt.verify(token, "ProjectBlog");
        if (decodedToken.authorId !== author) return res.status(400).send({ status: false, msg: "Author not Authorized to create blog" })
        //let authorcheck = await authorModel.find(_id)
        //if(author!==authorcheck) return res.status(404).send({status :false, msg:"Author is not found"})
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
        if (!blog) return res.status(404).send({ status: false, data: "ID not Found in path param" })

        const check = await blogsModel.findById(blog)
        if (!check) return res.status(404).send({ status: false, msg: "data not found with this blog id" })
        console.log(check)
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "ProjectBlog")
        console.log(check.authorId.toString())
        if (decodedToken.authorId !== check.authorId.toString()) return res.status(401).send({ status: false, msg: "User logged is not allowed to modify the requested blogs data" })

        let updatedBlog = await blogsModel.findOneAndUpdate({ $and: [{ isDeleted: false }, { _id: req.params.blogsId }] }, { $push: update, isPublishedAt: moment(new Date()).format('DD/MM/YYYY') }, { new: true, upsert: true })

        return res.status(200).send({ status: true, data: updatedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }

}
////////////////////////
const Updateblog = async function (req, res) {

    //     let token = req.headers ["x-api-key"];
    //     console.log(token)
    //    // if(!token) token =req.headers["X-Api-Key"];
    //     if(!token) return res.status(400).send({status:false,msg:"Author not loged In"});
    //     let decodedToken = jwt.verify(token,"Project-1");
    //     if(!decodedToken) return res.status(403).send({status:false,msg:"Not Authorised"});
    //     let author = req.params.authorId
    //     console.log(author)
    let update = req.body
    let blogId = await blogsModel.findById(req.params.authorId)
    console.log(blogId)
    let updatedBlog = await blogsModel.findOneAndUpdate(
        { _id: req.params.authorId },
        { $set: update },
        {
            new: true,
            upsert: true
        })
    console.log(update)
    res.status(200).send({ status: true, data: updatedBlog })
}

//DELETE----by path param
const delBlogs = async function (req, res) {
    try {

        let blog = req.params.blogsId
        if (!blog) return res.status(404).send({ status: false, data: "ID not Found in path param" })

        const check = await blogsModel.findById(blog)
        if (!check) return res.status(404).send({ status: false, msg: "data not found with this blog id" })
        console.log(check)
        let token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "ProjectBlog")
        console.log(check.authorId.toString())
        if (decodedToken.authorId !== check.authorId.toString()) return res.status(401).send({ status: false, msg: "User logged is not allowed to delete the requested blogs data" })

        let DeletedBlog = await blogsModel.updateMany({ $and: [{ isDeleted: false }, { _id: blog }] },
            { $set: { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY') } }, { new: true })

        return res.status(200).send({ status: true, data: DeletedBlog })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }


}
// try {
//     let blogId = req.params.blogId
//     console.log(blogId,"blogId is")
//     if (blogId){
//         const data = await blogsModel.findById(blogId)
//         if (!data)
//         return res.status(404).send({ status: false, msg: "blog Not Found with this Id" })

//          const saveData = await blogsModel.findOneAndUpdate({ isDeleted: true }, { $set: { isDeleted: false } }, { new: true })
//          return res.status(201).send({ status: true, msg: saveData })
//     }
//      else {
//          return  res.status(400).send({ status: false, msg: "id is required" })}

//     }
// catch (err) {
//     console.log(err.message)
//     return res.status(500).send({ status: false, msg: err.message })
// }


//DELETE-----by query params           
const delBlogsByQuery = async function (req, res) {
    try {

        let query = req.query
    let data=Object.keys(query)//when allQuery is empty
    if (!data.length) return res.status(404).send({msg:"some data required in query param"})
///////
        
        
        let filterByQuery = await blogsModel.find(query)
        if(!filterByQuery) return res.status(400).send({status:false, msg:"data not found"})
        console.log(filterByQuery.authorId)

        //query.isDeleted = false

        // let authorLoggedin= req.authorId
        //console.log(req.query.authorId)
        // query.authorId=authorLoggedin
        //const filterByQuery = await blogsModel.find(query)
        // console.log(filterByQuery.authorId)
        // let token = req.headers["x-api-key"];
        // let decodedToken = jwt.verify(token, "ProjectBlog")
        // //  console.log(filterByQuery.authorId.toString())
        // if (decodedToken.authorId !== filterByQuery.authorId) return res.status(401).send({ status: false, msg: "User logged is not allowed to delete the requested blogs data" })

        // // filterByQuery.authorId==decodedToken



        // if (filterByQuery.length == 0) {   //
        //     return res.status(404).send({ status: false, msg: "No blog found to delete" })
        // }
        // const deletedDetails = await blogsModel.updateMany(query, { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY') },//new Date.().toLocaleString()
        //     { new: true })
        // res.status(201).send({ status: true, data: deletedDetails })
res.send({msg:"done"})
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }
}



//     try {
//         let query = req.query
//         const filterByQuery = await blogsModel.find(query)

//         if (filterByQuery.length == 0) {   
//             return res.status(404).send({ status: false, msg: "No blog found to delete" })
//         }
//         const deletedDetails = await blogsModel.updateMany(query,{ isDeleted:true, deletedAt: moment(new Date()).format('DD/MM/YYYY') },//new Date.().toLocaleString()
//             { new: true })
//         res.status(201).send({ status: true, data: deletedDetails })

//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send({ status: false, msg: err.message })
//     }
// }
//=================================
// const delBlogsByQuery = async function (req, res) {
//     try {
//         let query = req.query
//         console.log(query)
//         query.isDeleted=false
//         console.log(query)
//         let authorLoggedin= req.authorId
//         query.authorId=authorLoggedin
//         const filterByQuery = await blogsModel.find(query)
//         console.log(filterByQuery)
//         console.log(filterByQuery.length)

//         if (filterByQuery.length == 0) {   //
//             return res.status(404).send({ status: false, msg: "No blog found to delete" })
//         }
//         const deletedDetails = await blogsModel.updateMany(query, { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY') },//new Date.().toLocaleString()
//             { new: true })
//         res.status(201).send({ status: true, data: deletedDetails })

//     }
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send({ status: false, msg: err.message })
//     }
// }

module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.delBlogs = delBlogs
module.exports.delBlogsByQuery = delBlogsByQuery

