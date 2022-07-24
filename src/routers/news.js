const express = require('express')
const router = express.Router()
const News = require('../models/news')
const auth = require('../middleware/auth')
const multer = require('multer')

// Create

router.post('/news',auth,async(req,res)=>{
    try{
        // spread operator (copy of data) ....
        const news = new News({...req.body,owner:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//////////////////////////////////////////////////////////////
//get

router.get('/news',auth,async(req,res)=>{
    try{
       await req.reporter.populate('news')
        res.status(200).send(req.reporter.news)
    }
    catch(e){
        res.status(500).send(e.message)
    }

})
//////////////////////////////////////////////////////////////
// get by id

router.get('/news/:id',auth,async(req,res)=>{
    try{
        
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        console.log(news)
        if(!news){
           return res.status(404).send('No News is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
//////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
// update by id

router.patch('/news/:id',auth,async(req,res)=>{
    try{
         // id news / _id owner
        const _id = req.params.id
        const news = await News.findOneAndUpdate(
            {_id,owner:req.reporter._id},
            req.body,
            {
            new:true,
            runValidators:true
            }
        )
        if(!news){
            return res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

////////////////////////////////////////////////////////////////////
// delete by id

router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('No news is found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})
////////////////////////////////////////////////////////////////////
// get ReporterNews

router.get('/reporterNews/:id',auth,async(req,res)=>{
    try{

        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('no News is found')
        }
        await news.populate('owner')
        res.status(200).send(news.owner)
    }
    catch(e){
        res.status(500).send(e.message)
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
   router.post('/newsImage',auth,uploads.single('image'),async(req,res)=>{
    try{
        const news = new News({...req.body,owner:req.reporter._id})
        news.image = req.file.buffer
        await news.save()
        res.status(200).send(news)
    
    }
    catch(e){
        res.status(400).send(e.message)
    }
})
//////////////////////////////////////////////////////////////////////////////
// router.post('/newsImage/:id',auth,uploads.single('image'),async(req,res)=>{
//     try{
        
//         const id = req.params.id
//         const news = await News.findById(id)
//          if(!news){
//           return res.status(404).send('Unable to find news')
//         }
//         req.news.image = req.file.buffer
//         await req.news.save()
//         res.send()
//     }
//     catch(e){
//         res.status(400).send(e.message)
//     }
// })
///////////////////////////////////////////////////////////////////////
// router.post('/newsImage/:id',auth,uploads.single('image'),async(req,res)=>{
//     try{
        
//         const _id = req.params.id
//         const news = await News.findOne({_id,owner:req.reporter._id})
//         if(!news){
//             return res.status(404).send('no News is found to add image')
//         }
       
//         await news.populate('owner')
//         req.news.image = req.file.buffer
//         await req.news.save()
//         res.send()
//         // res.send(news.avatar)
//     }
//     catch(e){
//         res.status(400).send(e.message)
//     }
// })

///////////////////////////////////////////////////////////////////////


module.exports = router