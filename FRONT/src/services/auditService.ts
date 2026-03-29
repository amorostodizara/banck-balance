import axios from "axios";
import { AuditVersement } from "@/lib/type";

const API = "http://localhost:5000/api/audits";

// ✅ GET ALL AUDITS
export const getAudits = async (token: string): Promise<AuditVersement[]> => {
  const res = await axios.get(API, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// ✅ GET STATS
export const getAuditStats = async (token: string) => {
  const res = await axios.get(`${API}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
