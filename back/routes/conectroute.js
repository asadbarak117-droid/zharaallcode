const express = require("express");
const router = express.Router();
const ConectSection = require("../moduls/conectsection");

router.get("/", async (req, res) => {
  try {
    let contact = await ConectSection.findOne();

    if (!contact) {
      contact = await ConectSection.create({
        email: "",
        phone: "",
        location: "Afghanistan",
        instagram: "",
        facebook: "",
        whatsapp: "",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get contact settings",
      error: error.message,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const { email, phone, location, instagram, facebook, whatsapp } = req.body;

    const contact = await ConectSection.findOneAndUpdate(
      {},
      {
        email,
        phone,
        location,
        instagram,
        facebook,
        whatsapp,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    res.status(200).json({
      message: "Contact settings saved successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save contact settings",
      error: error.message,
    });
  }
});

module.exports = router;
