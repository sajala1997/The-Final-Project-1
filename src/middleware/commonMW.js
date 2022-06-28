const mongoose = require('mongoose');
const express = require('express');
const authorModel = require('../models/authorModel');
const jwt = require("jsonwebtoken");


const authenticate = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        console.log(token)
         if(!token) token =req.headers["X-Api-Key"];
        if (!token) return res.status(400).send({ status: false, msg: "Token Required" });
        let decodedToken = jwt.verify(token, "ProjectBlog")   
        if (!decodedToken) return res.status(403).send({ status: false, msg: "Not Authorised" });
        
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.authenticate = authenticate
