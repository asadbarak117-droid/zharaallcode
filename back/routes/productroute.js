const express = require("express");
const router = express.Router();
const ProductSection = require("../moduls/productsection");

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
    const {
      heroBadge,
      heroTitle,
      heroDescription,
      heroButton,
      heroImage,
      heroColor,
      pageTitle,
      pageDescription,
      categories,
      products,
    } = req.body;

    let section = await ProductSection.findOne();

    const updates = {
      heroBadge,
      heroTitle,
      heroDescription,
      heroButton,
      heroImage,
      heroColor,
      pageTitle,
      pageDescription,
      categories,
      products,
    };

    for (const key of Object.keys(updates)) {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    }

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
