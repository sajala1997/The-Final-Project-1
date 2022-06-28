const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { isEmail } = require('validator')

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
    

    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"] 
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true });



module.exports = mongoose.model('AuthorProject', authorSchema)