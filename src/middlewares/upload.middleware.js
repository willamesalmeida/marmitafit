const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
//storage config on cloudnary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folderName = "uploads";

    if (req.route.path.includes("/users/profile")) {
      folderName = "profile_images";
    } else if (req.route.path.includes("/products")) {
      folderName = "product_images";
    }

    return {
      folder: folderName,
      allowedFormats: ["jpeg", "png", "jpg"],
      transformation: [{width: 500, height:500, crop:"limit"}],
      // public_id: `${Date.now()}-${file.originalname},`
    }
    
  },

  /* 
  cloudinary, 
  params: {
    folder: "uploads", //make a directory in cloudinary
    allowedFormats: ['jpeg', 'png', 'jpg'], //accpeted the only photo types jpeg jpg and png
    transfomation: [{width:500, height: 500, crop: 'limit'}] //Resizes to a maximum of 500x500
  } */
});

const upload = multer({ storage });

module.exports = upload;
