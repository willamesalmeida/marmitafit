const { productSchema } = require("../validator/product.validation");
const productService = require("../services/product.service.js");

class ProductController {
  static async createProduct(req, res) {
    try {
      // captures the data coming from the request
      let { name, description, price } = req.body;
      price = parseInt(price, 10);

      if (!(name && description && price)) {
        return res
          .status(400)
          .json({ message: "Please provide all the fields." });
      }

      // captures the image coming from the request
      /* const imageUrl = req.file ? `upload/${req.file.filename}` : null; */
      // const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;
      const imageUrl = req.file?.path;
      const publicId = req.file?.filename; // get the 'puclicId created by cloudinary 

      if (!imageUrl) {
        return res.status(400).json({ message: "Please upload an image" });
      }
      // valide the data
      const { error } = productSchema.validate(
        { name, description, price, imageUrl, publicId },
        { abordEarly: false }
      );

      if (error) {
        return res.status(400).json({
          message: "validation error",
          errors: error.details.map((error) => error.message),
        });
      }
      //create a product in database
      const product = await productService.createProduct(
        name,
        description,
        price,
        imageUrl,
        publicId,
      );

      res
        .status(201)
        .json({ message: "product registered successfully", product });
    } catch (error) {
      res.status(500).json({ message: "error registering product", error });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const deleteProduct = await productService.deleteProduct(id);

      if (!deleteProduct) {
        return res.status(404).json({ message: "Product not found!", error });
      }

      res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: "Error to delete the product!", error });
    }
  }

  static async getAllProducts(req, res) {
    try {
      const { page= 1, limit= 10 } = req.query;
      const product = await productService.getAllProducts(Number(page), Number(limit))

      res.status(200).json(product) // return list contain all products
      } catch (error) {
        res.status(500).json({ message: "Error to get products!", error})
    
    }
  }
}

module.exports = ProductController;
