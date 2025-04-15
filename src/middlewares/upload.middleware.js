const multer = require("multer");
const path = require("path");

//upload destination configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/") //cb(null, path.join(__dirname, "src/uploads/"));
  },
  filename: (req, file, cb) => {
    const fileOriginalName = file.originalname.split('.')[0]
    cb(null, Date.now() + ' - ' + fileOriginalName + path.extname(file.originalname)); //  defines a unique name for each uploaded file
  },
});

// Configure the filter to accept only images
const fileFilter = (req, file, cb) => {
  
  const allowedMimeTypes = /jpeg|jpg|png/
  
  const extname= allowedMimeTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedMimeTypes.test(file.mimetype)
  
  if (extname &&  mimetype) {
    return cb(null, true);
    
  } else {
    cb(new Error("Invalid file format. Only PNG or JPG images are allowed."), false)
  }
  
  /*
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }else {
    cb(new Error("Invalid file format. Only PNG or JPG images are allowed."), false)
  } */

};

const upload = multer({storage, fileFilter})
module.exports = upload;