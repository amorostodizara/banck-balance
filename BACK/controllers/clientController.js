const Client = require("../models/Client");

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ num_compte: 1 });
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getClientById = async (req, res) => {
  try {
    // const { num_compte } = req.params;
    // const client = await Client.findOne({ num_compte });
    const num_compte = parseInt(req.params.num_compte, 10);
    const client = await Client.findOne({ num_compte });
    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addClient = async (req, res) => {
  try {
    const { nomclient, solde = 0 } = req.body;

    const client = new Client({ nomclient, solde });
    await client.save();

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// exports.updateClient = async (req, res) => {
//   try {
//     const { nomclient, solde } = req.body;

//     const num_compte = parseInt(req.params.num_compte, 10);

//     const client = await Client.findOneAndUpdate(
//       { num_compte },
//       { nomclient, solde },
//       { new: true, runValidators: true },
//     );

//     if (!client) {
//       return res.status(404).json({
//         success: false,
//         error: "Client non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       data: client,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

exports.updateClient = async (req, res) => {
  try {
    const { nomclient, solde } = req.body;

    // Convertir num_compte en Number
    const num_compte = parseInt(req.params.num_compte, 10);

    // Mise à jour du client
    const client = await Client.findOneAndUpdate(
      { num_compte },
      {
        nomclient,
        solde: solde !== undefined ? solde : 0, // jamais undefined
      },
      { new: true, runValidators: true },
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    // Convertir num_compte en Number
    const num_compte = parseInt(req.params.num_compte, 10);

    // Vérifier si le client a des versements
    const Versement = require("../models/Versement");
    const versements = await Versement.findOne({ num_compte });

    if (versements) {
      return res.status(400).json({
        success: false,
        error: "Impossible de supprimer un client qui a des versements",
      });
    }

    // Suppression du client
    const result = await Client.deleteOne({ num_compte });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Client non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Client supprimé avec succès",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// exports.deleteClient = async (req, res) => {
//   try {
//     const { num_compte } = req.params;

//     // Vérifier si le client a des versements
//     const Versement = require("../models/Versement");
//     const versements = await Versement.findOne({ num_compte });

//     if (versements) {
//       return res.status(400).json({
//         success: false,
//         error: "Impossible de supprimer un client qui a des versements",
//       });
//     }

//     const result = await Client.deleteOne({ num_compte });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         error: "Client non trouvé",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Client supprimé avec succès",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
