const express = require("express");
const poemController = require("./../Controllers/poemController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(poemController.getPoems)
  .post(
    authController.protect,
    authController.restrictTo("writer"),
    poemController.publishPoem
  );
router.get("/:poemId", poemController.getPoemById);
router.post(
  "/:poemId/like",
  authController.protect,
  authController.restrictTo("writer"),
  poemController.likePoem
);

module.exports = router;
