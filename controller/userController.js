const express=require('express');
const userModel=require('../model/user');
const userIds=require('../model/userId')
const { error } = require('winston');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());
const fs=require('fs');
const path=require('path')
const authMiddle=require('../middleware/auth');
const { count } = require('console');
const secret = 'LYD2025';

exports.getAllUserDetails = async (req, res) => {
  try {
    const filters = req.body.filters || {};
let query = { isActive: true };
const search = req.body.search?.trim() || "";

// Search logic (case-insensitive)
if (search !== "") {
  const regex = { $regex: search, $options: "i" };
  query["$or"] = [
    { userId: regex },
    { name: regex },
    { userType: regex },
    { mobileNumber: regex },
    { email: regex },
    { "address.state": regex },
    { "address.district": regex },
    { "address.city": regex },
    { "details.name": regex },
  ];
}

// Apply filters regardless of login type
if (filters.state) query["address.state"] = filters.state;
if (filters.district) query["address.district"] = filters.district;
if (filters.city) query["address.city"] = filters.city;
if (filters.userType) {
  query["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
}

// Special logic for superAdmin/admin can remain if needed
// ...

const user = await userModel.find(query).sort({ _id: -1 });
if (!user.length) return res.send({ status: "error", message: "No data found" });
return res.json({ status: "Success", total: user.length, data: user });

//     const userType = req.user.userType;
//     console.log(`userType: ${userType}`);

//     const filters = req.body.filters || {};
//     let query = { isActive: true }; 
//     const search = req.body.search?.trim() || "";

//      if (search !== "") {
//       const regex = { $regex: search, $options: "i" };

//       query["$or"] = [
//         { userId: regex },
//         { name: regex },
//         { userType: regex },
//         { mobileNumber: regex },
//         { email: regex },
//         { "address.state": regex },
//         { "address.district": regex },
//         { "address.city": regex },
//         { "details.name": regex },
//       ];
//     }
//     if (userType === "superAdmin"&&Object.keys(filters).length ==0&&search==="") {
//       //const user = await userModel.find(query).sort({ _id: -1 });
//       const user = await userModel.find().sort({ _id: -1 });
//      if (!user.length) return res.send({ status: "error", message: "No data found" });
//       return res.json({ status: "Success",total:user.length, data: user });
//     }

//     if ((userType === "admin")||(filters!=null&&userType === "superAdmin")) {
//       if (filters.state) query["address.state"] = filters.state;
//       if (filters.district) query["address.district"] = filters.district;
//       if (filters.city) query["address.city"] = filters.city;
// if (filters.userType) {
//   query["userType"] = { $regex: `^${filters.userType.trim()}$`, $options: "i" };
// } 
//       const user = await userModel.find(query).sort({ _id: -1 });
//       if (!user.length) return res.send({ status: "error", message: "No data found" });
//       return res.json({ status: "Success", total:user.length,data: user });
//     }
//    if (userType !== "admin" && userType !== "superAdmin") {
//       query["userType"] = userType;
//     }
//     const user = await userModel.find(query).sort({ _id: -1 });
    // if (!user.length) return res.send({ status: "error", message: "No data found" });
    // return res.json({ status: "Success",total:user.length, data: user });

  } catch (error) {
    return res.json({ status: "error", message: error.message });
  }
};

  exports.userRegister = async (req, res) => {
  try {
  const { userId, name,dob,martialStatus, password, userType, email, mobileNumber, address, details,location } = req.body;
  let parsedAddress, parsedDetails;
    if (address) {
      try { parsedAddress = JSON.parse(address); } 
      catch { return res.json({ status: "error", message: "Address is not valid JSON" }); }
    }
    if (details) {
      try { parsedDetails = JSON.parse(details); } 
      catch { return res.json({ status: "error", message: "Details is not valid JSON" }); }
    }
    const images = req.files?.image || [];
    const certificates = req.files?.certificates || [];

    if (userId == 0) {
      if (!name || !dob|| !password || !userType ||!martialStatus|| !email || !mobileNumber || !parsedAddress || !parsedDetails)
        return res.json({ status: "error", message: "Missing fields" });

      if (images.length === 0) return res.json({ status: 'error', message: 'At least one profile image is required' });

      const duplicateUser = await userModel.find({ $or: [{ email }, { mobileNumber }] });
      if (duplicateUser.length > 0) return res.json({ status: "error", message: "User email or mobile number already exists" });

      const hashedPassword = await bcryptjs.hash(password, 10);
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);

      const counter = await userIds.findOneAndUpdate(
        { id: 'userId' }, { $inc: { userId: 1 } }, { upsert: true, new: true }
      );
      const newUserId = `LYD${counter.userId}`;

      const imagePaths = images.map(file => file.path);        
      const certificatePaths = certificates.map(file => file.path);

      const newUser = new userModel({
        userId: newUserId,
        name,dob, password: hashedPassword, userType, email, mobileNumber,martialStatus,
        address: parsedAddress, details: parsedDetails,
        image: imagePaths,
        certificates: certificatePaths
      });

      await newUser.save();
      return res.json({ status: "success", message: "User registered successfully", data: newUser });
    } else {
      const existingUser = await userModel.findOne({ userId });
      if (!existingUser) return res.json({ status: "error", message: "User not found" });

      let profileImages = existingUser.image || [];
      let certificatesArr = existingUser.certificates || [];

      if (images.length) profileImages.push(...images.map(f => f.path));
      if (certificates.length) certificatesArr.push(...certificates.map(f => f.path));

      const updateFields = {};
      if (name) updateFields.name = name;
      // if (username) updateFields.username = username;
     // if (password) updateFields.password = await bcryptjs.hash(password, 10);
      if (userType) updateFields.userType = userType;
      if (dob) updateFields.dob=dob;
      if (email) updateFields.email = email;
      if (location) updateFields.location = location;
      if(martialStatus)updateFields.martialStatus=martialStatus;
      if (mobileNumber) updateFields.mobileNumber = mobileNumber;
      if (parsedAddress) updateFields.address = parsedAddress;
      if (parsedDetails) updateFields.details = parsedDetails;
      updateFields.image = profileImages;
      updateFields.certificates = certificatesArr;
      updateFields.updatedDate = Date.now();

      const updatedUser = await userModel.findOneAndUpdate({ userId }, { $set: updateFields }, { new: true });
      return res.json({ status: "success", message: "User updated successfully", data: updatedUser });
    }

  } catch (error) {
    console.error(error);
    res.json({ status: "error", message: error.message });
  }
};

