const express = require("express");
const router = express.Router();

const {
  login,
  getAdmins,
  createAdmin,
  updateAdminStatus,
  deleteAdmin,
} = require("../controllers/adminController");

const adminAuth = require("../middleware/adminAuth");

router.post("/login", login);

router.get("/users", adminAuth, getAdmins);
router.post("/users", adminAuth, createAdmin);
router.patch("/users/:id/status", adminAuth, updateAdminStatus);
router.delete("/users/:id", adminAuth, deleteAdmin);

module.exports = router;
