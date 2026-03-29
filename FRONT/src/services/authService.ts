import axios from "axios";
import { CurrentUser } from "@/lib/type";

export const login = async (
  username: string,
  password: string,
): Promise<CurrentUser> => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      username,
      password,
    });

    // Axios met déjà la réponse dans res.data
    const data = res.data; // { success: true, data: { user, token } }

    sessionStorage.setItem("currentUser", JSON.stringify(data.data));

    return data.data;
  } catch (error: any) {
    // Gestion simple des erreurs
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const getCurrentUser = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/auth/me", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store", // pour éviter le 304
  });

  if (!res.ok) throw new Error("Unauthorized");

  const data = await res.json();
  // data = { success: true, data: { user: {...}, token: "..." } }

  return data.data.user; // <-- pas res.data.data.user
};
