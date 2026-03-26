const mongoose = require("mongoose");

const versementSchema = new mongoose.Schema(
  {
    num_versement: {
      type: Number,
      unique: true,
    },
    num_cheque: {
      type: Number,
      unique: true,
    },
    num_compte: {
      type: Number,
      ref: "Client",
      required: true,
    },
    montant: {
      type: Number,
      required: true,
      min: 0,
    },
    action_by: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-increment pour num_versement et num_cheque
versementSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastVersement = await mongoose
      .model("Versement")
      .findOne()
      .sort("-num_versement");
    this.num_versement = lastVersement ? lastVersement.num_versement + 1 : 100;

    const lastCheque = await mongoose
      .model("Versement")
      .findOne()
      .sort("-num_cheque");
    this.num_cheque = lastCheque ? lastCheque.num_cheque + 1 : 109;
  }
  next();
});

module.exports = mongoose.model("Versement", versementSchema);
