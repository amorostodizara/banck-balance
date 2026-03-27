const versementService = require("../services/versementService");

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
    const { num_compte, montant } = req.body;
    const action_by = req.user.username;

    if (!num_compte || montant === undefined) {
      return res.status(400).json({
        success: false,
        error: "num_compte et montant sont requis",
      });
    }

    const montantNumber = Number(montant);
    if (isNaN(montantNumber) || montantNumber <= 0) {
      return res.status(400).json({
        success: false,
        error: "Montant doit être un nombre positif",
      });
    }

    const versement = await versementService.addVersement(
      num_compte,
      montantNumber,
      action_by,
    );

    res.status(201).json({
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

exports.updateVersement = async (req, res) => {
  try {
    const { num_versement } = req.params;
    const { montant } = req.body;
    const action_by = req.user.username;

    if (!montant) {
      return res.status(400).json({
        success: false,
        error: "Le montant est requis",
      });
    }

    const montantNumber = Number(montant);
    if (isNaN(montantNumber) || montantNumber <= 0) {
      return res.status(400).json({
        success: false,
        error: "Le montant doit être un nombre positif",
      });
    }

    const versement = await versementService.updateVersement(
      parseInt(num_versement),
      montantNumber,
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
    const action_by = req.user.username;

    if (!num_versement) {
      return res.status(400).json({
        success: false,
        error: "Le numéro du versement est requis",
      });
    }

    await versementService.deleteVersement(parseInt(num_versement), action_by);

    res.json({
      success: true,
      message: "Versement supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getVersementsByCompte = async (req, res) => {
  try {
    const { num_compte } = req.params;

    if (!num_compte) {
      return res.status(400).json({
        success: false,
        error: "Le numéro du compte est requis",
      });
    }

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
