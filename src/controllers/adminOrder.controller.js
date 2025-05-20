const OrderService = require("../services/order.service");

class AdminOrderController {
  static async listAllOrders(req, res, next) {
    try {
      const filter = req.query || {};

      /*const orders = Object.keys(filter).length === 0 
      ? await OrderService.getAllOrders() 
      : await OrderService.getFilteredOrders(filter)

      res.status(200).json({ orders }); */

      const orders = await OrderService.getFilteredOrders(filter);
      res.status(200).json({
        orders
      }) 
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminOrderController;
