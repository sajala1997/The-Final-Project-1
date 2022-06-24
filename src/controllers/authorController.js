const jwt = require("jsonwebtoken");
const authorModel= require("../models/authorModel")
const blogsModel = require("../models/blogsModel")

// const createAuthor= async function (req, res) {
//     try{let data= req.body
    

//     let check = await authorModel.find({emailId: data.emailId})
//     if(check.length==0){
//     const savedData= await authorModel.create(data)

    // if(data.emailId===savedData.emailId)
    // return res.status(409).send({msg: "Email id already exist"})
//     res.send({msg: savedData})}
//     else
//     return res.status(409).send({msg: "Email id already exist"})
// }
//     catch(error){
//         return res.status(500).send({msg: error.message})
//     }
// }





const createAuthor = async function (req, res) {
  try {
      let data = req.body
      let title= req.body.title
      if (await authorModel.findOne({ emailId: data.emailId }))
          return res.status(400).send({ msg: "Email Id already exist" })

      //validate fname
      if (!/^[a-zA-Z.]+$/.test(data.fname)) {
          return res.status(400).send({ status: false, message: `name contain only alphabets` })
      }

      //validate lname
      if (!/^[a-zA-Z.]+$/.test(data.lname)) {
          return res.status(400).send({ status: false, message: `name contain only alphabets` })
      }

      //validate(email)
      if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.emailId)) {
          return res.status(400).send({ status: false, message: `Email should be a valid email address` });
      }

      title
      const isvalid=function(title){
          return["Mr","Mrs","Miss"].indexOf(title)== -1
      }
      if (isvalid(title)){
          return res.status(400).send({status: false, msg:"title shoud be one of Mr, Mrs, Miss"})
      }

      let savedData = await authorModel.create(data)
      res.send({ msg: savedData })
  }
  catch (err) {
      console.log(err.message)
      res.status(500).send({ msg: err.message })
  }
}



const loginAuthor = async function (req, res){
    let userName = req.body.emailId;
    let password = req.body.password;

    if(!userName)
    res.status(400).send({msg: "userName is required"})
    if(!password)
    res.status(400)

    let author = await authorModel.findOne({ emailId: userName, password: password });
  if (!author)
    return res.status(400).send({
      status: false,
      msg: "username or the password is not corerct",
    });

    let token = jwt.sign(
        {
          authorId: author._id.toString(),
          batch: "batch-4",
          organisation: "ProjectBlogphase2",
        },
        "ProjectBlog"
      );
      res.setHeader("x-api-key", token);
      res.status(200).send({ status: true, token: token });
    };


// const getAuthorsData= async function (req, res) {
//     let authors = await authorModel.find()
//     res.send({data: authors})
// }

// const getBlogssWithAuthorDetails = async function (req, res) {
//     let Blogs = await Model.find().populate('authorId')
//     res.send({data: Blogs})
//}


module.exports.createAuthor= createAuthor
module.exports.loginAuthor=loginAuthor
//module.exports.getAuthorsData=getAuthorsData
//module.exports.getBlogssWithAuthorDetails=getBlogssWithAuthorDetails


