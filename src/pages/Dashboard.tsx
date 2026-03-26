import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import ClientTab from "@/components/ClientTab";
import VersementTab from "@/components/VersementTab";
import AuditTab from "@/components/AuditTab";
import type { User } from "@/lib/store";

type Tab = "client" | "versement" | "audit";

const Dashboard = () => {
  const [tab, setTab] = useState<Tab>("client");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("currentUser");
    if (!raw) { navigate("/"); return; }
    setUser(JSON.parse(raw));
  }, [navigate]);

  if (!user) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "client", label: "Client" },
    { key: "versement", label: "Versement" },
    { key: "audit", label: "Audit Versement" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} />

      <nav className="flex justify-center gap-8 py-4 bg-muted border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-sm font-medium transition-colors ${
              tab === t.key ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto">
        {tab === "client" && <ClientTab />}
        {tab === "versement" && <VersementTab />}
        {tab === "audit" && <AuditTab />}
      </main>
    </div>
  );
};

export default Dashboard;
