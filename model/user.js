const mongoose=require('mongoose')

const userModel=new mongoose.Schema({
    userId:{
        type:String,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    martialStatus:{
        type:String,
        required:true
    },
     dob:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        required:true
    },
    description:{
      type:String
    },
     password: {
        type: String,
        required: true
    },
    address: {
        // state: String,
        // district: String,
        //  city: String,
        // pincode: String
    },
    details:{
   
   },
    mobileNumber:{
        type:String,
        required:true
    },
   email:{
    type:String,
    required:true
    },
    location:{
    type:String
  },
    image:[{
    type:String
  }],
    certificates: [{ type: String }], 
    isAdmin:[{type:String}],
  isActive:{
    type:Boolean,
    default:true
  },
  createdDate:{
    type:Date,
    default:Date.now()
  },
  updatedDate:{
    type:Date,
    default:Date.now()
  },
  

})

module.exports=mongoose.model('user',userModel)