import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Menu } from "lucide-react";
// import { CurrentUser } from "@/lib/type";
import { User as UserType } from "@/lib/store";
import { getAudits, getAuditStats } from "@/services/auditService";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// interface Props {
//   user: CurrentUser;
// }
interface Props {
  user: UserType;
}
const DashboardHeader = ({ user }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  const [stats, setStats] = useState({
    inserts: 0,
    updates: 0,
    deletes: 0,
  });

  const total = stats.inserts + stats.updates + stats.deletes;

  const token = JSON.parse(sessionStorage.getItem("currentUser") || "{}").token;

  const refresh = async () => {
    try {
      const auditStats = await getAuditStats(token);

      // auditStats est un tableau : [{_id: "INSERT", count: 4}, ...]
      const statsObj = { inserts: 0, updates: 0, deletes: 0 };
      auditStats.forEach((item: any) => {
        if (item._id === "INSERT") statsObj.inserts = item.count;
        if (item._id === "UPDATE") statsObj.updates = item.count;
        if (item._id === "DELETE") statsObj.deletes = item.count;
      });

      setStats(statsObj);
    } catch (err) {
      toast.error("Erreur chargement audit");
    }
  };

  useEffect(() => {
    // appeler immédiatement
    refresh();
    const interval = setInterval(() => {
      refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 text-foreground" />
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">ENI</span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-bold text-foreground">
          Bases de Données Administration M2
        </h1>
        <p className="text-sm text-muted-foreground">Dashboard Admin</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            {total}
          </span>
        </div>
        <span className="text-sm font-medium text-foreground">
          {user?.name || " Loading..."}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {user?.username || "Loading..."}
        </span>
        <User className="w-5 h-5 text-foreground" />
        <button
          onClick={handleLogout}
          className="text-destructive hover:opacity-80"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
