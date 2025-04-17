const express = require("express");
const ProductController = require("../controllers/product.controller")
const upload = require("../middlewares/upload.middleware")
const  {authIsAdminMiddleware, verifyTokenMiddleware} = require("../middlewares/authIsAdmin.middleware")


const router = express.Router();


router.post("/products-register",authIsAdminMiddleware, upload.single('imageUrl'), ProductController.createProduct);

router.delete("/products/:id", authIsAdminMiddleware, ProductController.deleteProduct) //protect router for delete product

router.get("/products", verifyTokenMiddleware, ProductController.getAllProducts)

module.exports = router;