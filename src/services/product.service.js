const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient();

class productService {
  static async createProduct(name, description, price, imageUrl){
    return await prisma.product.create({
      data: {name, description, price, imageUrl},
    })
  }
}

module.exports = productService;