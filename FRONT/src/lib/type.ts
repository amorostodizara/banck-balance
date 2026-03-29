export type CurrentUser = {
  _id: string;
  name: string;
  username: string;
  role: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
  token: string;
};

export type Client = {
  num_compte: number; // obligatoire pour update/delete
  nomclient: string;
  solde: number;
  createdAt?: string;
  updatedAt?: string;
};

export interface Versement {
  num_versement: number;
  num_cheque: number;
  num_compte: number;
  montant: number;
}

export interface AuditVersement {
  id: number;
  type_action: "INSERT" | "UPDATE" | "DELETE";
  date_operation: string;
  num_versement: number;
  num_compte: number;
  nomclient: string;
  montant_ancien: number;
  montant_nouv: number;
  users: string;
}
