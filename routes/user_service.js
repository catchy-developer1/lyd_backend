const express=require('express');
const router=express.Router()
const serviceController=require('../controller/serviceController')
const upload=require('../file_uploadImage')

router.post('/create_service',upload.array('image',3), serviceController.createServices)
router.post('/deactivate_services',serviceController.deactivateServices)
router.post('/get_service_list',serviceController.getServicesList)
router.post('/get_service_listById',serviceController.getServicesById)


module.exports=router