const mongoose = require('mongoose');
const moment = require('moment')

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true


    },
    body: {
        type: String,
        required: true
            
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