const express = require('express')
const jobModel = require('../model/jobModel')
const jobIdModel = require('../model/jobIdModel')
const webinarModel = require('../model/webinarModel')
const userModel = require('../model/user')
const jobSeekerModel = require('../model/job_seeker_model')

exports.createEditJobs = async (req, res) => {
  const { jobTitle, jobDescription, jobType, orgName, salary, experience, userId, qualification, userType, jobId, state, district, city } = req.body;
  try {
    if (!jobTitle || !jobDescription || !jobType || !orgName || !salary || !qualification || !experience || !userId || !userType || !jobId || !state || !district || !city) {
      return res.send({ status: "error", message: "missing fields" })
    }
    if (jobId === 0 || jobId == "0") {
      const newJobId = await jobIdModel.findOneAndUpdate({ id: "jobId" }, { $inc: { jobId: 1 }, }, { upsert: true, new: true })
      console.log(`new job id${newJobId}`)
      const jobCreate = new jobModel({ jobTitle: jobTitle, jobDescription: jobDescription, jobType: jobType, orgName: orgName, salary: salary, qualification: qualification, experience: experience, userId: userId, userType: userType, state: state, district: district, city: city, jobId: newJobId.jobId })
      const saveJobs = await jobCreate.save();
      res.send({ status: "success", message: "Job Created Successfully", data: saveJobs })
    }
    else {
      const updateJobs = {};
      if (jobTitle) updateJobs.jobTitle = jobTitle;
      if (jobDescription) updateJobs.jobDescription = jobDescription;
      if (userId) updateJobs.userId = userId;
      if (userType) updateJobs.userType = userType;
      if (jobId) updateJobs.jobId = jobId;
      if (jobType) updateJobs.jobType = jobType;
      if (orgName) updateJobs.orgName = orgName;
      if (salary) updateJobs.salary = salary;
      if (qualification) updateJobs.qualification = qualification;
      if (experience) updateJobs.experience = experience;
      if (state) updateJobs.state = state;
      if (district) updateJobs.district = district;
      if (city) updateJobs.city = city;
      const jobCreate = await jobModel.findOneAndUpdate({ jobId: jobId }, { $set: updateJobs }, { new: true })
      if (!jobCreate) {
        return res.send({ status: "error", message: "no jobs found" })
      }
      else {
        return res.send({ status: "success", data: jobCreate })
      }
    }
  }
  catch (error) {
    res.send({ status: "error", message: `job not shown error ${error.message}` })
  }
}

