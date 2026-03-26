const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    num_compte: {
      type: Number,
      unique: true,
      required: true,
    },
    nomclient: {
      type: String,
      required: true,
      trim: true,
    },
    solde: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-increment pour num_compte
clientSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastClient = await mongoose
      .model("Client")
      .findOne()
      .sort("-num_compte");
    this.num_compte = lastClient ? lastClient.num_compte + 1 : 10;
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);
