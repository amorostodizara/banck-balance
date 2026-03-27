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
    const Counter = mongoose.model("Counter");

    const versementCounter = await Counter.findOneAndUpdate(
      { _id: "versement" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.num_versement = versementCounter.seq;

    const chequeCounter = await Counter.findOneAndUpdate(
      { _id: "cheque" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    );
    this.num_cheque = chequeCounter.seq;
  }
  next();
});

module.exports = mongoose.model("Versement", versementSchema);
