const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporter')

const auth = async(req,res,next)=>{
    try{
        // Bearer token --> replace
        const token = req.header('Authorization').replace('Bearer ','')
        // console.log(token)

        const decode =jwt.verify(token,'nodeCourse')
        // console.log(decode)

        const reporter = await Reporter.findOne({_id:decode._id,tokens:token})

        if(!reporter){
            throw new Error()
        }
        req.reporter = reporter

          next()
    }
    catch(e){
        res.status(401).send({error:"Please Authenticate"})
    }
  
}


module.exports= auth