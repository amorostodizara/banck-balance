const express = require("express");
const router = express.Router();
const auditController = require("../controllers/auditController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.route("/").get(protect, adminOnly, auditController.getAudits);

router.route("/stats").get(protect, adminOnly, auditController.getAuditStats);

router
  .route("/versement/:num_versement")
  .get(protect, adminOnly, auditController.getAuditsByVersement);

router.route("/:id").get(protect, adminOnly, auditController.getAuditById);

module.exports = router;
