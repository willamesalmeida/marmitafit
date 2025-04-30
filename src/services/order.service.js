const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const AppError = require("../utils/errorHandler.util");

class OrderService {
  // Creates a user-conditioned order
  static async createOrder(userId, item) {
    try {
      //verify if item if pass theougt de function params
      if (!userId || !item || item.length === 0) {
        throw new AppError("User ID is required to create an order", 400);
      }

      // Validates items and calculates total price (if necessary)
      const orderItems = [];
      for (const item of items) {
        // veirfy if product exist in databases
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new AppError(
            `Product with ID ${item.productId} not found!`,
            404
          );
        }
      }

      //add validate items on the list
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Creates the order with default status "pending"
      const order = await prisma.order.create({
        data: {
          userId,
          orderItem: {
            create: orderItems,
          },
        },
        includes: { orderItem: { include: { product: true } } },
      });
      return order;
    } catch (error) {
      throw new AppError(error.message || "Error creating order!", 500);
    }
  }
  // Recupera os pedidos do usuário autenticado
  static async getOrderByUser(userId) {
    try {
      return await prisma.order.findMany({
        where: { userId },
        include: {
          orderItem: { include: { product: true } }, // inclue items em product associeted
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new AppError(error.message || "Error fetching orders!", 500);
    }
  }

  static async updateOderStatus(orderId, newStatus) {
    const allowedStatuses = [
      "PENDING",
      "IN_PREPARATION",
      "ON_THE_WAY",
      "READY_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ];

    //verify if a new status e an one of allowed
    if (!allowedStatuses.includes(newStatus)) {
      throw new AppError("Invalid order status", 400);
    }

    // Search for the current order to find out its status
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!currentOrder) {
      throw new AppError("Order not found!", 404);
    }

    // Define the transition rules: for each status, which statuses are allowed for transition
    const allowedTransitions = {
      PENDING: ["IN_PREPARATION", "CANCELLED"],
      IN_PREPARATION: ["READY_FOR_DELIVERY", "CANCELLED"],
      READY_FOR_DELIVERY: ["ON_THE_WAY", "CANCELLED"],
      ON_THE_WAY: ["DELIVERED", "CANCELLED"],
      DELIVERED: [],
      CANCELLED: [],
    };
    // Verifica se a transição a partir do status atual para o novo status é permitida
    if (!allowedTransitions[currentOrder.status].includes(newStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentOrder.status} to ${newStatus}`,
        400
      );
    }

    // If the checks pass, update the order in the database
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
      },
      include: { orderItem: { include: { product: true } } },
    });
    return order;
  }
}

module.exports = OrderService;
