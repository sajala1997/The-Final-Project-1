const authorModel= require("../models/authorModel")

//create author details
const createAuthor= async function (req, res) {
    try {let data= req.body
    let savedData= await authorModel.create(data)
    //errorhandle for email here (209)
    if(data.emailId==savedData.emailId) {
    return res.status(409).send({msg:"Email id is already exist"})}
    else {return res.status(200).send({msg: savedData})}
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}


module.exports.createAuthor= createAuthor
