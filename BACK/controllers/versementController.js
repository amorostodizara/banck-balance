const versementService = require("../services/versementService");
const Client = require("../models/Client");

exports.getVersements = async (req, res) => {
  try {
    const versements = await versementService.getAllVersements();
    res.json({
      success: true,
      data: versements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getVersementById = async (req, res) => {
  try {
    const { num_versement } = req.params;
    const versement = await versementService.getVersementById(
      parseInt(num_versement),
    );

    if (!versement) {
      return res.status(404).json({
        success: false,
        error: "Versement non trouvé",
      });
    }

    res.json({
      success: true,
      data: versement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addVersement = async (req, res) => {
  try {
    const { num_compte, montant, action_by } = req.body;

    // Validation
    if (!num_compte || !montant || !action_by) {
      return res.status(400).json({
        success: false,
        error: "Tous les champs sont requis: num_compte, montant, action_by",
      });
    }

    if (montant <= 0) {
      return res.status(400).json({
        success: false,
        error: "Le montant doit être positif",
      });
    }

    const versement = await versementService.addVersement(
      num_compte,
      montant,
      action_by,
    );

    res.status(201).json({
      success: true,
      data: versement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.updateVersement = async (req, res) => {
  try {
    const { num_versement } = req.params;
    const { montant, action_by } = req.body;

    if (!montant || !action_by) {
      return res.status(400).json({
        success: false,
        error: "Le montant et action_by sont requis",
      });
    }

    if (montant <= 0) {
      return res.status(400).json({
        success: false,
        error: "Le montant doit être positif",
      });
    }

    const versement = await versementService.updateVersement(
      parseInt(num_versement),
      montant,
      action_by,
    );

    res.json({
      success: true,
      data: versement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteVersement = async (req, res) => {
  try {
    const { num_versement } = req.params;
    const { action_by } = req.body;

    if (!action_by) {
      return res.status(400).json({
        success: false,
        error: "action_by est requis",
      });
    }

    await versementService.deleteVersement(parseInt(num_versement), action_by);

    res.json({
      success: true,
      message: "Versement supprimé avec succès",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getVersementsByCompte = async (req, res) => {
  try {
    const { num_compte } = req.params;
    const versements = await versementService.getVersementsByCompte(
      parseInt(num_compte),
    );

    res.json({
      success: true,
      data: versements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
