const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const BeautyProblem = require("../moduls/consultationsection");

// GET: Get all skin and hair problems
router.get("/", async (req, res) => {
  try {
    const problems = await BeautyProblem.find().sort({ number: 1 });

    res.status(200).json(problems);
  } catch (error) {
    console.error("Get beauty problems error:", error.message);

    res.status(500).json({
      message: "Failed to load beauty problems.",
    });
  }
});

// GET: Get one problem by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid problem ID.",
      });
    }

    const problem = await BeautyProblem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Beauty problem not found.",
      });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Get beauty problem error:", error.message);

    res.status(500).json({
      message: "Failed to load beauty problem.",
    });
  }
});

// POST: Add a new skin or hair problem
router.post("/", async (req, res) => {
  try {
    const { number, category, title, description, tips } = req.body;

    const problem = await BeautyProblem.create({
      number,
      category,
      title,
      description,
      tips: Array.isArray(tips) ? tips : [],
    });

    res.status(201).json({
      message: "Beauty problem added successfully.",
      problem,
    });
  } catch (error) {
    console.error("Create beauty problem error:", error.message);

    res.status(400).json({
      message: error.message || "Failed to add beauty problem.",
    });
  }
});

// PUT: Update an existing problem
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid problem ID.",
      });
    }

    const { number, category, title, description, tips } = req.body;

    const problem = await BeautyProblem.findByIdAndUpdate(
      req.params.id,
      {
        number,
        category,
        title,
        description,
        tips: Array.isArray(tips) ? tips : [],
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!problem) {
      return res.status(404).json({
        message: "Beauty problem not found.",
      });
    }

    res.status(200).json({
      message: "Beauty problem updated successfully.",
      problem,
    });
  } catch (error) {
    console.error("Update beauty problem error:", error.message);

    res.status(400).json({
      message: error.message || "Failed to update beauty problem.",
    });
  }
});

// DELETE: Delete a problem
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid problem ID.",
      });
    }

    const problem = await BeautyProblem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({
        message: "Beauty problem not found.",
      });
    }

    res.status(200).json({
      message: "Beauty problem deleted successfully.",
    });
  } catch (error) {
    console.error("Delete beauty problem error:", error.message);

    res.status(500).json({
      message: "Failed to delete beauty problem.",
    });
  }
});

module.exports = router;
