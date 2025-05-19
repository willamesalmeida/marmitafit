const OrderService = require("../services/order.service");
const AppError = require("../utils/errorHandler.util");

class OrderController {
  static async createOrder(req, res, next) {
    try {
      const userId = req.user.userId;

      const { items } = req.body;

      if (!items || items.length === 0) {
        throw new AppError("Order must include at least one item!");
      }
      const order = await OrderService.createOrder(userId, items);
      res.status(201).json({
        message: "Order Created successfully!",
        order,
      });
    } catch (error) {
      next(error);
    }
  }
  static async getOrder(req, res, next) {
    try {
      const userId = req.user.userId;
      const orders = await OrderService.getOrderByUser(userId);
      res.status(200).json({ orders });
    } catch (error) {
      next(error);
    }
  }
  static async updateOrderStatus(req, res, next) {
    try {
      // Extracts the order ID and new status from the request body.
      const { orderId, newStatus } = req.body;

      // Checks if both are provided.
      if (!orderId || !newStatus) {
        throw new AppError("Order ID and new status are required!", 400);
      }
      // Calls the service method that updates the status.
      const order = await OrderService.updateOrderStatus(orderId, newStatus);
      // Returns the response with the updated request.
      res.status(200).json({
        message: "Order status updated succefully",
        order,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = OrderController;
