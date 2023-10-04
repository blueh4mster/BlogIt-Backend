const express = require("express");
const Comment = require("./../Models/commentModel");
const catchAsync = require("./../utils/catchAsync");
const errorHandler = require("./../utils/errorhandler");
const Poem = require("./../Models/poemModel");

exports.addComment = catchAsync(async (req, res, next) => {
  const queryObj = {
    writtenAt: Date.now(),
    ...req.body,
  };
  const comment = Comment.create(queryObj);

  if (comment) {
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } else {
    return next(
      new errorHandler(
        "something went wrong ! couldn't create the comment",
        404
      )
    );
  }
  next();
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const updateQuery = req.body;
  const id = req.params.commentId;
  const comment = await Comment.findByIdAndUpdate(id, updateQuery);
  if (comment) {
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } else {
    return next(
      new errorHandler("something went wrong ! couldn't update comment", 404)
    );
  }
  next();
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const doc = await Comment.findByIdAndDelete(req.params.commentId);

  if (!doc) {
    return next(new errorHandler("error cannot delete comment", 404));
  } else {
    res.status(200).json({});
  }
  next();
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const doc = await Comment.find({ _id: commentId });
  const numcommentLikes = doc[0].commentLikes;
  const comment = await Comment.findByIdAndUpdate(commentId, {
    commentLikes: numcommentLikes + 1,
  });

  console.log(comment);

  if (comment) {
    res.status(200).json({
      status: "success",
      data: comment,
    });
  } else {
    return next(new errorHandler("something went wrong!", 404));
  }
  next();
});
