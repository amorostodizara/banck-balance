import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate } from "@/lib/store";
import { User, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = authenticate(username, password);
    if (user) {
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/dashboard");
    } else {
      toast.error("Identifiants incorrects");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex w-full max-w-4xl items-center gap-16 px-8">
        {/* Left illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-52 h-40 bg-muted rounded-2xl shadow-lg flex flex-col items-center justify-center gap-3">
                <div className="w-36 h-3 rounded-full bg-primary" />
                <div className="w-36 h-3 rounded-full border-2 border-secondary flex items-center px-2">
                  <span className="text-secondary text-xs tracking-widest">*******</span>
                </div>
              </div>
            </div>
            <Lock className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 max-w-sm">
          <h1 className="text-3xl font-bold mb-8">
            <span className="text-primary">Con</span>
            <span className="text-secondary">nexion</span>
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-primary font-semibold text-lg block mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Entrer votre adresse email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-primary font-semibold text-lg block mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  type="password"
                  placeholder="Entrer le mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground"
            >
              se connecter
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
