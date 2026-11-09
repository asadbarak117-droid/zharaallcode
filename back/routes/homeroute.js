const express = require("express");
const router = express.Router();

const HomeSection = require("../moduls/homesection");

router.get("/", async (req, res) => {
  try {
    let content = await HomeSection.findOne();

    if (!content) {
      content = await HomeSection.create({});
    }

    res.json({
      message: "Homepage content loaded successfully",
      content,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const allowedFields = [
      "brand",
      "heroBackgroundType",
      "heroBadge",
      "heroTitle",
      "heroSubtitle",
      "heroDescription",
      "heroVideo",
      "heroPoster",
      "primaryButton",
      "secondaryButton",
      "primaryColor",
      "backgroundColor",
      "textColor",
      "categories",
      "products",
      "videos",
      "sections",
      "promotionTitle",
      "promotionDescription",
      "footerDescription",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.videos !== undefined && !Array.isArray(updates.videos)) {
      return res.status(400).json({
        message: "Videos must be an array.",
      });
    }

    if (updates.sections !== undefined && !Array.isArray(updates.sections)) {
      return res.status(400).json({
        message: "Sections must be an array.",
      });
    }

    if (
      updates.categories !== undefined &&
      !Array.isArray(updates.categories)
    ) {
      return res.status(400).json({
        message: "Categories must be an array.",
      });
    }

    if (updates.products !== undefined && !Array.isArray(updates.products)) {
      return res.status(400).json({
        message: "Products must be an array.",
      });
    }

    let content = await HomeSection.findOne();

    if (content) {
      content.set(updates);
      await content.save();
    } else {
      content = await HomeSection.create(updates);
    }

    res.json({
      message: "Homepage content saved successfully",
      content,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = router;