//   exports.userRegister = async (req, res) => {
//   try {
//     const { userId, name, username, password, userType, email, mobileNumber, address, details, images, certificates } = req.body;

//     let parsedAddress, parsedDetails;
//     if (address) {
//       try { parsedAddress = JSON.parse(address); } 
//       catch { return res.json({ status: "error", message: "Address is not valid JSON" }); }
//     }
//     if (details) {
//       try { parsedDetails = JSON.parse(details); } 
//       catch { return res.json({ status: "error", message: "Details is not valid JSON" }); }
//     }

//     if (userId == 0) {
//       if (!name || !username || !password || !userType || !email || !mobileNumber || !address || !details)
//         return res.json({ status: "error", message: "Missing fields" });

//       const duplicateUser = await userModel.find({ $or: [{ email }, { mobileNumber }] });
//       if (duplicateUser.length > 0) return res.json({ status: "error", message: "User email or mobile number already exists" });

//       const hashedPassword = await bcryptjs.hash(password, 10);

//       const counter = await userIds.findOneAndUpdate(
//         { id: 'userId' }, { $inc: { userId: 1 } }, { upsert: true, new: true }
//       );
//       const newUserId = `LYD${counter.userId}`;

//       const profileImagess = Array.isArray(images) ? images : [];
//       const certificatess = Array.isArray(certificates) ? certificates : [];

