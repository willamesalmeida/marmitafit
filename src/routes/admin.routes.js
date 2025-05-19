const express = require("express")

const AdminOrderController = require("../controllers/adminOrder.controller");

const { verifyTokenMiddleware, authIsAdminMiddleware } = require("../middlewares/authIsAdmin.middleware")

const router = express.Router()

router.get("/admin/order", verifyTokenMiddleware, authIsAdminMiddleware, AdminOrderController.listAllOrders)

module.exports = router