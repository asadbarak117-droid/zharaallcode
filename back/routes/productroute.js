const express = require("express");
const router = express.Router();
const ProductSection = require("../moduls/productsection");

const allowedFields = [
  "heroBadge",
  "heroTitle",
  "heroDescription",
  "heroButton",
  "heroImage",
  "heroColor",
  "pageTitle",
  "pageDescription",
  "categories",
  "categoryDetails",
  "products",
  "videos",
  "comments",
  "searchSection",
  "contactSection",
];

router.get("/", async (req, res) => {
  try {
    let section = await ProductSection.findOne();

    if (!section) {
      section = await ProductSection.create({});
    }

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load product page settings",
      error: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.categories !== undefined &&
      (!Array.isArray(updates.categories) ||
        !updates.categories.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        message: "Categories must be an array of strings.",
      });
    }

    if (updates.products !== undefined && !Array.isArray(updates.products)) {
      return res.status(400).json({
        message: "Products must be an array.",
      });
    }

    if (updates.videos !== undefined && !Array.isArray(updates.videos)) {
      return res.status(400).json({
        message: "Videos must be an array.",
      });
    }

    if (updates.comments !== undefined && !Array.isArray(updates.comments)) {
      return res.status(400).json({
        message: "Comments must be an array.",
      });
    }

    if (
      updates.categoryDetails !== undefined &&
      !Array.isArray(updates.categoryDetails)
    ) {
      return res.status(400).json({
        message: "Category details must be an array.",
      });
    }

    let section = await ProductSection.findOne();

    if (!section) {
      section = await ProductSection.create(updates);
    } else {
      Object.assign(section, updates);
      await section.save();
    }

    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save product page settings",
      error: error.message,
    });
  }
});

module.exports = router;
