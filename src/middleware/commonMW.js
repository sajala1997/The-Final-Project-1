const mongoose = require('mongoose');
const express = require('express');
const authorModel = require('../models/authorModel');



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
    module.exports.validation = validation