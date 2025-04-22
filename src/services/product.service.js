const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../config/cloudinary");

const prisma = new PrismaClient();

class productService {
  static async createProduct(name, description, price, imageUrl, publicId) {
    try {
      if (!name || !description || !price || !imageUrl) {
        throw new AppError("All product fields are required!", 400);
      }

      return await prisma.product.create({
        data: { name, description, price, imageUrl, publicId },
      });
    } catch (error) {
      throw new AppError("Error registering product!", 500);
    }
  }

  static async deleteProduct(id) {
    try {
      if (!id) {
        throw new AppError("Product ID is required!", 400);
      }
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        throw new AppError(
          "The product you are trying to delete was not found in the database!",
          404
        );
      }

      //Delete the image on cloudinary before remove product on database
      if (product.publicId) {
        try {
          const deleteImage = await cloudinary.uploader.destroy(
            product.publicId
          );

          if (!deleteImage) {
            throw new AppError(
              "Error deleting product image in Cloudinary",
              500
            );
          }
        } catch (error) {
          throw new AppError(
            "Error deleting product image that was stored in cloudinary",
            500
          );
        }
      }

      await prisma.product
        .delete({ where: { id: Number(id) } })
        .catch(() => null);

      return { message: "Product deleted successfully!" };
    } catch (error) {
      throw new AppError(error.message, error.statusCode || 500);
      // example of how to handle the lines of code that request the database. Using try catch
      /*   try {
        await cloudinary.uploader.destroy(product.publicId)
      } catch (error) {
        console.log("erro", error)
      } */
    }
  }

  static async getAllProducts(page, limit) {
    try {
      if (!page || !limit) {
        throw new AppError("Page and limit parameters are required!", 400);
      }

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
    } catch (error) {
      throw new AppError("error fetching products!", 500);
    }
  }
}

module.exports = productService;