exports.createEditWebinars = async (req, res) => {
  const { webinarTitle, webinarDescription, userId, userType, orgName, webinarId,details, state, district, city } = req.body;
  try {
    if (!webinarTitle || !webinarDescription || !userId || !userType || !orgName || !webinarId ||!details|| !state || !district || !city) {
      return res.send({ status: "error", message: "missing fields" })
    }
    if (webinarId === 0 || webinarId == "0") {
      const newwebinarId = await jobIdModel.findOneAndUpdate({ id1: "webinarId" }, { $inc: { webinarId: 1 }, }, { upsert: true, new: true })
      console.log(`new job id${newwebinarId}`)
      const jobCreate = new webinarModel({ webinarTitle: webinarTitle, webinarDescription: webinarDescription,orgName:orgName, userId: userId, userType: userType, orgName: orgName,details:details, state: state, district: district, city: city, webinarId: newwebinarId.webinarId })
      const saveJobs = await jobCreate.save();
      res.send({ status: "success", message: "Job Created Successfully", data: saveJobs })
    }
    else {
      const updateJobs = {};
      if (webinarTitle) updateJobs.webinarTitle = webinarTitle;
      if (webinarDescription) updateJobs.webinarDescription = webinarDescription;
      if (userId) updateJobs.userId = userId;
      if (userType) updateJobs.userType = userType;
      if (webinarId) updateJobs.webinarId = webinarId;
      if (orgName) updateJobs.orgName = orgName;
      if(details) updateJobs.details=details;
      if (state) updateJobs.state = state;
      if (district) updateJobs.district = district;
      if (city) updateJobs.city = city;
      const webinarCreate = await webinarModel.findOneAndUpdate({ webinarId: webinarId }, { $set: updateJobs }, { new: true })
      if (!webinarCreate) {
        return res.send({ status: "error", message: "no jobs found" })
      }
      else {
        return res.send({ status: "success", data: jobCreate })
      }
    }
  }
  catch (error) {
    res.send({ status: "error", message: `webinar not shown error ${error.message}` })
  }
}
exports.viewJobsAdminList = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId)
    // const userType=req.user.userType;
    if (!userId) {
      return res.send({ status: "error", message: "missing fields" })
    }
    const viewJobs = await jobModel.find({ userId: userId }).sort({ _id: -1 })
    if (viewJobs == 0) {
      return res.send({ status: "error", message: "no jobs found", data: viewJobs })
    }
    else {
      return res.send({ status: "Success", data: viewJobs })
    }
  }
  catch (err) {
    res.send({ status: "error", message: "can not view jobs" })
  }
}
exports.viewWebinarAdminList = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log(userId)
    // const userType=req.user.userType;
    if (!userId) {
      return res.send({ status: "error", message: "missing fields" })
    }
    const viewJobs = await webinarModel.find({ userId: userId }).sort({ _id: -1 })
    if (viewJobs == 0) {
      return res.send({ status: "error", message: "no jobs found", data: viewJobs })
    }
    else {
      return res.send({ status: "Success", data: viewJobs })
    }
  }
  catch (err) {
    res.send({ status: "error", message: "can not view jobs" })
  }
}
exports.viewJobSeekerList = async (req, res) => {
  try {
    const {search} = req.body;
    const userType = req.user.userType;

    if (!userType) {
      return res.send({ status: "error", message: "missing fields" });
    }

    const filter = { isActive: true };
    if (search && search.trim() !== "") {
      filter.$or = [
        { state: { $regex: search, $options: "i" } },
        { district: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
       { orgName: { $regex: search, $options: "i" } },
];
    }
   
    const viewJobs = await jobModel.aggregate([
  { $match: filter },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "userId",
      as: "company",
    },
  },
  {
    $lookup: {
      from: "jobseekers",
      localField: "jobId",
      foreignField: "jobId",
      as: "applicants",
    },
  },
  {
    $unwind: { path: "$company", preserveNullAndEmptyArrays: true },
  },
  {
    $project: {
      _id: 1,
      jobTitle: 1,
      jobDescription: 1,
      orgName: 1,
      createdDate: 1,
      updatedDate: 1,
      jobType: 1,
      jobId: 1,
      userId: 1,
      salary: 1,
      experience: 1,
      userType: 1,
      state: 1,
      district: 1,
      city: 1,
      isViewed: 1,
      isActive: 1,
      qualification: 1,
      companyDescription: "$company.description",
      image: { $arrayElemAt: ["$company.image", 0] },
      totalApplicants: { $size: "$applicants" },
    },
  },
  {
    $sort: { id: -1 } 
  }
]);

    if (viewJobs.length === 0) {
      return res.send({ status: "error", message: "no jobs found" });
    }
  
    return res.send({ status: "success", data: viewJobs });

  } catch (err) {
    res.send({ status: "error", message: `can not view jobs ${err.message}` });
  }
};
exports.viewWebinarListJobseekers = async (req, res) => {
  try {
    const { state, district, city } = req.body;
    const userType = req.user.userType;

    if (!userType) {
      return res.send({ status: "error", message: "missing fields" });
    }

    const filter = { isActive: true };
    if (state) filter.state = { $regex: state, $options: "i" };
    if (district) filter.district = { $regex: district, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };

    const viewJobs = await webinarModel.find(filter);

    if (viewJobs.length === 0) {
      return res.send({ status: "error", message: "no jobs found" });
    }

    return res.send({ status: "success", data: viewJobs });

  } catch (err) {
    res.send({ status: "error", message: `can not view jobs ${err.message}` });
  }
};

