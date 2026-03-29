// import { useState } from "react";
// import { getVersements, getClients, addVersement, updateVersement, deleteVersement, type Versement, type Client } from "@/lib/store";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// const VersementTab = () => {
//   const [versements, setVersements] = useState<Versement[]>(getVersements());
//   const [clients] = useState<Client[]>(getClients());
//   const [compteSearch, setCompteSearch] = useState("");
//   const [montant, setMontant] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editMontant, setEditMontant] = useState("");

//   const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");
//   const refresh = () => setVersements(getVersements());

//   const getClientName = (num_compte: number) => {
//     const c = clients.find((cl) => cl.num_compte === num_compte);
//     return c ? `${c.nomclient} (ID :${num_compte})` : `ID :${num_compte}`;
//   };

//   const handleAdd = () => {
//     const compte = parseInt(compteSearch);
//     const m = parseFloat(montant);
//     if (!compte || !m) { toast.error("Compte et montant requis"); return; }
//     if (!clients.find((c) => c.num_compte === compte)) { toast.error("Client introuvable"); return; }
//     addVersement(compte, m, currentUser.username || "admin");
//     setCompteSearch("");
//     setMontant("");
//     refresh();
//     toast.success("Versement ajouté");
//   };

//   const handleDelete = (num: number) => {
//     deleteVersement(num, currentUser.username || "admin");
//     refresh();
//     toast.success("Versement supprimé");
//   };

//   const startEdit = (v: Versement) => {
//     setEditingId(v.num_versement);
//     setEditMontant(v.montant.toString());
//   };

//   const saveEdit = () => {
//     if (editingId === null) return;
//     updateVersement(editingId, parseFloat(editMontant) || 0, currentUser.username || "admin");
//     setEditingId(null);
//     refresh();
//     toast.success("Versement modifié");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-primary mb-4">Versement</h2>

//       <div className="flex items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Numero cheque</span>
//           <Input className="w-40" disabled placeholder="Généré automatique" />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Compte client</span>
//           <Input className="w-48" placeholder="Recherche par nom ou ID" value={compteSearch} onChange={(e) => setCompteSearch(e.target.value)} />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Montant</span>
//           <Input className="w-44" placeholder="Entrer montant de versement" value={montant} onChange={(e) => setMontant(e.target.value)} />
//         </div>
//         <Button onClick={handleAdd} variant="outline" className="border-primary text-primary hover:bg-accent">
//           Ajouter
//         </Button>
//       </div>

//       <h3 className="text-xl font-bold text-primary mb-3">Liste des versements</h3>
//       <div className="border border-border rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-border">
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">N° versement</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">N° cheque</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Compte client</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Montant</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-foreground">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {versements.map((v) => (
//               <tr key={v.num_versement} className="border-b border-border last:border-0">
//                 <td className="py-3 px-4 text-center text-sm text-foreground">{v.num_versement}</td>
//                 <td className="py-3 px-4 text-center text-sm text-foreground">{v.num_cheque}</td>
//                 <td className="py-3 px-4 text-center text-sm text-foreground">
//                   {getClientName(v.num_compte)}
//                 </td>
//                 <td className="py-3 px-4 text-center text-sm text-foreground">
//                   {editingId === v.num_versement ? (
//                     <Input value={editMontant} onChange={(e) => setEditMontant(e.target.value)} className="w-28 inline" />
//                   ) : `${v.montant} Ar`}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   {editingId === v.num_versement ? (
//                     <Button size="sm" onClick={saveEdit} className="bg-success text-success-foreground text-xs mr-2">Sauvegarder</Button>
//                   ) : (
//                     <>
//                       <Button size="sm" variant="outline" className="text-warning border-warning text-xs mr-2" onClick={() => startEdit(v)}>Modifier</Button>
//                       <Button size="sm" variant="outline" className="text-destructive border-destructive text-xs" onClick={() => handleDelete(v.num_versement)}>Supprimer</Button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default VersementTab;

