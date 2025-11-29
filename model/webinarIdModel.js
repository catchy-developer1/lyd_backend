const mongoose=require('mongoose')

const  webinarIdModel=mongoose.Schema({
   id:{
    type:String
   },
   webinarId:{
    type:Number
   } 
})

module.exports=mongoose.model('webinarId',webinarIdModel)