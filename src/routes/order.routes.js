const express = require("express");
const OrderController = require("../controllers/order.controller.js");

const {
  authIsAdminMiddleware,
  verifyTokenMiddleware,
} = require("../middlewares/authIsAdmin.middleware.js");

const router = express.Router();
// The POST route creates a request. It is protected by middleware to checkwhether the user is authenticated (the middleware injects req.user with the userId).

router.post("/orders", verifyTokenMiddleware, OrderController.createOrder);

// A rota GET lista os pedidos do usuário autenticado
router.get("/orders", verifyTokenMiddleware, OrderController.getOrder);

// route to update order status
router.patch(
  "/orders/status",
  verifyTokenMiddleware,
  authIsAdminMiddleware,
  OrderController.updateOrderStatus
);

module.exports = router;
