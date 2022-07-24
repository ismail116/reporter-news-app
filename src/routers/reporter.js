const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middleware/auth')
const multer = require('multer')




//Signup

router.post('/signup',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(201).send({reporter})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

///////////////////////////////////////////////////////////////////
// login

router.post('/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

///////////////////////////////////////////////////////////////////
// get Profile

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.reporter)
})

///////////////////////////////////////////////////////////////////
// Update Reporter

router.patch('/reporters',auth,async(req,res)=>{
    try{
      
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','age','password','phone']
        const isValid = updates.every((el)=>allowedUpdates.includes(el))

        if(!isValid){
            return res.status(400).send("Can't update")
        }
        updates.forEach((el)=> (req.reporter[el] = req.body[el]))
        await req.reporter.save()
        res.status(200).send(req.reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

///////////////////////////////////////////////////////////////////
// Delete Reporter

router.delete('/reporters',auth,async(req,res)=>{
    try{
        await Reporter.deleteOne()
        res.status(200).send(req.reporter)
    }
    catch(e){
        res.status(500).send(e)
    }
})
//////////////////////////////////////////////////////////////////////////////

//logout
router.delete('/logout',auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{

            return el !== req.token
        })  
        await req.reporter.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

//////////////////////////////////////////////////////////////////////////////
//logout all 

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        
        await req.reporter.save()
        res.status(200).send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

///////////////////////////////////////////////////////////////////////
// images

const uploads= multer({
    limits:{
        fileSize:1000000  //1MB
    },
    fileFilter(req,file,cb){
      
        if(!file.originalname.match(/\.(jpg|png|jpeg|tiff)$/)){
            return cb (new Error('Please upload an image'))
        }
        cb(null,true)
    }
})
router.post('/profileImage',auth,uploads.single('image'),async(req,res)=>{
    try{
        req.reporter.avatar = req.file.buffer
        await req.reporter.save()
        res.send()
    }
    catch(e){
        res.status(400).send(e)
    }
})
///////////////////////////////////////////////////////////////////////

module.exports = router