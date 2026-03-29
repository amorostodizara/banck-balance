// import { useState } from "react";
// import { getClients, addClient, updateClient, deleteClient, type Client } from "@/lib/store";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// const ClientTab = () => {
//   const [clients, setClients] = useState<Client[]>(getClients());
//   const [nomclient, setNomclient] = useState("");
//   const [solde, setSolde] = useState("");
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [editNom, setEditNom] = useState("");
//   const [editSolde, setEditSolde] = useState("");

//   const refresh = () => setClients(getClients());

//   const handleAdd = () => {
//     if (!nomclient.trim()) { toast.error("Nom client requis"); return; }
//     addClient(nomclient.trim(), parseFloat(solde) || 0);
//     setNomclient("");
//     setSolde("");
//     refresh();
//     toast.success("Client ajouté");
//   };

//   const handleDelete = (num: number) => {
//     deleteClient(num);
//     refresh();
//     toast.success("Client supprimé");
//   };

//   const startEdit = (c: Client) => {
//     setEditingId(c.num_compte);
//     setEditNom(c.nomclient);
//     setEditSolde(c.solde.toString());
//   };

//   const saveEdit = () => {
//     if (editingId === null) return;
//     updateClient(editingId, editNom, parseFloat(editSolde) || 0);
//     setEditingId(null);
//     refresh();
//     toast.success("Client modifié");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-primary mb-4">Clients</h2>

//       <div className="flex items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Numero compte</span>
//           <Input className="w-40" disabled placeholder="Généré automatique" />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Nom client</span>
//           <Input className="w-44" placeholder="Nom client" value={nomclient} onChange={(e) => setNomclient(e.target.value)} />
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm font-medium text-foreground">Solde</span>
//           <Input className="w-36" placeholder="Solde initiale 0" value={solde} onChange={(e) => setSolde(e.target.value)} />
//         </div>
//         <Button onClick={handleAdd} variant="outline" className="border-primary text-primary hover:bg-accent">
//           Ajouter
//         </Button>
//       </div>

//       <h3 className="text-xl font-bold text-primary mb-3">Liste des clients</h3>
//       <div className="border border-border rounded-lg overflow-hidden">
//         <table className="w-full">
//           <thead>
//             <tr className="border-b border-border">
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">numero compte</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Nom client</th>
//               <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">Solde client</th>
//               <th className="py-3 px-4 text-center text-sm font-semibold text-foreground">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {clients.map((c) => (
//               <tr key={c.num_compte} className="border-b border-border last:border-0">
//                 <td className="py-3 px-4 text-center text-sm text-foreground">{c.num_compte}</td>
//                 <td className="py-3 px-4 text-center text-sm text-foreground">
//                   {editingId === c.num_compte ? (
//                     <Input value={editNom} onChange={(e) => setEditNom(e.target.value)} className="w-40 inline" />
//                   ) : c.nomclient}
//                 </td>
//                 <td className="py-3 px-4 text-center text-sm text-foreground">
//                   {editingId === c.num_compte ? (
//                     <Input value={editSolde} onChange={(e) => setEditSolde(e.target.value)} className="w-28 inline" />
//                   ) : c.solde}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   {editingId === c.num_compte ? (
//                     <Button size="sm" onClick={saveEdit} className="bg-success text-success-foreground text-xs mr-2">Sauvegarder</Button>
//                   ) : (
//                     <>
//                       <Button size="sm" variant="outline" className="text-warning border-warning text-xs mr-2" onClick={() => startEdit(c)}>Modifier</Button>
//                       <Button size="sm" variant="outline" className="text-destructive border-destructive text-xs" onClick={() => handleDelete(c.num_compte)}>Supprimer</Button>
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

// export default ClientTab;
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getClients,
  addClient,
  updateClient,
  deleteClient,
} from "@/services/clientService";
import { Client } from "@/lib/type";

const ClientTab = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [nomclient, setNomclient] = useState("");
  const [solde, setSolde] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNom, setEditNom] = useState("");
  const [editSolde, setEditSolde] = useState("");

  const token = JSON.parse(sessionStorage.getItem("currentUser") || "{}").token;

  const refresh = async () => {
    try {
      const data = await getClients(token);
      setClients(data);
    } catch (err) {
      toast.error("Impossible de récupérer les clients");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = async () => {
    if (!nomclient.trim()) {
      toast.error("Nom client requis");
      return;
    }
    try {
      await addClient({ nomclient, solde: parseFloat(solde) || 0 }, token);
      setNomclient("");
      setSolde("");
      refresh();
      toast.success("Client ajouté");
    } catch (err) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (num_compte: number) => {
    try {
      await deleteClient(num_compte, token);
      refresh();
      toast.success("Client supprimé");
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const startEdit = (c: Client) => {
    if (!c.num_compte) return;
    setEditingId(c.num_compte);
    setEditNom(c.nomclient);
    setEditSolde(c.solde.toString());
  };

  const saveEdit = async () => {
    if (editingId === null) return;
    try {
      await updateClient(
        editingId,
        { nomclient: editNom, solde: parseFloat(editSolde) || 0 },
        token,
      );
      setEditingId(null);
      refresh();
      toast.success("Client modifié");
    } catch (err) {
      toast.error("Erreur lors de la modification");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Clients</h2>

      <div className="flex items-center gap-4 mb-6 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Numero compte
          </span>
          <Input className="w-40" disabled placeholder="Généré automatique" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Nom client
          </span>
          <Input
            className="w-44"
            placeholder="Nom client"
            value={nomclient}
            onChange={(e) => setNomclient(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Solde</span>
          <Input
            className="w-36"
            placeholder="Solde initiale 0"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
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

      <h3 className="text-xl font-bold text-primary mb-3">Liste des clients</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                numero compte
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                Nom client
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-foreground">
                Solde client
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr
                key={c.num_compte}
                className="border-b border-border last:border-0"
              >
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {c.num_compte}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {editingId === c.num_compte ? (
                    <Input
                      value={editNom}
                      onChange={(e) => setEditNom(e.target.value)}
                      className="w-40 inline"
                    />
                  ) : (
                    c.nomclient
                  )}
                </td>
                <td className="py-3 px-4 text-center text-sm text-foreground">
                  {editingId === c.num_compte ? (
                    <Input
                      value={editSolde}
                      onChange={(e) => setEditSolde(e.target.value)}
                      className="w-28 inline"
                    />
                  ) : (
                    c.solde
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {editingId === c.num_compte ? (
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
                        onClick={() => startEdit(c)}
                      >
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive text-xs"
                        onClick={() => handleDelete(c.num_compte)}
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

export default ClientTab;
