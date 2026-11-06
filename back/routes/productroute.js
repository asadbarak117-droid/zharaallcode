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

const validateArray = (value, fieldName) => {
  if (value !== undefined && !Array.isArray(value)) {
    return `${fieldName} must be an array.`;
  }
  return null;
};

router.get("/", async (req, res) => {
  try {
    let section = await ProductSection.findOne();

    if (!section) {
      section = await ProductSection.create({});
    }

    return res.status(200).json(section);
  } catch (error) {
    console.error("Product section GET error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product page settings.",
      error: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request body.",
      });
    }

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.categories !== undefined &&
      (!Array.isArray(updates.categories) ||
        !updates.categories.every((item) => typeof item === "string"))
    ) {
      return res.status(400).json({
        success: false,
        message: "Categories must be an array of strings.",
      });
    }

    const arrayFields = [
      ["products", "Products"],
      ["videos", "Videos"],
      ["comments", "Comments"],
      ["categoryDetails", "Category details"],
    ];

    for (const [field, label] of arrayFields) {
      const error = validateArray(updates[field], label);

      if (error) {
        return res.status(400).json({
          success: false,
          message: error,
        });
      }
    }

    if (updates.videos !== undefined) {
      for (const video of updates.videos) {
        if (
          !video ||
          typeof video !== "object" ||
          typeof video.url !== "string" ||
          !video.url.trim()
        ) {
          return res.status(400).json({
            success: false,
            message: "Every video must have a valid URL.",
          });
        }

        if (video.title !== undefined && typeof video.title !== "string") {
          return res.status(400).json({
            success: false,
            message: "Video title must be text.",
          });
        }

        if (
          video.description !== undefined &&
          typeof video.description !== "string"
        ) {
          return res.status(400).json({
            success: false,
            message: "Video description must be text.",
          });
        }
      }
    }

    let section = await ProductSection.findOne();

    if (!section) {
      section = new ProductSection(updates);
    } else {
      Object.assign(section, updates);
    }

    await section.save();

    const savedSection = await ProductSection.findById(section._id);

    return res.status(200).json({
      success: true,
      message: "Product page settings saved successfully.",
      data: savedSection,
    });
  } catch (error) {
    console.error("Product section PUT error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save product page settings.",
      error: error.message,
    });
  }
});

module.exports = router;
