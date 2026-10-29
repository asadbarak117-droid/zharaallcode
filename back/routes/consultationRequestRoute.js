const express = require("express");
const router = express.Router();
const ConsultationRequest = require("../moduls/ConsultationRequest");

router.post("/", async (req, res) => {
  try {
    const { name, email, whatsapp, service, date, message } = req.body;

    if (!name || !email || !whatsapp || !service) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    const request = await ConsultationRequest.create({
      name,
      email,
      whatsapp,
      service,
      date: date ? new Date(date) : null,
      message: message || "",
    });

    res.status(201).json({
      message: "Consultation request saved successfully.",
      request,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to save consultation request.",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const requests = await ConsultationRequest.find().sort({
      createdAt: -1,
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load consultation requests.",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["New", "Contacted", "Completed", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status.",
      });
    }

    const request = await ConsultationRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    );

    if (!request) {
      return res.status(404).json({
        message: "Consultation request not found.",
      });
    }

    res.json({
      message: "Status updated successfully.",
      request,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update status.",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const request = await ConsultationRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Consultation request not found.",
      });
    }

    res.json({
      message: "Consultation request deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete consultation request.",
      error: error.message,
    });
  }
});

module.exports = router;
