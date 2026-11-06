const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, default: "", trim: true },
    category: { type: String, default: "Makeup", trim: true },
    image: { type: String, default: "" },
    description: { type: String, default: "", trim: true },
    price: { type: String, default: "" },
    badge: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

const videoSchema = new mongoose.Schema(
  {
    id: { type: String, default: "" },
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "" },
  },
  { timestamps: true },
);

const commentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const categoryDetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const searchSectionSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    badge: { type: String, default: "Find Your Favorites" },
    title: { type: String, default: "Search Beauty Products" },
    description: {
      type: String,
      default: "Find the products that match your beauty routine.",
    },
    placeholder: {
      type: String,
      default: "Search products by name or code...",
    },
    showCategoryFilters: { type: Boolean, default: true },
    showFavorites: { type: Boolean, default: true },
    showResultCount: { type: Boolean, default: true },
    showClearButton: { type: Boolean, default: true },
  },
  { _id: false },
);

const contactSectionSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },
    title: { type: String, default: "Need Help Choosing?" },
    description: {
      type: String,
      default: "Contact us for beauty recommendations and product information.",
    },
    buttonText: { type: String, default: "Contact Us" },
    buttonLink: { type: String, default: "/connect" },
  },
  { _id: false },
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
    heroButton: { type: String, default: "Explore Products" },
    heroImage: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    },
    heroColor: { type: String, default: "#e0f2fe" },
    pageTitle: { type: String, default: "Discover Your Beauty" },
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
    categoryDetails: {
      type: [categoryDetailSchema],
      default: [],
    },
    products: {
      type: [productSchema],
      default: [],
    },
    videos: {
      type: [videoSchema],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
    searchSection: {
      type: searchSectionSchema,
      default: () => ({}),
    },
    contactSection: {
      type: contactSectionSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.ProductSection ||
  mongoose.model("ProductSection", productSectionSchema);
