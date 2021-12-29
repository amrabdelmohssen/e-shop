const productController = require("../controllers/product");
const router = require("express").Router();

router
  .get(`/`, productController.getAllProductsAndFilterByCategory)
  .get('/:productId', productController.getOneProduct)
  .get(`/get/productscount`,productController.getProductsCount)
  .get(`/get/featuredproducts/:count?`,productController.getFeaturedProducts)
  .post(`/`, productController.uploadImage,productController.createProduct)
  .put(`/:productId`,productController.uploadImage,productController.updateProduct)
  .delete(`/:productId`, productController.deleteProduct);

module.exports = router;
