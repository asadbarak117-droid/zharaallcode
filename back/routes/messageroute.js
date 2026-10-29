const express = require("express");
const router = express.Router();
const ContactMessage = require("../moduls/contactmessage");

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Name, email, and message are required.",
      });
    }

    const savedMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      subject: typeof subject === "string" ? subject.trim() : "",
      message: message.trim(),
    });

    res.status(201).json({
      message: "Your message was sent successfully.",
      contactMessage: savedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save your message.",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load messages.",
      error: error.message,
    });
  }
});

module.exports = router;
