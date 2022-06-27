const blogsModel = require("../models/blogsModel")
const moment = require("moment")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")


// const isValidRequestBody=function(request){
//     return Object.keys(request).length>0
// }

// const isValidObjectId= function(objectId){
//     return mongoose.Types.ObjectId.isValid(objectId)
// }

//POST-----create blogs
const createBlogs = async function (req, res) {
    try {
        let data = req.body
        let author = req.body.authorId
        let body = req.body.body
        if (!author) return res.status(400).send({ status: false, msg: "authorId is mandatory" })
        let check = await blogsModel.findOne({_id: author})
        if(!check) return res.status(400).send({status: false, msg: "authorId is not correct"})
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];
        let decodedToken = jwt.verify(token, "ProjectBlog");
        if (decodedToken.authorId !== author) return res.status(400).send({ status: false, msg: "Author not Authorized to create blog" })


//validate title
if (!/^[a-zA-Z0-9:-]+$/.test(data.title)) {
    return res.status(400).send({ status: false, message: `title should not be empty it contains only alphabets and numeric values and two special characters - and :` })
}

//validate body
if (!/^[a-zA-Z0-9:-]+$/.test(body)) {
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
////////////////////////
// const Updateblog = async function (req, res) {

    //     let token = req.headers ["x-api-key"];
    //     console.log(token)
    //    // if(!token) token =req.headers["X-Api-Key"];
    //     if(!token) return res.status(400).send({status:false,msg:"Author not loged In"});
    //     let decodedToken = jwt.verify(token,"Project-1");
    //     if(!decodedToken) return res.status(403).send({status:false,msg:"Not Authorised"});
    //     let author = req.params.authorId
    //     console.log(author)
//     let update = req.body
//     let blogId = await blogsModel.findById(req.params.authorId)
//     console.log(blogId)
//     let updatedBlog = await blogsModel.findOneAndUpdate(
//         { _id: req.params.authorId },
//         { $set: update },
//         {
//             new: true,
//             upsert: true
//         })
//     console.log(update)
//     res.status(200).send({ status: true, data: updatedBlog })
// }

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
            { $set: { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY h:mma') } }, { new: true })

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
        //console.log(query)
        let data = Object.keys(query)
        if (!data.length) return res.status(411).send({ status: false, msg: "Data can not be empty" });
        let blog = await blogsModel.find(query).select({ authorId: 1, _id: 1 })//
        console.log(blog)
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "Author is not authenticated" })
        let decodedToken = jwt.verify(token, "Project-1")
        console.log(decodedToken)
        if (!decodedToken) return res.status(403).send({ status: false, msg: "User is not authorised" })
        let authorisedId = decodedToken.userid
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
    
        //     try {
        //       let deleteData = req.query;
        //       console.log(deleteData);
          
        //       if (Object.keys(deleteData).length === 0) {
        //         return res.send({ status: false, msg: "ERROR" });
        //       }
          
        //       let authId = req.headers.authorId;
        //       console.log(authId);
          
        //       let delData = await blogsModel.updateMany(
        //         { $and: [deleteData, { isDeleted: false }, { authorId: authId }] },
        //         { isDeleted: true, deletedAt: new Date() },
        //         { new: true }
        //       );
          
        //       if (delData.matchedCount == 0) {
        //         return res.status(404).send({
        //           status: false,
        //           msg: "you are not authorised for this particular task",
        //         });
        //       }
          
        //       return res.status(200).send({ status: true, msg: "blog is deleted" });
        //     } catch (err) {
        //       res.status(500).send({ status: false, msg: err.message });
        //     }
        //   };
//         let data = req.query

//         //validating the data
//         if (!isValidRequestBody(data)) {
//             res.status(400).send({ status: false, msg: "please enter any query" })
//             return;
//         }
//         let { authorId, category, subcategory, tags } = data //extracting

//         let filter = { isdeleted: false, isPublished: true }

//         if (!isValidRequestBody(data)) {
//             res.status(400).send({ status: false, msg: "please enter any valid query : authorId, category,subcategory,tags" })
//             return;
//         }

//         if (!isValidObjectId(authorId)) {
//             return res.status(400).send({ status: false, msg: "please enter a valid authorId" })
//         }


//         //authorId
//         if (isValid(authorId) && isValidRequestBody(authorId)) {
//             let author = await blogsModel.find({ authorId: authorId });
//             if (author.length == 0) {
//                 res.status(404).send({ status: false, msg: "no data found with this authorId" })
//                 return;
//             }
//             filter["authorId"] = authorId
//         }//if authorId is matched with database then add it into filter


//         //category
//         if (isValid(category)) {
//             let cat = await blogsModel.find({ category: category });
//             if (cat.length == 0) {
//                 res.status(404).send({ status: false, msg: "no data found with this category" })
//                 return;
//             }
//             filter["category"] = category
//         }//if category is matched with database then add it into filter


//         //subcategory
//         if (isValid(subcategory)) {
//             let subcat = await blogsModel.find({ subcategory: subcategory });
//             if (subcat.length == 0) {
//                 res.status(404).send({ status: false, msg: "no data found with this subcategory" })
//                 return;
//             }
//             filter["subcategory"] = subcategory
//         }//if subcategory is matched with database then add it into filter

//         //tags
//         if (isValid(tags)) {
//             let tags = await blogsModel.find({ tags: tags });
//             if (tags.length == 0) {
//                 res.status(404).send({ status: false, msg: "no data found with this tags" })
//                 return;
//             }
//             filter["tags"] = tags
//         }//if tags  matched with database then add it into filter

//         let blogs = await blogsModel.find(filter)

//         //blog is not found then send status false
//         if (blogs && blogs.length == 0) {
//             return res.status(404).send({ status: false, msg: "no such documents found or it may be deleted" })
//         }

//         //if blog found then update isdeleted:true and set deletedAt
//         let deletedBlogs = await blogsModel.updateMany({ _id: { $in: blogs } }, { $set: { isDeleted: true, deletedAt: moment(new Date()).format('DD/MM/YYYY h:mma') } }, { new: true })
//         return res.status(200).send({status:true,msg:"blog deleted successfully",data:deletedBlogs})
//     }
    
//     catch (err){
//         return res.status(500).send({msg:"ERROR",error:err.message})

// }



module.exports.createBlogs = createBlogs
module.exports.getBlogs = getBlogs
module.exports.updateBlogs = updateBlogs
module.exports.delBlogs = delBlogs
module.exports.delBlogsByQuery = delBlogsByQuery

