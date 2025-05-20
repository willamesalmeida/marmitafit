const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const AppError = require("../utils/errorHandler.util");

class OrderService {
  // Creates a user-conditioned order
  static async createOrder(userId, items) {
    try {
      //verify if item if pass theougt de function params
      if (!userId || !items || items.length === 0) {
        throw new AppError("User ID is required to create an order", 400);
      }

      // Validates items and calculates total price (if necessary)
      const orderItems = [];
      for (const item of items) {
        // veirfy if product exist in databases
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        //verifyu if product return the products thats coming from request
        if (!product) {
          throw new AppError(
            `Product with ID ${item.productId} not found!`,
            404
          );
        }

        //add validate items on the list
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Creates the order with default status "pending"
      const order = await prisma.order.create({
        data: {
          userId,
          OrderItem: {
            create: orderItems,
          },
        },
        include: { OrderItem: { include: { product: true } } },
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
          OrderItem: { include: { product: true } }, // inclue items em product associeted
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new AppError(error.message || "Error fetching orders!", 500);
    }
  }

  static async updateOrderStatus(orderId, newStatus) {
    const allowedStatuses = [
      "PENDING",
      "IN_PREPARATION",
      "READY_FOR_DELIVERY",
      "ON_THE_WAY",
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

    if (!currentOrder.status) {
      throw new AppError("Order status is undefined", 400);
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

    const currentStatus = currentOrder.status.toUpperCase();
    // Verifica se a transição a partir do status atual para o novo status é permitida
    if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
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
      include: { OrderItem: { include: { product: true } } },
    });
    return order;
  }

  static async getAllOrders() {
    try {
      const orders = await prisma.order.findMany({
        include: {
          OrderItem: { include: { product: true } },
          user: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return orders;
    } catch (error) {
      throw new AppError(error.message || "Error fetching all Orders", 500);
    }
  }

  // captures orders through filters
  static async getFilteredOrders(filter) {
    /* 
    This filter comes from within the url on the endpoint   
    
    Ex:
      http://localhost:3333/admin/orders?status=in_preparation
    Ex:
      http://localhost:3333/admin/orders?userId=3232965
    Ex: 
      http://localhost:3333/admin/orders?startDate=2025-05-01&endDate=2025-05-31
    Ex: 
      http://localhost:3333/admin/orders?status=pending&startDate=2025-05-01&endDate=2025-05-31 
      
      
    Ex. using pagination
      http://localhost:3333/admin/orders?page=1&limit=10&startDate=2025-05-01&endDate=2025-05-31
      */

    try {
      // creates an object to store the filtering conditions
      const whereConditions = {};

      // filter by status (PENDING, IN_PREPARATION..)
      if (filter.status) {
        whereConditions.status = filter.status.toUpperCase();
      }

      // filter by user ID if provided
      if (filter.userId) {
        whereConditions.userId = filter.userId;
      }

      // Filter by dates: startDate and endDate for the createdAt field
      if (filter.startDate || filter.endDate) {
        whereConditions.createdAt = {};
        if (filter.startDate) {
          whereConditions.createdAt.gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
          whereConditions.createdAt.lte = new Date(filter.endDate);
        }
      }
      //parameters to pagination: page and limit
      const page = filter.page ? Number(filter.page) : 1;
      const limit = filter.limit ? Number(filter.limit) : 10;
      const skip = (page - 1) * limit;

      const totalOrders = await prisma.order.count({
        where: whereConditions,
      });

      const orders = await prisma.order.findMany({
        where: whereConditions,
        include: {
          OrderItem: { include: { product: true } },
          user: true,
        },
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
      });

      return {
        orders,
        pagination: {
          page,
          limit,
          totalOrders,
          totalPages: Math.ceil(totalOrders / limit),
        },
      };
    } catch (error) {
      throw new AppError(
        error.message || "Error fetching filtered orders",
        500
      );
    }
  }
}

module.exports = OrderService;
