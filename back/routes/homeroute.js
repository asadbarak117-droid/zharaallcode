const express = require("express");
const router = express.Router();
const HomeSection = require("../moduls/homesection");

router.get("/", async (req, res) => {
  try {
    let content = await HomeSection.findOne();

    if (!content) {
      content = await HomeSection.create({});
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
