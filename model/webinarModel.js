const mongoose=require('mongoose')


const webinarModel= new mongoose.Schema({
    webinarTitle:{
        type:String
    },
    webinarDescription:{
        type:String
    },
    orgName:{
        type:String
    },
   createdDate:{
    type:Date,
    default:Date.now()
    },
    updatedDate:{
    type:Date,
    default:Date.now()
    },
     webinarId:{
        type:Number
     },
     userId:{
          type:String,
          required:true
     },
     userType:{
     type:String,
    },
    details:{
     type:Object
    },
     state:{
        type:String
     },
     district:{
        type:String
     },
     city:{
     type:String
     },
   isActive:{
    type:Boolean,
    default:true}
});
module.exports=mongoose.model('webinar',webinarModel)
