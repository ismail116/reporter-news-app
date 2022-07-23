const mongoose = require('mongoose')

const newsSchema = mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true,
        minLength:10,
    },
    title:{
        type:String,
        required:true,
        trim:true,
        
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Reporter'
    },

    avatar:{
        type:Buffer
    }

}, 
{ timestamps: true })

const News = mongoose.model('News',newsSchema)
///////////////////////////////////////////////////////////////////
module.exports = News