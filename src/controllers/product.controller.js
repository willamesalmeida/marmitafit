const { productSchema } = require("../validator/product.validation");
const productService = require("../services/product.service.js");

class ProductController {
  static async createProduct(req, res) {
    try {
      // captures the data coming from the request
      const {name, description, price} = req.body;

      if(!(name && description && price)){
        return res.status(400).json({message: "Please provide all the fields."});
      }

      // valide the data
      const { error } = productSchema.validate({name,description, price}, { abordEarly });
      console.log(req.body)
      if (error) {
        return res.status(400).json({
          message: "validation error",
          errors: error.details.map((error) => error.message),
        });
      }
      
      // captures the data coming from the request
      const imageUrl = req.file ? `src/upload/${req.file.filename}` : null
      
      if(!imageUrl) {
        return res.status(400).json({ message: "Please upload an image" });
      }
      
      //create a product in database
      const product = await productService.createProduct(
        name,
        description,
        price,
        imageUrl
      );

      console.log("product",product)

      res.status(201).json({ message: "product registered successfully", product });
    } catch (error) {
      res.status(500).json({ message: "error registering product", error})
    }
  }
}

module.exports = ProductController;
