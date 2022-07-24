const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true 
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true ,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error ('Email is invalid')
            }
        }
    },
    age:{
        type:Number,
        default:25,
        validate(value){
            if((value < 0))
            {
                throw new Error ('Age should be positive Number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value){
            let strongPassword =  new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            
            if(!strongPassword.test(value))
            {
                throw new Error ('Password Should Include ....')
            }
        }
    },
    phone:{
        type:String ,
        required:true,
        trim:true,
        minLength:11,
        validate(value){
            let phoneNr =  new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}$/);

            if(!phoneNr.test(value))
            {
                throw new Error ('Phone Number is Incorrect.')
            }
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }

})

/////////////////////////////////////////////////////////////////////

// virtual relation

reporterSchema.virtual("news",{
    ref:'News',
    localField:'_id',
    foreignField:'owner'
})
/////////////////////////////////////////////////////////////////////
//login

reporterSchema.statics.findByCredentials = async(email,password)=>{

//first step
const reporter = await Reporter.findOne({email})
console.log(reporter)

if(!reporter){
    throw new Error ('Please Check Email or password')
}


//second Step

const isMatch = await bcryptjs.compare(password,reporter.password)

if(!isMatch){
     throw new Error ('Please Check Email or password')
}
return reporter

}
///////////////////////////////////////////////////////////////////
//password

//before save data --> hash Password

reporterSchema.pre('save',async function(){

       const reporter = this

    //Before Hash
    // console.log(reporter)

    if(reporter.isModified('password'))
    reporter.password= await bcryptjs.hash(reporter.password,8)

    //After Hashed
    // console.log(password)
})
///////////////////////////////////////////////////////////////////
// token

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},JWT_SECERT)
   
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

///////////////////////////////////////////////////////////////////

// sensitive data

reporterSchema.methods.toJSON = function(){
    const reporter = this
    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens

    return reporterObject

}
////////////////////////////////////////////////////////////////////

const Reporter = mongoose.model('Reporter',reporterSchema)

module.exports = Reporter