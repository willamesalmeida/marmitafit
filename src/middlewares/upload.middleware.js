const multer = require("multer");
const path = require("path");

//upload destination configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); //  defines a unique name for each uploaded file
  },
});

// Configure the filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  }else {
    cb(new Error("Invalid file format. Only PNG or JPG images are allowed."), false)
  }
};

const upload = multer({storage, fileFilter})
module.exports = upload;