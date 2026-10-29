const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Makeup",
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

const productSectionSchema = new mongoose.Schema(
  {
    heroBadge: {
      type: String,
      default: "Your Beauty, Your Confidence",
    },
    heroTitle: {
      type: String,
      default: "Discover Your New Beauty Favorites",
    },
    heroDescription: {
      type: String,
      default:
        "Explore makeup, skincare, hair care, and fragrances for your personal routine.",
    },
    heroButton: {
      type: String,
      default: "Explore Products",
    },
    heroImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    },
    heroColor: {
      type: String,
      default: "#e0f2fe",
    },
    pageTitle: {
      type: String,
      default: "Discover Your Beauty",
    },
    pageDescription: {
      type: String,
      default: "Explore makeup, skincare, hair care, perfumes, and more.",
    },
    categories: {
      type: [String],
      default: [
        "Makeup",
        "Skincare",
        "Viper",
        "Spirulina",
        "Hair Care",
        "Soap & Body",
        "Perfume",
        "Pomegranate",
      ],
    },
    products: {
      type: [productSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ProductSection", productSectionSchema);
