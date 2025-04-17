const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");

const prisma = new PrismaClient();

class productService {
  static async createProduct(name, description, price, imageUrl, publicId) {
    return await prisma.product.create({
      data: { name, description, price, imageUrl, publicId },
    });
  }
  static async deleteProduct(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });
    console.log('product: ', product)
    try {
      if (!product) throw new Error( "The product you are trying to delete was not found in the database!");
            
    } catch (error) {
      return { error: "product not found!", details: error.message}
    }

    //Delete the image on cloudinary before remove product on database
    if (product.publicId) {
      // example of how to handle the lines of code that request the database. Using try catch

      await cloudinary.uploader.destroy(product.publicId);

      /*   try {
        await cloudinary.uploader.destroy(product.publicId)
      } catch (error) {
        console.log("erro", error)
      } */
    }

    return await prisma.product
      .delete({ where: { id: Number(id) } })
      .catch(() => null);
  }

  static async getAllProducts(page, limit) {
    const skip = (page - 1) * limit;

    //get all product in database
    return await prisma.product.findMany({
      skip,
      take: limit,
    });
    
    const totalProducts = await prisma.product.count();
    return {
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      data: products,
    };
  }
}

module.exports = productService;
