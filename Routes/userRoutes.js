const express = require("express");
const userController = require("./../Controllers/userController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router
  .route("/users/:userId")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);
router
  .route("/users")
  .get(
    authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );
router.get(
  "/users/:userId/poems",
  authController.protect,
  userController.getPoemsOfUser
);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/resetPassword/:token", authController.resetPassword);

router.use(authController.isLoggedIn);

router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe, userController.updateUser);
router.delete("/deleteMe", userController.deleteMe, userController.deleteUser);

module.exports = router;
