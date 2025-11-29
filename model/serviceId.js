const mongoose=require('mongoose')

const serviceIds=new mongoose.Schema({
    id:{type:String},
    serviceId:{type:Number}
})

module.exports=mongoose.model('serviceId',serviceIds)