const CartService = require("../services/cart.service");
const AppError = require("../utils/errorHandler.util");

class CartController {
  //retrieves the user's current cart
  static async getCart(req, res, next) {
    try {
      // captures the userId from the request user
      const userId = req.user.userId;

      //capture cart from userid
      const cart = await CartService.getCartByUser(userId);

      res.status(200).json({ cart });
    } catch (error) {
      next(error);
    }
  }
  //add an item to cart
  static async addItem(req, res, next) {
    try {
      // captures the userid added to the request by the authentication middleware
      const userId = req.user.userId;

      //capture the productId and quantity from the request body
      const { productId, quantity } = req.body;

      //if neither quantity nor productid exist it throws an error
      if (!productId || !quantity) {
        throw new AppError("The product ID and quantity is required!", 400);
      }

      //create the new item passing the userId, productId and quantity
      const item = await CartService.addItemToCart(userId, productId, quantity);

      res.status(201).json({
        message: "The item has been successfully added to the cart!",
        item,
      });
    } catch (error) {
      next(error);
    }
  }

  //updates the quantity of an item in the cart
  static async updateItem(req, res, next) {
    try {
      const userId = req.user.userId;
      const { itemId } = req.params; //captures the item ID that comes from the request parameters
      
      const { quantity } = req.body;

      if (!quantity) {
        throw new AppError("The quantity is mandatory!", 400);
      }

      const updateItem = await CartService.updateCartItem(
        userId,
        itemId,
        quantity
      );

      res
        .status(200)
        .json({
          message: "Cart item has been updated successfully!",
          updateItem,
        });
    } catch (error) {
      next(error);
    }
  }

  //remove the item on cart
  static async removeItem(req, res, next) {
    try {
      const userId = req.user.userId;

      const { itemId } = req.params;

      const result = await CartService.removeCartItem(userId, itemId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  //checkout the cart by converting it into an order
  static async checkout(req, res, next) {
    try {
      const userId = req.user.userId;

      const order = await CartService.checkoutCart(userId);

      res.status(200).json({
        message: "Checkout successful!",
        order,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CartController;