// exports.viewJobSeekerList=async(req,res)=>{
// try{
//     const{state,district,city}=req.body;
//   //const userId=req.user.userId;
//   const userType=req.user.userType;
//   console.log(`${userType}`)
//   if(!userType){
//     return res.send({status:"error",message:"missing fields"})
//   }
//   const filter={userType,isActive:true}
//   if(state) filter.state=state;
//   if(district) filter.district=district;
//   if(city)city=filter.city=city;
//   const viewJobs= await jobModel.find(filter)

//   if(viewJobs==0){
//     return res.send({status:"error",message:"no jobs found"})
//   }
//   else{
//     return res.send({status:"Success",data:viewJobs})
//  }
// }
// catch(err){
// res.send({status:"error",message:`can not view jobs ${err.message}`})
// }
// }

exports.deactivateJobs = async (req, res) => {
  const { jobId } = req.body;
  try {
    const deactivateService = await jobModel.findOneAndUpdate({ jobId: jobId }, { isActive: false })
    if (deactivateService.length == 0) {
      res.send({ status: "error", message: "Job not found" })
    }
    res.send({ status: "success", message: "deactivate successfully" })
  }
  catch (error) {
    res.send({ status: "error", message: "not deactivated " })
  }
}

exports.applyJobs = async (req, res) => {
  const { jobId, jobSeekerId, userType } = req.body;
  try {
    if (!jobId || !jobSeekerId || !userType) {
      return res.send({ status: "error", message: "missing fields" })
    }
    // const newJobId= await jobIdModel.findOneAndUpdate({id:"jobId"},{$inc:{jobId:1},},{upsert:true,new:true})
    // console.log(`new job id${newJobId}`)
    const existingApplication = await jobSeekerModel.findOne({ jobId, jobSeekerId });

    if (existingApplication) {
      return res.send({ status: "error", message: "You have already applied for this job", alert: false });
    }

    const applyJobs = new jobSeekerModel({ jobId: jobId, jobSeekerId: jobSeekerId, userType: userType, })
    const saveJobs = await applyJobs.save();
    return res.send({ status: "success", message: "Job Created Successfully", data: saveJobs, alert: true })
  }
  catch (error) {
    res.send({ status: "error", message: `job not shown error ${error.message}` })
  }
}

exports.viewJobSeekerApplyList = async (req, res) => {
  try {
    const { jobSeekerId } = req.body;
    
if (!jobSeekerId) {
return res.send({ status: "error", message: "missing fields" })
}
const viewJobs = await jobSeekerModel.find({ jobSeekerId: jobSeekerId, }).sort({ _id: -1 })

if (viewJobs == 0) {
  return res.send({ status: "error", message: "no jobs found", data: viewJobs })
}
  else {
      const jobIds = viewJobs.map((job) => job.jobId);
      const jobs = await jobModel.find({ jobId: { $in: jobIds } }).sort({ _id: -1 });
      const appliedJobs = await Promise.all(jobs.map(async (job) => {
          const user = await userModel.findOne({ userId: job.userId });
          return {
            ...job.toObject(),
            companyDescription: user ? user.description || "" : "",
           image:user ? user.image || "" : ""
          };
        })
      );
    return res.send({ status: "Success", total: appliedJobs.length, data: appliedJobs });
    }
  }
  catch (err) {
    res.send({ status: "error", message: "can not view jobs list" })
  }
}

exports.getJobById = async (req, res) => {
  const { jobId, isActive } = req.body;
  try {
    const getJobDetails = await jobModel.find({ jobId: jobId, isActive: isActive }).lean()
    if (getJobDetails.length == 0) {
      res.send({ status: "error", message: "Job not found" })
    }
    res.send({ status: "success", data: getJobDetails })
  }
  catch (error) {
    res.send({ status: "error", message: "not found job" })
  }
}