const OrderService = require("../services/order.service")

class AdminOrderController {
  static async listAllOrders(req, res, next){
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json({
        orders
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AdminOrderController;