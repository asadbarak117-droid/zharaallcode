const mongoose = require("mongoose");

const headerSectionSchema = new mongoose.Schema(
  {
    logoLetter: {
      type: String,
      default: "L",
      trim: true,
    },
    siteName: {
      type: String,
      default: "Ledora",
      trim: true,
    },
    tagline: {
      type: String,
      default: "Beauty & Elegance",
      trim: true,
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    accentColor: {
      type: String,
      default: "#b76e79",
    },
    textColor: {
      type: String,
      default: "#333333",
    },
    buttonText: {
      type: String,
      default: "Contact Us",
      trim: true,
    },
    buttonPath: {
      type: String,
      default: "/connect",
      trim: true,
    },
    links: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        path: {
          type: String,
          required: true,
          trim: true,
        },
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("HeaderSection", headerSectionSchema);
