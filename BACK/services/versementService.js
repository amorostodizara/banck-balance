const mongoose = require("mongoose");
const Versement = require("../models/Versement");
const Client = require("../models/Client");
const AuditVersement = require("../models/AuditVersement");
const Counter = require("../models/Counter");
class VersementService {
  async addVersement(num_compte, montant, action_by, session) {
    // Vérifier client
    const client = await Client.findOne({ num_compte }).session(session);
    if (!client) throw new Error("Client non trouvé");

    // Counters
    const versementCounter = await Counter.findByIdAndUpdate(
      { _id: "versement" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session },
    );

    const chequeCounter = await Counter.findByIdAndUpdate(
      { _id: "cheque" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session },
    );

    const lastVersement = await Versement.findOne({ num_compte })
      .sort({ num_versement: -1 })
      .session(session);

    const ancien_montant = lastVersement ? lastVersement.montant : 0;

    const versement = new Versement({
      num_compte,
      num_versement: versementCounter.seq + 99,
      num_cheque: chequeCounter.seq + 108,
      montant,
      action_by,
    });

    await versement.save({ session });

    await Client.updateOne(
      { num_compte },
      { $inc: { solde: montant } },
      { session },
    );

    const audit = new AuditVersement({
      type_action: "INSERT",
      num_versement: versement.num_versement,
      num_compte,
      nomclient: client.nomclient,
      montant_ancien: ancien_montant,
      montant_nouv: montant,
      users: action_by,
    });

    await audit.save({ session });

    return versement;
  }

  async updateVersement(num_versement, nouveau_montant, action_by, session) {
    const versement = await Versement.findOne({ num_versement }).session(
      session,
    );
    if (!versement) throw new Error("Versement non trouvé");

    const ancien_montant = versement.montant;
    const difference = nouveau_montant - ancien_montant;

    const client = await Client.findOne({
      num_compte: versement.num_compte,
    }).session(session);

    // ✅ UNE SEULE FOIS
    await Client.updateOne(
      { num_compte: versement.num_compte },
      { $inc: { solde: difference } },
      { session },
    );

    versement.montant = nouveau_montant;
    versement.action_by = action_by;
    await versement.save({ session });

    const audit = new AuditVersement({
      type_action: "UPDATE",
      num_versement: versement.num_versement,
      num_compte: versement.num_compte,
      nomclient: client ? client.nomclient : "",
      montant_ancien: ancien_montant,
      montant_nouv: nouveau_montant,
      users: action_by,
    });

    await audit.save({ session });

    return versement;
  }

  async deleteVersement(num_versement, action_by, session) {
    const versement = await Versement.findOne({ num_versement }).session(
      session,
    );
    if (!versement) throw new Error("Versement non trouvé");

    const client = await Client.findOne({
      num_compte: versement.num_compte,
    }).session(session);

    const audit = new AuditVersement({
      type_action: "DELETE",
      num_versement: versement.num_versement,
      num_compte: versement.num_compte,
      nomclient: client ? client.nomclient : "",
      montant_ancien: versement.montant,
      montant_nouv: 0,
      users: action_by,
    });

    await audit.save({ session });

    // ✅ Mise à jour atomique du solde
    await Client.updateOne(
      { num_compte: versement.num_compte },
      { $inc: { solde: -versement.montant } },
      { session },
    );

    await Versement.deleteOne({ num_versement }).session(session);

    return true;
  }

  async getAllVersements() {
    return await Versement.find().sort({ num_versement: -1 });
  }

  async getVersementById(num_versement) {
    return await Versement.findOne({ num_versement });
  }

  async getVersementsByCompte(num_compte) {
    return await Versement.find({ num_compte }).sort({ num_versement: -1 });
  }
}

module.exports = new VersementService();
