const express=require('express');
const router=express.Router();
const userController=require('../controller/userController')
const upload=require('../file_uploadImage')
const auth=require('../middleware/auth')

router.post('/get_user_details',auth,userController.getAllUserDetails)
// router.post('/user_register',upload.array('profileImage',5),userController.userRegister)
router.post('/user_register',  upload.fields([{ name: 'image', maxCount: 3 },
                               {name: 'certificates', maxCount: 3 } ]), userController.userRegister);
router.post('/login_user',userController.loginUser)
router.post('/get_user_byId',auth,userController.getUserbyId)
router.post("/upload_profileImage",upload.single('profileImages'),userController.uploadProfileImage)
router.post("/deactivate_user",auth,userController.deactivateUser)

module.exports=router;