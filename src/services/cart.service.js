const { PrismaClient } = require("@prisma/client");

const AppError = require("../utils/errorHandler.util");

const OrderService = require("./order.service");

const prisma = new PrismaClient();

class CartService {
  //Recupera o carrinho do usuário ou cria um novo se não existir
  static async getCartByUser(userId) {
    //Search the database to see if there is a cart for this user
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    //If the user's cart does not exist, create a new cart for the user
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
      cart = await prisma.cart.findUnique({
        where: { userId },
        include: { include: { product: true } },
      });
    }
    //Return the user cart created
    return cart;
  }
  //add an item to the user's cart
  static async addItemToCart(userId, productId, quantity) {
    //Verify the quantity
    if (quantity <= 0) {
      throw new AppError(
        "Invalid quantity, quantity must be greater than zero!",
        400
      );
    }
    //search the user's cart in the database
    const cart = await CartService.getCartByUser(userId);

    //search the database for user items
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    //If there is an item in the cart, update with the new quantity
    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      return updatedItem;

    } else {
      //if there is no item in the cart, create a new item in the cart
      const newItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: { product: true },
      });
      //return the new item in the user's cart
      return newItem;
    }
  }

  //updates the item already existing in the user's cart
  static async updateCartItem(userId, cartItemId, newQuantity) {
    //The new item quantity must to be at least one
    if (newQuantity < 1) {
      throw new AppError("The quantity must be at least one!", 400);
    }
    
    //Search for the cart using the user ID
    const cart = await CartService.getCartByUser(userId);

    //search for item in cart using itme ID
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    //check if the item exists in the cartItem table and if the ID of that product is different from the ID of the product in the cart table of the database.
    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new AppError("Item not found in your cart!", 400);
    }
    //updates item in cartItem table of the database
    const updatedItem = await prism.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQuantity },
    });

    return updatedItem;
  }
  

  static async removeCartItem(userId, cartItemId) {
    const cart = await CartService.getCartByUser(userId);

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      throw new AppError("Item not found in your cart!", 400);
    }

    await prisma.cartItem.delete({ where: { id: cartItemId } });
    return { message: "Item successfully removed from your cart!" };
  }

  static async checkoutCart(userId) {
    const cart = await CartService.getCartByUser(userId);

    if (cart.items.length == 0) {
      throw new AppError("Cart is empty!", 400);
    }

    const orderItems = cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));

    const order = await OrderService.createOrder(userId, orderItems);

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }
}

module.exports = CartService;
