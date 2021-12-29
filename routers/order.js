const orderController = require("../controllers/order");
const router = require("express").Router();

router
  .post("/", orderController.createOrder)
  .get("/", orderController.getAllOrders)
  .get("/:orderId", orderController.getOneOrder)
  .get("/get/totalsales", orderController.getTotalSales)
  .get("/get/orderscount", orderController.getOrdersCount)
  .get("/userorder/:userId",orderController.getUserOrders)
  .put("/:orderId", orderController.updateOrderStatus)
  .delete("/:orderId", orderController.deleteOrder);

module.exports = router;
