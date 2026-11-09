const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Category",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

const featuredProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "New Product",
      trim: true,
    },
    category: {
      type: String,
      default: "Beauty",
    },
    price: {
      type: String,
      default: "0.00",
    },
    image: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "New Beauty Video",
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    originalFileName: {
      type: String,
      default: "",
    },
  },
  { _id: true },
);

const homeSectionItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "custom",
    },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true },
);

const homeSectionSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      default: "FASHION",
    },

    heroBackgroundType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    heroBadge: {
      type: String,
      default: "Discover Your Beauty",
    },

    heroTitle: {
      type: String,
      default: "Your Beauty.",
    },

    heroSubtitle: {
      type: String,
      default: "Your Story.",
    },

    heroDescription: {
      type: String,
      default: "",
    },

    heroVideo: {
      type: String,
      default: "/videos/hero.mp4",
    },

    heroPoster: {
      type: String,
      default: "",
    },

    primaryButton: {
      type: String,
      default: "Shop Collection",
    },

    secondaryButton: {
      type: String,
      default: "Explore More",
    },

    primaryColor: {
      type: String,
      default: "#38bdf8",
    },

    backgroundColor: {
      type: String,
      default: "#ffffff",
    },

    textColor: {
      type: String,
      default: "#1e293b",
    },

    categories: {
      type: [categorySchema],
      default: [],
    },

    products: {
      type: [featuredProductSchema],
      default: [],
    },

    videos: {
      type: [videoSchema],
      default: [],
    },

    sections: {
      type: [homeSectionItemSchema],
      default: [],
    },

    promotionTitle: {
      type: String,
      default: "A Little Beauty, A Lot of Confidence",
    },

    promotionDescription: {
      type: String,
      default: "",
    },

    footerDescription: {
      type: String,
      default: "Your style, your story. Find what feels like you.",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HomeSection", homeSectionSchema);
