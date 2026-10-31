const express = require("express");
const rateLimit = require("express-rate-limit");

const adminAuth = require("../middleware/adminAuth");
const { adminAIChat } = require("../controllers/adminAIController");

const router = express.Router();

const adminAILimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages. Please try again later.",
  },
});

router.post("/chat", adminAuth, adminAILimiter, adminAIChat);

module.exports = router;
