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

      // captures the data coming from the request
      /* const imageUrl = req.file ? `upload/${req.file.filename}` : null; */

      const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null; 
      
      if (!imageUrl) {
        return res.status(400).json({ message: "Please upload an image" });
      }
      // valide the data
      const { error } = productSchema.validate(
        { name, description, price, imageUrl },
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
        imageUrl
      );

      res
        .status(201)
        .json({ message: "product registered successfully", product });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "error registering product", error });
    }
  }
}

module.exports = ProductController;
