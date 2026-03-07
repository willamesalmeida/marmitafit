const prisma = require("../config/prisma.js");
const AppError = require("../utils/errorHandler.util.js");

class CategoryService {
  static async createCategory(name) {
    const existing = await prisma.category.findUnique({ where: { name } });
    if (existing) {
      throw new AppError("Category already exists", 409);
    }
    return await prisma.category.create({ data: { name } });
  }

  static async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }
  static async updateCategory(id, name) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    return await prisma.category.update({ where: { id }, data: { name } });
  }

  static async deleteCategory(id) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new AppError("Category not found", 404);
    }
    await prisma.category.delete({ where: { id } });
    return { message: "Category deleted successfully" };
  }
}
module.exports = CategoryService;
