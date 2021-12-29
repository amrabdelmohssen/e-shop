const userController = require("../controllers/user");
const router = require("express").Router();

router
  .get("/", userController.getAllUsers)
  .get("/get/userscount", userController.getUsersCount)
  .get("/:userId", userController.getUser)
  .post("/", userController.createUser)
  .post("/login", userController.login)
  .put("/:userId",userController.updateUser)
  .delete("/:userId", userController.deleteUser);

module.exports = router;
