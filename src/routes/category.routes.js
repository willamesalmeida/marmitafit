const express = require("express");
const CategoryController = require("../controllers/category.controller");

const {
  authIsAdminMiddleware,
  verifyTokenMiddleware,
} = require("../middlewares/authIsAdmin.middleware");

const router = express.Router();

// Public routes (any authenticated user can access list categories)
router.get('/categories', verifyTokenMiddleware, CategoryController.getAllCategories);


// Protected routes (only admin can create, update, delete categories)
router.post('/categories', authIsAdminMiddleware, CategoryController.createCategory);
router.put('/categories/:id', authIsAdminMiddleware, CategoryController.updateCategory);
router.delete('/categories/:id', authIsAdminMiddleware, CategoryController.deleteCategory);

module.exports = router;