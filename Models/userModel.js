const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "a user must have an email address"],
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "a user must have a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "a user must have their password confirmed"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  age: Number,
  role: {
    type: String,
    enum: ["admin", "writer"],
    default: "writer",
  },
  active: {
    type: Boolean,
    default: true,
  },
  poems: {
    type: [mongoose.Schema.ObjectId],
    ref: "Poem",
  },
  passwordResetToken: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  return resetToken;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
