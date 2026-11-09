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

function validateArray(value, fieldName) {
  if (value !== undefined && !Array.isArray(value)) {
    return `${fieldName} must be an array.`;
  }

  return null;
}

async function getProductSection() {
  let section = await ProductSection.findOne().sort({ createdAt: 1 });

  if (!section) {
    section = await ProductSection.create({});
  }

  return section;
}

// GET PRODUCT SECTION
router.get("/", async (req, res) => {
  try {
    const section = await getProductSection();

    res.set("Cache-Control", "no-store");

    return res.status(200).json(section.toObject());
  } catch (error) {
    console.error("Product section GET error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load product page settings.",
      error: error.message,
    });
  }
});

// SAVE PRODUCT SECTION
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
      updates.videos = updates.videos.map((video, index) => {
        if (!video || typeof video !== "object" || Array.isArray(video)) {
          throw new Error(`Invalid video at position ${index + 1}.`);
        }

        if (typeof video.url !== "string" || !video.url.trim()) {
          throw new Error(`Video ${index + 1} must have a valid URL.`);
        }

        let parsedUrl;

        try {
          parsedUrl = new URL(video.url.trim());
        } catch {
          throw new Error(`Video ${index + 1} URL is invalid.`);
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error(`Video ${index + 1} URL must use HTTP or HTTPS.`);
        }

        if (video.title !== undefined && typeof video.title !== "string") {
          throw new Error(`Video ${index + 1} title must be text.`);
        }

        if (
          video.description !== undefined &&
          typeof video.description !== "string"
        ) {
          throw new Error(`Video ${index + 1} description must be text.`);
        }

        if (video.id !== undefined && typeof video.id !== "string") {
          throw new Error(`Video ${index + 1} ID must be text.`);
        }

        if (
          video.publicId !== undefined &&
          typeof video.publicId !== "string"
        ) {
          throw new Error(`Video ${index + 1} publicId must be text.`);
        }

        return {
          id: video.id || "",
          title: video.title || "",
          description: video.description || "",
          url: parsedUrl.href,
          publicId: video.publicId || "",
        };
      });
    }

    const section = await getProductSection();

    for (const [field, value] of Object.entries(updates)) {
      section.set(field, value);
    }

    await section.save();

    const savedSection = await ProductSection.findById(section._id).lean();

    if (!savedSection) {
      throw new Error("Saved product section could not be retrieved.");
    }

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
