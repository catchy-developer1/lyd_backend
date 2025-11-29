const express=require('express');
const app=express();
const router=express.Router();
const jobController=require('../controller/jobController')
router.use(express.json()); 
const auth=require('../middleware/auth')

router.post('/createJobAdmin',jobController.createEditJobs)
router.get('/viewJobsAdminList',auth,jobController.viewJobsAdminList)
router.post('/viewJobSeekerList',auth,jobController.viewJobSeekerList)
router.post('/deactivate_job',jobController.deactivateJobs)
router.post('/createWebinarAdmin',jobController.createEditWebinars)
router.get('/viewWebinarListJobseekers',auth,jobController.viewWebinarListJobseekers)
router.get('/viewWebinarAdminList',auth,jobController.viewWebinarAdminList)
router.post('/applyJobs_JobSeekers',auth,jobController.applyJobs)
router.post('/JobSeekers_apply_jobList',auth,jobController.viewJobSeekerApplyList)
router.post('/getJobById',auth,jobController.getJobById)

//router.post('/viewJobSeekerList',auth,jobController.viewJobSeekerList)
//router.post('/deactivate_job',jobController.deactivateJobs)

module.exports=router;