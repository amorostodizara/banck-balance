const Versement = require("../models/Versement");
const Client = require("../models/Client");
const AuditVersement = require("../models/AuditVersement");

class VersementService {
  async addVersement(num_compte, montant, action_by) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Vérifier si le client existe
      const client = await Client.findOne({ num_compte }).session(session);
      if (!client) {
        throw new Error("Client non trouvé");
      }

      // Récupérer le dernier versement du client
      const lastVersement = await Versement.findOne({ num_compte })
        .sort({ num_versement: -1 })
        .session(session);

      const ancien_montant = lastVersement ? lastVersement.montant : 0;

      // Créer le versement
      const versement = new Versement({
        num_compte,
        montant,
        action_by,
      });

      await versement.save({ session });

      // Mettre à jour le solde du client
      client.solde += montant;
      await client.save({ session });

      // Créer l'audit
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

      await session.commitTransaction();
      return versement;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateVersement(num_versement, nouveau_montant, action_by) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const versement = await Versement.findOne({ num_versement }).session(
        session,
      );
      if (!versement) {
        throw new Error("Versement non trouvé");
      }

      const ancien_montant = versement.montant;
      const difference = nouveau_montant - ancien_montant;

      // Mettre à jour le solde du client
      const client = await Client.findOne({
        num_compte: versement.num_compte,
      }).session(session);
      if (client) {
        client.solde += difference;
        await client.save({ session });
      }

      // Mettre à jour le versement
      versement.montant = nouveau_montant;
      versement.action_by = action_by;
      await versement.save({ session });

      // Créer l'audit
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

      await session.commitTransaction();
      return versement;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteVersement(num_versement, action_by) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const versement = await Versement.findOne({ num_versement }).session(
        session,
      );
      if (!versement) {
        throw new Error("Versement non trouvé");
      }

      // Soustraire le montant du solde client
      const client = await Client.findOne({
        num_compte: versement.num_compte,
      }).session(session);
      if (client) {
        client.solde -= versement.montant;
        await client.save({ session });
      }

      // Créer l'audit avant suppression
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

      // Supprimer le versement
      await Versement.deleteOne({ num_versement }).session(session);

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
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
