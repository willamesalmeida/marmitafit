const CategoryService = require("../services/category.service");
const AppError = require("../utils/errorHandler.util.js");

class CategoryController {
  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;

      
      if (!name) {
        throw new AppError("Name is required", 400);
      }


      const category = await CategoryService.createCategory(name);
      res
        .status(201)
        .json({ message: "Category created successfully", category });



    } catch (error) {
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  static async updateCategory(req, res, next) {
    try {
      const id = Number(req.params.id);
      const {name} = req.body;
      if(!name){
        throw new AppError("Name is required", 400);
      }
      const category = await CategoryService.updateCategory(id, name);
      res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
      next(error);
      
    }
  }

  static async deleteCategory(req, res, next ) {
    try {
      const id = Number(req.params.id);
      const result = await CategoryService.deleteCategory(id);
      res.status(200).json(result)
    }catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController
