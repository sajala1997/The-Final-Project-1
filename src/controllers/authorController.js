const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");


//create author details
const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let title=req.body.title
        
        if (await authorModel.findOne({ emailId: data.emailId }))
            return res.status(400).send({ msg: "Email Id already exist" })
            

        //validate fname
        if (!/^[a-zA-Z.]+$/.test(data.fname)) {
            return res.status(400).send({ status: false, message: `First name contain only alphabets` })
        }

        //validate lname
        if (!/^[a-zA-Z.]+$/.test(data.lname)) {
            return res.status(400).send({ status: false, message: `last name contain only alphabets` })
        }

        //validate(email)
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.emailId)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        //title
        const isvalid=function(title){
            return["Mr","Mrs","Miss"].indexOf(title)=== -1
            
        }
        if (isvalid(title)){
            return res.status(400).send({status: false, msg:"title shoud be one of Mr, Mrs, Miss"})
        }
        //password validation
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(data.password)) {
            return res.status(400).send({ status: false, message: `password shoud be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })
          } 
          
        let savedData = await authorModel.create(data)
       
        return res.status(201).send({ msg: savedData })


    
    
    }
    catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: err.message })
    }
}

//login and token creation
const loginAuthor = async function (req, res) {
   try {let AuthorName = req.body.emailId;
    let password = req.body.password;
    //email is required
    if(!AuthorName) return res.status(400).send({status:false,msg:"author Email is required"})
    //password is required
    if(!password) return res.status(400).send({status:false,msg:"author password is required"})
    //email and password check from db
    let author = await authorModel.findOne({ emailId: AuthorName, password: password });
    if (!author)
        return res.status(400).send({ status: false, msg: "authorId or the password is not correct" });

    //token created here
    let token = jwt.sign(
        {
            authorId: author._id.toString(),
            batch: "batch-4",
            organisation: "ProjectBlogphase2",
        },
        "ProjectBlog"
    );
    //res.setHeader("x-api-key", token);
    return res.status(201).send({ status: true, token: token });
}
catch (err) {
    console.log(err.message)
    res.status(500).send({ msg: err.message })
}
    
};






/*const patterns={
    fname :/^[a-z\d]{5,12}$/i,
    lname :/^[a-z\d]{5,12}$/i,
    emailId :/^([a-z\d]\.-]+)@([a-z\d-]+)\.([a-z])$/,
    password :/^[\w@-]{8,20}$/,
};

function validate(field,regex){
    if(regex.test(field.value)){
        field.className='valid';
    }else{
        field.className='invalid';
    }
}
*/
module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor
