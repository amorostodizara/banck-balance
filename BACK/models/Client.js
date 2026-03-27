const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    num_compte: {
      type: Number,
      unique: true,
      immutable: true,
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
    let isUnique = false;

    while (!isUnique) {
      const lastClient = await mongoose
        .model("Client")
        .findOne()
        .sort("-num_compte");

      const newNum = lastClient ? lastClient.num_compte + 1 : 10;

      const exists = await mongoose
        .model("Client")
        .findOne({ num_compte: newNum });

      if (!exists) {
        this.num_compte = newNum;
        isUnique = true;
      }
    }
  }
  next();
});

module.exports = mongoose.model("Client", clientSchema);
