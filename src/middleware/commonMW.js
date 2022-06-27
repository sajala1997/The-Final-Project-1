const mongoose = require('mongoose');
const express = require('express');
const authorModel = require('../models/authorModel');
const jwt = require("jsonwebtoken");


// const authenticate=async function(req,res,next){
//         let token = req.headers ["x-api-key"];
//         if(!token) token1 =req.headers["X-Api-Key"];
//         if(!token) return res.status(400).send({status:false,msg:"Author not loged In"});
//         let decodedToken = jwt.verify(token,"ProjectBlog");
//         if(!decodedToken) return res.status(403).send({status:false,msg:"Not Authorised"});
//         //if(token!==token) return res.status(400).send({status:false,msg:"wrong Token"})
        
//         next()
// }

const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        console.log(token)
        // if(!token) token =req.headers["X-Api-Key"];
        if (!token) return res.status(400).send({ status: false, msg: "Token Required" });
        let decodedToken = jwt.verify(token, "ProjectBlog")   
        if (!decodedToken) return res.status(403).send({ status: false, msg: "Not Authorised" });
        // let author = req.params.authorId;
        // console.log(author);
        // let authorSignedUp = decodedToken.authorId;
        // console.log(authorSignedUp);
        // if (author !== authorSignedUp) return res.status(403).send({ status: false, msg: "Validation Failed" });

        // req.authorId = decodedToken.authorId
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


// const authorised = async function(req,res,next){

//     try{ let token = req.headers["x-api-key"];
//      //if (!token) token = req.headers["x-auth-token"];
 
//      let decodedToken = jwt.verify(token, "ProjectBlog");
 
//      let id= req.params.blogsId
//      const check= await blogsModel.findById(id)
//      console.log(check)
//      if(!check)
//      res.status(404).send({status: false, msg: "id is wrong"})
//      let modAuthor= check.authorId
//      console.log(modAuthor)
     
//      let authorToBeModified = modAuthor.toString()
//      //authorId for the logged-in author
//      let authorLoggedIn = decodedToken.authorId
//      console.log(authorLoggedIn)
 
//      //authorId comparision to check if the logged-in author is requesting for their own data
//      if(authorToBeModified != authorLoggedIn) return res.send({status: false, msg: 'Author logged is not allowed to modify the requested authors data'})
//      next()
//  }
//  catch(error){
//      res.status(500).send({status: false, msg: error.message})
//  }
  
//  }


// const validation = async function (req, res, next) {
//     try {
//         const author= req.body.authorId
//             if (!author) return res.status (404).send({msg:"No Author Exist"})
//             const authorPresent = await authorModel.findById(req.body.authorId)
//             if(!authorPresent) return res.status(404).send({msg:"Data not found"})
//             let id =authorPresent._id
//             console.log(id)
//             if (id!=author) {
//                 return res.status(403).send({msg:"Authorisation Failed"})
//             }
//         next()
//      }
    
//     catch (err) {
//         console.log(err.message)
//         res.status(500).send({ msg: err.message })
//     }
// }

// //token authenticity middleware
// const mid1= async function(req,res,next){
//     let token = req.headers["x-Api-key"];
//     if (!token) token = req.headers["x-api-key"];
    
    
//     //If no token is present in the request header return error
//     if (!token) return res.send({ status: false, msg: "token must be present" });
    
//     console.log(token);
//     //valid token
//     let decodedToken = jwt.verify(token, "ProjectBlog");
//     if (!decodedToken)
//       return res.send({ status: false, msg: "token is invalid" });
    
//     let authorId = req.params.authorId;
//     let author = await authorModel.findById(authorId);
//     //Return an error if no author with the given id exists in the db
//     if (!author) {
//       return res.send("No such author exists");
//     }
//     next()
//     }

module.exports.authenticate = authenticate
