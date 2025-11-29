// const multer=require('multer');
// const path=require('path')
// const fs=require('fs')

// const profileDir = 'ProfilePictures';
// if (!fs.existsSync(profileDir)) {
//   fs.mkdirSync(profileDir, { recursive: true });
// }
// const uploadDirs = {
//   profileImage: 'ProfilePictures',
//   certificates: 'Certificates'
// };

// // Ensure directories exist
// Object.values(uploadDirs).forEach(dir => {
//   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
// });
// const storage=multer.diskStorage({
//     destination:(req,file,cb)=>{
//      const folder =
//       file.fieldname === "profileImage" ? "ProfilePictures" : "Certificates";
//     cb(null, folder);          cb(null,folder);
//     },
//     filename:(req,file,cb)=>{
//         //const userId=req.query.userId;
//             const userId = req.query.userId || Date.now(); 
//         console.log(userId+"userid")
//         cb(null,userId+path.extname(file.originalname))
//     }
// })

// const upload=multer({
//     storage,
//      limits: { fileSize: 5 * 1024 * 1024 }, 

// });
// module.exports=upload;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Directories
const uploadDirs = {
  profileImage: 'ProfilePictures',
  certificates: 'Certificates'
};

// Ensure directories exist
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'image' ? uploadDirs.profileImage : uploadDirs.certificates;
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    console.log(`path${req.body.userId}`)
    const userId = req.body.userId || Date.now();
    cb(null, `${userId}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

module.exports = upload;
