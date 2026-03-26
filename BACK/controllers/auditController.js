const AuditVersement = require("../models/AuditVersement");

exports.getAudits = async (req, res) => {
  try {
    const { limit = 100, type_action, num_compte } = req.query;

    let query = {};
    if (type_action) query.type_action = type_action;
    if (num_compte) query.num_compte = parseInt(num_compte);

    const audits = await AuditVersement.find(query)
      .sort({ date_operation: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: audits,
      count: audits.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAuditById = async (req, res) => {
  try {
    const { id } = req.params;
    const audit = await AuditVersement.findById(id);

    if (!audit) {
      return res.status(404).json({
        success: false,
        error: "Audit non trouvé",
      });
    }

    res.json({
      success: true,
      data: audit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAuditsByVersement = async (req, res) => {
  try {
    const { num_versement } = req.params;
    const audits = await AuditVersement.find({
      num_versement: parseInt(num_versement),
    }).sort({ date_operation: -1 });

    res.json({
      success: true,
      data: audits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAuditStats = async (req, res) => {
  try {
    const stats = await AuditVersement.aggregate([
      {
        $group: {
          _id: "$type_action",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
