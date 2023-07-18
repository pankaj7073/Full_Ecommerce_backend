const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },

  price: {
    type: Number,
    required: [true, "Please Enter Prduct Price"],
    maxLength: [8, "this value is to high"],
  },

  ratings: {
    type: Number,
    default: 0,
  },

  images: [
    {
      public_id: {
        type: String,
        required: [true, "Please Enter Public_Id"],
      },
      url: {
        type: String,
        required: [true, "Please Enter Public_Id"],
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },

  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock"],
    maxLength: [4, "Stock cannot excced 4 character"],
    default: 1,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        // required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = new mongoose.model("Product", productSchema);
