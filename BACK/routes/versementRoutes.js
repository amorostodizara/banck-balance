const express = require("express");
const router = express.Router();
const versementController = require("../controllers/versementController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, versementController.getVersements)
  .post(protect, versementController.addVersement);

router
  .route("/compte/:num_compte")
  .get(protect, versementController.getVersementsByCompte);

router
  .route("/:num_versement")
  .get(protect, versementController.getVersementById)
  .put(protect, versementController.updateVersement)
  .delete(protect, versementController.deleteVersement);

module.exports = router;
