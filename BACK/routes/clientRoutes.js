const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, clientController.getClients)
  .post(protect, clientController.addClient);

router
  .route("/:num_compte")
  .get(protect, clientController.getClientById)
  .put(protect, clientController.updateClient)
  .delete(protect, clientController.deleteClient);

module.exports = router;
