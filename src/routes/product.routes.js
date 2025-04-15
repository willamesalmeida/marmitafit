const express = require("express");
const ProductController = require("../controllers/product.controller")
const upload = require("../middlewares/upload.middleware")
const authIsAdminMiddleware = require("../middlewares/authIsAdmin.middleware")

const router = express.Router();


router.post("/products-register",authIsAdminMiddleware, upload.single('imageUrl'), ProductController.createProduct);

module.exports = router;