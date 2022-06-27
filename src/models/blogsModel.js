const mongoose = require('mongoose');
const moment = require('moment')

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        // match:/^[a-zA-Z:0-9@]+$/,
        // error:{
        //     type : 'Title must be a string', 
        //     required: 'Title is required',
        //     match:'Title cannot contain any white space',
            
       // }

    },
    body: {
        type: String,
        required: true,
        match:/^[a-zA-Z0-9!@#$&()`.+,/"-<>\s]+$/, //blogcontroller
        error:{
            type : 'Title must be a string',
            required: 'Title is required',
            match:'Title cannot contain any white space',
            
        }
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AuthorProject"
    },
    tags: {
        type: [String]
    },
    category: {
        type: [String],
        required: true
    },
    subcategory: {
        type: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    isPublishedAt: {
        type: String
    },
    deletedAt :{
        type : String
    }


}, { timestamps: true });

module.exports = mongoose.model('BlogsProject', blogsSchema)