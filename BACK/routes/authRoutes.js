const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/login", authController.authenticate);
router.post("/init", authController.initUsers);
router.get("/me", protect, authController.getCurrentUser);
router.get("/users", protect, adminOnly, authController.getAllUsers);

module.exports = router;