import { useState, useEffect } from "react";
import {
  getVersements,
  addVersement,
  updateVersement,
  deleteVersement,
} from "@/services/versementService";
import { getClients } from "@/services/clientService";
import type { Versement, Client } from "@/lib/type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const VersementTab = () => {
  const [versements, setVersements] = useState<Versement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [compteSearch, setCompteSearch] = useState("");
  const [montant, setMontant] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editMontant, setEditMontant] = useState("");

  const token = JSON.parse(sessionStorage.getItem("currentUser") || "{}").token;

  // 🔄 charger données
  const refresh = async () => {
    try {
      const [vData, cData] = await Promise.all([
        getVersements(token),
        getClients(token),
      ]);
      setVersements(vData);
      setClients(cData);
    } catch (err) {
      toast.error("Erreur chargement données");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  // 🔍 afficher nom client
  const getClientName = (num_compte: number) => {
    const c = clients.find((cl) => cl.num_compte === num_compte);
    return c ? `${c.nomclient} (ID : ${num_compte})` : `ID : ${num_compte}`;
  };

  // ➕ ajouter versement
  const handleAdd = async () => {
    const compte = parseInt(compteSearch);
    const m = parseFloat(montant);

    if (!compte || !m) {
      toast.error("Compte et montant requis");
      return;
    }

    if (!clients.find((c) => c.num_compte === compte)) {
      toast.error("Client introuvable");
      return;
    }

    try {
      await addVersement({ num_compte: compte, montant: m }, token);
      setCompteSearch("");
      setMontant("");
      refresh();
      toast.success("Versement ajouté");
    } catch (err) {
      toast.error("Erreur ajout");
    }
  };

  // ❌ supprimer
  const handleDelete = async (num: number) => {
    try {
      await deleteVersement(num, token);
      refresh();
      toast.success("Versement supprimé");
    } catch (err) {
      toast.error("Erreur suppression");
    }
  };

  // ✏️ commencer modification
  const startEdit = (v: Versement) => {
    setEditingId(v.num_versement);
    setEditMontant(v.montant.toString());
  };

  // 💾 sauvegarder
  const saveEdit = async () => {
    if (editingId === null) return;

    try {
      await updateVersement(
        editingId,
        { montant: parseFloat(editMontant) || 0 },
        token,
      );
      setEditingId(null);
      refresh();
      toast.success("Versement modifié");
    } catch (err) {
      toast.error("Erreur modification");
    }
  };

  // return (
  //   <div className="p-6">
  //     <h2 className="text-2xl font-bold text-primary mb-4">Versement</h2>

  //     {/* FORM */}
  //     <div className="flex items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
  //       <div className="flex items-center gap-2">
  //         <span className="text-sm font-medium">Numero cheque</span>
  //         <Input className="w-40" disabled placeholder="Généré automatique" />
  //       </div>

  //       <div className="flex items-center gap-2">
  //         <span className="text-sm font-medium">Compte client</span>
  //         <Input
  //           className="w-48"
  //           placeholder="Entrer ID client"
  //           value={compteSearch}
  //           onChange={(e) => setCompteSearch(e.target.value)}
  //         />
  //       </div>

  //       <div className="flex items-center gap-2">
  //         <span className="text-sm font-medium">Montant</span>
  //         <Input
  //           className="w-44"
  //           placeholder="Entrer montant"
  //           value={montant}
  //           onChange={(e) => setMontant(e.target.value)}
  //         />
  //       </div>

  //       <Button onClick={handleAdd} variant="outline">
  //         Ajouter
  //       </Button>
  //     </div>

  //     {/* TABLE */}
  //     <h3 className="text-xl font-bold text-primary mb-3">
  //       Liste des versements
  //     </h3>

  //     <div className="border border-border rounded-lg overflow-hidden">
  //       <table className="w-full">
  //         <thead>
  //           <tr className="border-b border-border">
  //             <th className="py-3 px-4 text-left text-sm">N° versement</th>
  //             <th className="py-3 px-4 text-left text-sm">N° cheque</th>
  //             <th className="py-3 px-4 text-left text-sm">Compte client</th>
  //             <th className="py-3 px-4 text-left text-sm">Montant</th>
  //             <th className="py-3 px-4 text-center text-sm">Action</th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {versements.map((v) => (
  //             <tr key={v.num_versement} className="border-b border-border">
  //               <td className="py-3 px-4 text-center">{v.num_versement}</td>

  //               <td className="py-3 px-4 text-center">{v.num_cheque}</td>

  //               <td className="py-3 px-4 text-center">
  //                 {getClientName(v.num_compte)}
  //               </td>

  //               <td className="py-3 px-4 text-center">
  //                 {editingId === v.num_versement ? (
  //                   <Input
  //                     value={editMontant}
  //                     onChange={(e) => setEditMontant(e.target.value)}
  //                     className="w-28 inline"
  //                   />
  //                 ) : (
  //                   `${v.montant} Ar`
  //                 )}
  //               </td>

  //               <td className="py-3 px-4 text-center">
  //                 {editingId === v.num_versement ? (
  //                   <Button size="sm" onClick={saveEdit}>
  //                     Sauvegarder
  //                   </Button>
  //                 ) : (
  //                   <>
  //                     <Button
  //                       size="sm"
  //                       variant="outline"
  //                       className="mr-2"
  //                       onClick={() => startEdit(v)}
  //                     >
  //                       Modifier
  //                     </Button>

  //                     <Button
  //                       size="sm"
  //                       variant="outline"
  //                       onClick={() => handleDelete(v.num_versement)}
  //                     >
  //                       Supprimer
  //                     </Button>
  //                   </>
  //                 )}
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Versement</h2>

      <div className="flex items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Numero cheque
          </span>
          <Input className="w-40" disabled placeholder="Généré automatique" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Compte client
          </span>
          <Input
            className="w-48"
            placeholder="Recherche par nom ou ID"
            value={compteSearch}
            onChange={(e) => setCompteSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Montant</span>
          <Input
            className="w-44"
            placeholder="Entrer montant de versement"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </div>
        <Button
          onClick={handleAdd}
          variant="outline"
          className="border-primary text-primary hover:bg-accent"
        >
          Ajouter
        </Button>
      </div>

      <h3 className="text-xl font-bold text-primary mb-3">
        Liste des versements
      </h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                N° versement
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                N° cheque
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                Compte client
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                Montant
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {versements.map((v) => (
              <tr
                key={v.num_versement}
                className="border-b border-border last:border-0"
              >
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {v.num_versement}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {v.num_cheque}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {getClientName(v.num_compte)}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {editingId === v.num_versement ? (
                    <Input
                      value={editMontant}
                      onChange={(e) => setEditMontant(e.target.value)}
                      className="w-28 inline"
                    />
                  ) : (
                    `${v.montant} Ar`
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {editingId === v.num_versement ? (
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      className="bg-success text-success-foreground text-xs mr-2"
                    >
                      Sauvegarder
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-warning border-warning text-xs mr-2"
                        onClick={() => startEdit(v)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive text-xs"
                        onClick={() => handleDelete(v.num_versement)}
                      >
                        Supprimer
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VersementTab;
