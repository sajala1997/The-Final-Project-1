let axios = require("axios")


const meme = async function (req, res) {
    try { 
        let id=req.query.template_id
        let text0=req.query.text0
        let text1=req.query.text1
        let UserName=req.query.username
        let pass=req.query.password
        var options = {
            method: "post",
           url:`https://api.imgflip.com/caption_image?template_id=${id}&text0=${text0}&text1=${text1}&username=${UserName}&password=${pass}`
        }
        let result = await axios(options)
        res.status(200).send({ msg: result.data })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.meme = meme