const express=require('express')
const serviceModel=require('../model/serviceModel')
const serviceIdModel=require('../model/serviceId');
const serviceId = require('../model/serviceId');

 exports.createServices= async (req,res)=>{
    const{serviceTitle,serviceDescription,serviceCost,userType,image,userId,serviceId}=req.body;
    try{
    if(!serviceTitle||!serviceDescription||!serviceCost||!userType||!userId||!serviceId){
    return res.json({status:"error",message:"missing field"})
    }
    if(serviceId==0){
    const newServiceId = await serviceIdModel.findOneAndUpdate({ id: 'serviceId' }, { $inc: { serviceId: 1 } }, { upsert: true, new: true });
    console.log(newServiceId.serviceId)
    const service= new serviceModel({serviceTitle,serviceDescription,serviceCost,userType,image,userId,serviceId:newServiceId.serviceId})
    const addServices=await service.save();
   return  res.send({status:"Success",message:"service created successfully",data:addServices})
    }
   else{
    let services= await serviceModel.find({serviceId:serviceId},{isActive:true})
    if(services.length===0){
      return  res.send({status:"error",message:"data not found"})
    }
    const updateFields = {};
        if (serviceTitle) updateFields.serviceTitle = serviceTitle;
        if (serviceDescription) updateFields.serviceDescription = serviceDescription;
        if (userType) updateFields.userType = userType;
        if (serviceCost) updateFields.serviceCost = serviceCost;
        if (image) updateFields.image = image;
        if (serviceId) updateFields.serviceId = serviceId;
        updateFields.image = image;
        updateFields.updatedDate=Date.now()
    const updatedServices = await serviceModel.findOneAndUpdate({ serviceId }, { $set: updateFields }, { new: true });
    return    res.send({status:"Success",data:updatedServices})
    
   }}
   catch(error){
   return res.send({status:"error",message:error.message})
    }
 }

 exports.deactivateServices=async(req,res)=>{
 const{serviceId}=req.body;
 try{
 const deactivateService= await serviceModel.findOneAndUpdate({serviceId:serviceId},{isActive:false})
 if(deactivateService.length===0){
    res.send({status:"error",message:"data not found"})
 }
 res.send({status:"success",message:"deactivate successfully"})
 }
 catch(error){
 res.send({status:"error",message:"does not deactivated "})
 }
 }

exports.getServicesList=async(req,res)=>{
const{userId}=req.body;
try{
const getServiceList=await serviceModel.find({$and:[{userId:userId},{isActive:true}]})
if(getServiceList.length===0){
    res.json({status:"error",message:"data not found"})
}
else{
 res.json({status:"success",data:getServiceList})
}
}
catch(error){
res.send({Status:"success",message:error.message})
}
}

exports.getServicesById=async(req,res)=>{
const{userId,serviceId}=req.body;
try{
    if(!userId||!serviceId){
    res.send({status:"error",message:"missing field"})
    }
  const getServiceList=await serviceModel.find({userId,serviceId,isActive:true})
  if(getServiceList.length===0){
    res.json({status:"error",message:"data not found"})
  }
  else{
    res.json({status:"success",data:getServiceList})
 }
 }
catch(error){
res.send({Status:"success",message:error.message})
}
}