const categoryController = require("../controllers/category");
const router = require("express").Router();

router
  .get(`/`, categoryController.getAllCategories)
  .get("/:categoryId", categoryController.getOneCategory)
  .get("/get/categoriescount", categoryController.getCategoriesCount)
  .post(`/`, categoryController.createCategory)
  .put(`/:categoryId`, categoryController.updateCategory)
  .delete(`/:categoryId`, categoryController.deleteCategory);

module.exports = router;
