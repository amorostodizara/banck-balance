import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User, Menu } from "lucide-react";
import type { User as UserType } from "@/lib/store";

interface Props {
  user: UserType;
}

const DashboardHeader = ({ user }: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 text-foreground" />
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">BDA</span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="font-bold text-foreground">BDA Project M2</h1>
        <p className="text-xs text-muted-foreground">Dashboard Admin</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold">
            10
          </span>
        </div>
        <span className="text-sm font-medium text-foreground">{user.name}</span>
        <span className="text-xs text-muted-foreground capitalize">{user.username}</span>
        <User className="w-5 h-5 text-foreground" />
        <button onClick={handleLogout} className="text-destructive hover:opacity-80">
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
