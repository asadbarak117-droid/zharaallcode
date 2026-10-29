const mongoose = require("mongoose");

const consultationSectionSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, "Problem number is required"],
      min: [1, "Problem number must be at least 1"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Skin", "Hair"],
        message: "Category must be Skin or Hair",
      },
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1500, "Description cannot exceed 1500 characters"],
    },

    tips: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [300, "Each tip cannot exceed 300 characters"],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.BeautyProblem ||
  mongoose.model("BeautyProblem", consultationSectionSchema);
