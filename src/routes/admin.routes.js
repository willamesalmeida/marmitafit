const express = require("express")

const AdminOrderController = require("../controllers/adminOrder.controller");

const { verifyTokenMiddleware, authIsAdminMiddleware } = require("../middlewares/authIsAdmin.middleware")

const router = express.Router()

router.get("/admin/orders", verifyTokenMiddleware, authIsAdminMiddleware, AdminOrderController.listAllOrders)

module.exports = router