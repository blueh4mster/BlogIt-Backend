const express = require("express");
const Poem = require("./../Models/poemModel");
const catchAsync = require("./../utils/catchAsync");
const errorHandler = require("./../utils/errorhandler");

exports.getPoems = catchAsync(async (req, res, next) => {
  const poem = await Poem.find({});

  res.status(200).json({
    status: "success",
    data: poem,
  });
  next();
});

exports.getPoemById = catchAsync(async (req, res, next) => {
  const poem = await Poem.find({ _id: req.params.poemId });
  res.status(200).json({
    status: "success",
    data: poem,
  });
  next();
});

exports.publishPoem = catchAsync(async (req, res, next) => {
  const newobj = {
    publishedOn: Date.now(),
    ...req.body,
  };
  const poem = await Poem.create(newobj);

  res.status(200).json({
    status: "success",
    data: poem,
  });
  next();
});

exports.likePoem = catchAsync(async (req, res, next) => {
  const poemId = req.params.poemId;
  const doc = await Poem.find({ _id: poemId });
  const numLikes = doc[0].likes;
  const poem = await Poem.findByIdAndUpdate(poemId, { likes: numLikes + 1 });

  if (poem) {
    res.status(200).json({
      status: "success",
      data: poem,
    });
  } else {
    return next(new errorHandler("something went wrong!", 404));
  }
  next();
});
