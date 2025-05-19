const express = require("express")

const CartController = require("../controllers/cart.controller")

const { verifyTokenMiddleware } = require("../middlewares/authIsAdmin.middleware")

const router = express.Router()

router.get("/cart", verifyTokenMiddleware, CartController.getCart)
router.post("/cart", verifyTokenMiddleware, CartController.addItem)
router.put("/cart/:itemId", verifyTokenMiddleware, CartController.updateItem)
router.delete("/cart/:itemId", verifyTokenMiddleware, CartController.removeItem)
router.post("/cart/checkout", verifyTokenMiddleware, CartController.checkout)

module.exports = router;