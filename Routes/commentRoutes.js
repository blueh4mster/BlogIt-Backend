const express = require("express");
const commentController = require("../Controllers/commentController");
const authController = require("./../Controllers/authController");

const router = express.Router();

router.post(
  "/",
  authController.protect,
  authController.restrictTo("writer"),
  commentController.addComment
);
router
  .route("/:commentId")
  .patch(
    authController.protect,
    authController.restrictTo("writer"),
    commentController.updateComment
  )
  .delete(authController.protect, commentController.deleteComment);
router.post(
  "/:commentId/like-comment",
  authController.protect,
  authController.restrictTo("writer"),
  commentController.likeComment
);

module.exports = router;
