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
    image:{
        type:Buffer
    }

}, 
{ timestamps: true })

const News = mongoose.model('News',newsSchema)
///////////////////////////////////////////////////////////////////

newsSchema.methods.toJSON = function(){
    
    const news = this

    // toObject --> convert document --> object
    const newsObject = news.toObject()

    return newsObject
}
///////////////////////////////////////////////////////////////////
module.exports = News