const mongoose = require("mongoose");

const auditVersementSchema = new mongoose.Schema(
  {
    type_action: {
      type: String,
      enum: ["INSERT", "UPDATE", "DELETE"],
      required: true,
    },
    date_operation: {
      type: Date,
      default: Date.now,
    },
    num_versement: {
      type: Number,
      required: true,
    },
    num_compte: {
      type: Number,
      required: true,
    },
    nomclient: {
      type: String,
      required: true,
    },
    montant_ancien: {
      type: Number,
      default: 0,
    },
    montant_nouv: {
      type: Number,
      default: 0,
    },
    users: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index pour améliorer les performances des requêtes
auditVersementSchema.index({ date_operation: -1 });
auditVersementSchema.index({ num_compte: 1 });
auditVersementSchema.index({ type_action: 1 });

module.exports = mongoose.model("AuditVersement", auditVersementSchema);
