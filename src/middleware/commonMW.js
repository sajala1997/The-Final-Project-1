const mongoose = require('mongoose');
const express = require('express');
const authorModel = require('../models/authorModel');
const jwt = require("jsonwebtoken");
const blogsModel = require('../models/blogsModel');



const validation = async function (req, res, next) {
    try {
        const author= req.body.authorId
            console.log(author)
            if (!author) return res.status (403).send({msg:"User is not authorised"})
            const authorPresent = await authorModel.findById(req.body.authorId)
            if(!authorPresent) return res.status(404).send({msg:"Data not found"})
            let id =authorPresent._id
            console.log(id)
            if (id!=author) {
                return res.status(403).send({msg:"Authorisation Failed"})
            }
        next()
     }
    
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}

const authenticate = async function(req,res, next){

    let token = req.headers["x-api-key"];
   // if (!token) token = req.headers["x-api-key"];
    if (!token) return res.status(404).send({ status: false, msg: "token must be present" });

    console.log(token);

    let decodedToken = jwt.verify(token, "ProjectBlog");
    if (!decodedToken)
    return res.status(400).send({ status: false, msg: "token is invalid" });
    
    req.authorId = decodedToken.authorId

    next();

}

const authorisedForCreateBlog = async function(req, res, next){

    let token = req.headers["x-api-key"];
    //if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, "ProjectBlog");

    //let id= req.params.authorId
    let userToBeModified = req.params.authorId
    //userId for the logged-in user
    let userLoggedIn = decodedToken.authorId

    //userId comparision to check if the logged-in user is requesting for their own data
    if(userToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
    next()

}


const authorised = async function(req,res,next){

   try{ let token = req.headers["x-api-key"];
    //if (!token) token = req.headers["x-auth-token"];

    let decodedToken = jwt.verify(token, "ProjectBlog");

    let id= req.params.blogsId
    const check= await blogsModel.findById(id)
    console.log(check)
    if(!check)
    res.status(404).send({status: false, msg: "id is wrong"})
    let modAuthor= check.authorId
    console.log(modAuthor)
    
    let authorToBeModified = modAuthor.toString()
    //authorId for the logged-in author
    let authorLoggedIn = decodedToken.authorId
    console.log(authorLoggedIn)

    //athorId comparision to check if the logged-in author is requesting for their own data
    if(authorToBeModified != authorLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
    next()
}
catch(error){
    res.status(500).send({status: false, msg: error.message})
}
 
}

    module.exports.validation = validation
    module.exports.authenticate=authenticate
    module.exports.authorised=authorised
    module.exports.authorisedForCreateBlog=authorisedForCreateBlog