//       if (images.length === 0) return res.json({ status: 'error', message: 'At least one profile image is required' });

//       const newUser = new userModel({
//         userId: newUserId,
//         name, username, password: hashedPassword, userType, email, mobileNumber,
//         address: parsedAddress, details: parsedDetails,
//         image: profileImagess, certificates:certificatess
//       });

//       await newUser.save();
//       return res.json({ status: "success", message: "User registered successfully", data: newUser });
//     }
//   else{
//     const existingUser = await userModel.findOne({ userId });
// if (!existingUser) return res.json({ status: "error", message: "User not found" });

// let profileImages = existingUser.image || [];
// let certificatesArr = existingUser.certificates || [];

// // Append new images/certificates if provided
// if (Array.isArray(images)) profileImages.push(...images);
// if (Array.isArray(certificates)) certificatesArr.push(...certificates);

// const updateFields = {};
// if (name) updateFields.name = name;
// if (username) updateFields.username = username;
// if (password) updateFields.password = await bcryptjs.hash(password, 10);
// if (userType) updateFields.userType = userType;
// if (email) updateFields.email = email;
// if (mobileNumber) updateFields.mobileNumber = mobileNumber;
// if (parsedAddress) updateFields.address = parsedAddress;
// if (parsedDetails) updateFields.details = parsedDetails;

// // Set the updated arrays
// updateFields.image = profileImages;
// updateFields.certificates = certificatesArr;
// updateFields.updatedDate = Date.now();

// const updatedUser = await userModel.findOneAndUpdate(
//   { userId },
//   { $set: updateFields },
//   { new: true }
// );

// return res.json({ status: "success", message: "User updated successfully", data: updatedUser });

// }
//   } catch (error) {
//     console.error(error);
//     res.json({ status: "error", message: error.message });
//   }
// };



 exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email :email});

    if (!user) return res.json({ status: "error", message: 'User does not exist' });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) return res.json({ status: "error", message: 'Invalid password' });

    const token = jwt.sign(
      { userId: user.userId, userName: user.name, userType: user.userType },
      secret,
      { expiresIn: '1h' }
    );
   res.json({ status: 'success', authToken: `${token}`, data: user });
   } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
   }
  };

exports.getUserbyId=async(req,res)=>{
  const{userId}=req.body;
try{

const user= await userModel.findOne({userId:userId,isActive:true});
if(user.length==0){
 return res.json({status:"error",data:user})
}
else{
return res.json({status:"Success",data:user})
}
}
catch(error){
return res.json({status:"error",message:error.message})
}
}


 exports.uploadProfileImage=async(req,res)=>{
 const {userId}=req.body;
  try{
    if(!req.file){
        res.status({status:"error",message:"Image is not Uploaded"})
    }
     if(!userId){
        res.status({status:"error",message:"User Id is not found"})
    }
    const oldPath=`${req.file.path}`;
    const newPath=`${req.body.userId}${path.extname(req.file.originalname)}`;
    const newPathName=path.join('ProfilePictures',newPath)
    fs.renameSync(oldPath,newPathName)
    res.json({
    status:"success",
    message:"File uploaded Successfully",
    imagePath:newPathName
  });
  }
  catch(error){
    res.send({status:"error","message":error.message})
  }
}

  exports.deactivateUser=async(req,res)=>{
   //const{userId}=req.body;
    try{
      const userId=req.user.userId;
       const deactivateService= await userModel.findOne({userId:userId},{isActive:false})
       if(deactivateService.length<0){
        res.send({status:"error",message:"user not found"})
       }
       res.send({status:"success",message:"deactivate successfully"})
    }
    catch(error){
     res.send({status:"error",message:"not deactivated "})
    }
}