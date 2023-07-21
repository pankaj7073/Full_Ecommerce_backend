const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxLength: [30, "Name Exceed more than 30 characters"],
    minLength: [4, "Name is should have 4 character "],
  },

  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },

  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [6, "Password Should have more than 6 character"],
  },

  avatar: {
    public_id: {
      type: String,
      required: [true, "Please Enter Public_Id"],
    },
    url: {
      type: String,
      required: [true, "Please Enter Public_Id"],
    },
  },

  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: String,
});

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Compare Password
userSchema.methods.comparePassword = async function (enetrPassword) {
  return await bcrypt.compare(enetrPassword, this.password);
};

// Genrating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Genrating Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing And Adding resetPasswordToken to user Schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

module.exports = new mongoose.model("User", userSchema);
