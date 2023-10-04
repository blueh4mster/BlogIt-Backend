const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./../Models/userModel");
const catchAsync = require("./../utils/catchAsync");
const errorHandler = require("./../utils/errorhandler");
const Poem = require("./../Models/poemModel");

exports.getUser = catchAsync(async (req, res, next) => {
  console.log(req.params.userId);

  const user = await User.findById(req.params.userId);

  if (user) {
    res.status(200).json({
      status: "success",
      data: user,
    });
  } else {
    return new errorHandler("no user with that id!", 404);
  }
  next();
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const updateQuery = req.body;
  const id = req.params.userId;
  const user = await User.findByIdAndUpdate(id, updateQuery);

  res.status(200).json({
    status: "success",
    data: user,
  });
  next();
});

exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  console.log(req.params.userId);
  next();
};

exports.deleteMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

exports.updateMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.userId, {
    active: false,
  });
  res.status(200).json({});
  next();
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  if (users) {
    res.status(200).json({
      status: "success",
      data: users,
    });
  } else {
    return next(new errorHandler("some error has occured ", 404));
  }
  next();
});

exports.getPoemsOfUser = catchAsync(async (req, res, next) => {
  const obj = await User.find({ _id: req.params.userId }).populate("poems");
  console.log(obj);
  const Poems = await obj[0].poems;

  if (Poems) {
    res.status(200).json({
      status: "success",
      data: Poems,
    });
  } else {
    return next(
      new errorHandler(
        "something went wrong cannot retrieve the poems for this user",
        404
      )
    );
  }
});
