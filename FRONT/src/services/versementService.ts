import axios from "axios";
import { Versement } from "@/lib/type";

const API = "http://localhost:5000/api/versements";

// ✅ GET ALL
export const getVersements = async (token: string): Promise<Versement[]> => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ GET PAR COMPTE
export const getVersementsByCompte = async (
  num_compte: number,
  token: string,
): Promise<Versement[]> => {
  const res = await axios.get(`${API}/compte/${num_compte}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ ADD
export const addVersement = async (
  versement: { num_compte: number; montant: number },
  token: string,
) => {
  const res = await axios.post(API, versement, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ UPDATE (⚠️ num_versement)
export const updateVersement = async (
  num_versement: number,
  versement: { montant: number },
  token: string,
) => {
  const res = await axios.put(`${API}/${num_versement}`, versement, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ DELETE (⚠️ num_versement)
export const deleteVersement = async (num_versement: number, token: string) => {
  const res = await axios.delete(`${API}/${num_versement}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.success;
};
