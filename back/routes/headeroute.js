const express = require("express");
const router = express.Router();
const HeaderSection = require("../moduls/headersection");

router.get("/", async (req, res) => {
  try {
    let header = await HeaderSection.findOne();

    if (!header) {
      header = await HeaderSection.create({
        logoLetter: "L",
        siteName: "Ledora",
        tagline: "Beauty & Elegance",
        backgroundColor: "#ffffff",
        accentColor: "#b76e79",
        textColor: "#333333",
        buttonText: "Contact Us",
        buttonPath: "/connect",
        links: [
          { label: "Home", path: "/", enabled: true },
          { label: "Products", path: "/products", enabled: true },
          { label: "Consultation", path: "/consultation", enabled: true },
          { label: "Connect", path: "/connect", enabled: true },
        ],
      });
    }

    res.status(200).json(header);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get header settings",
      error: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const header = await HeaderSection.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    });

    res.status(200).json({
      message: "Header settings saved successfully",
      header,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save header settings",
      error: error.message,
    });
  }
});

module.exports = router;
