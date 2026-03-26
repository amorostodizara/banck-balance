import { useState } from "react";
import { getAudits, type AuditVersement } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const AuditTab = () => {
  const [audits] = useState<AuditVersement[]>(getAudits());

  const inserts = audits.filter((a) => a.type_action === "INSERT").length;
  const updates = audits.filter((a) => a.type_action === "UPDATE").length;
  const deletes = audits.filter((a) => a.type_action === "DELETE").length;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  const actionColor = (type: string) => {
    switch (type) {
      case "INSERT": return "bg-success text-success-foreground";
      case "UPDATE": return "bg-warning text-warning-foreground";
      case "DELETE": return "bg-destructive text-destructive-foreground";
      default: return "";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-primary mb-4">Audit versement</h2>

      <div className="flex items-center gap-8 mb-6 p-4 bg-card rounded-lg border border-border">
        <span className="text-sm text-foreground">
          Nombre insertions : <strong className="text-lg text-foreground">{String(inserts).padStart(2, "0")}</strong>
        </span>
        <span className="text-sm text-foreground">
          Nombre modifications : <strong className="text-lg text-warning">{String(updates).padStart(2, "0")}</strong>
        </span>
        <span className="text-sm text-foreground">
          Nombre suppressions : <strong className="text-lg text-destructive">{String(deletes).padStart(2, "0")}</strong>
        </span>
      </div>

      <h3 className="text-xl font-bold text-primary mb-3">Audit des opérations versement</h3>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Action", "Date", "N° Versement", "N° compte", "Client", "Ancien montant", "Nouveau montant", "Utilisateur"].map((h) => (
                <th key={h} className="py-3 px-3 text-left text-sm font-semibold text-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {audits.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="py-3 px-3">
                  <Badge className={`${actionColor(a.type_action)} text-xs`}>{a.type_action}</Badge>
                </td>
                <td className="py-3 px-3 text-sm text-foreground">{formatDate(a.date_operation)}</td>
                <td className="py-3 px-3 text-sm text-center text-foreground">{a.num_versement}</td>
                <td className="py-3 px-3 text-sm text-center text-foreground">{a.num_compte}</td>
                <td className="py-3 px-3 text-sm text-foreground">{a.nomclient}</td>
                <td className="py-3 px-3 text-sm text-foreground">{a.montant_ancien} Ar</td>
                <td className="py-3 px-3 text-sm text-foreground">{a.montant_nouv} Ar</td>
                <td className="py-3 px-3">
                  <Badge variant="outline" className="text-xs capitalize">{a.users}</Badge>
                </td>
              </tr>
            ))}
            {audits.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">Aucune opération d'audit</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTab;
