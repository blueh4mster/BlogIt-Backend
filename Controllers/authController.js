const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./../Models/userModel");
const catchAsync = require("./../utils/catchAsync");
const errorHandler = require("../utils/errorhandler");

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(201).json({
    status: "success",
    token: token,
    data: user,
  });
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(password);

  if (!email || !password) {
    return next(new errorHandler("please provide email and password ", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  console.log(await bcrypt.compare(password, user.password));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(
      new errorHandler("please provide correct email or password!", 404)
    );
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new errorHandler("not logged in", 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new errorHandler("no user with that token", 401));
  }

  req.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );
      console.log(decoded);
      const currentUser = await User.findById(decoded.id);
      console.log(currentUser);
      if (!currentUser) {
        return next();
      }

      req.user = currentUser;
      console.log(req.user._id);
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new errorHandler("you are not allowed to perform this operation", 401)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new errorHandler("There is no user with the provided email address", 404)
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //sending via api response
  res.status(200).json({
    token: resetToken,
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await user.findOne({ passwordResetToken: hashToken });

  if (!user) {
    return next(new errorHandler("token is invalid", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.status(200).json({
    status: "success",
    token,
  });
});
