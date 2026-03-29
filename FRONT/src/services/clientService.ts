import axios from "axios";
import { Client } from "@/lib/type";

const BASE_URL = "http://localhost:5000/api/clients";

// Récupérer tous les clients
export const getClients = async (token: string): Promise<Client[]> => {
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data; // backend -> { success, data: [...] }
};

// Ajouter un client
export const addClient = async (
  client: Omit<Client, "num_compte">,
  token: string,
) => {
  const res = await axios.post(BASE_URL, client, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Modifier un client
export const updateClient = async (
  num_compte: number,
  client: Partial<Client>,
  token: string,
) => {
  const res = await axios.put(`${BASE_URL}/${num_compte}`, client, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Supprimer un client
export const deleteClient = async (num_compte: number, token: string) => {
  const res = await axios.delete(`${BASE_URL}/${num_compte}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.success;
};
