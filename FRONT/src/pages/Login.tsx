import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { authenticate } from "@/lib/store";
import { User, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login } from "@/services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const user = authenticate(username, password);
  //   if (user) {
  //     sessionStorage.setItem("currentUser", JSON.stringify(user));
  //     navigate("/dashboard");
  //   } else {
  //     toast.error("Identifiants incorrects");
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      // stocker user + token
      sessionStorage.setItem("currentUser", JSON.stringify(data));
      toast.success("Connexion réussie");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Identifiants incorrects");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex w-full max-w-4xl items-center gap-16 px-8">
        {/* Illustration 3D simulée */}
        <div className="hidden flex-1 md:flex justify-center relative">
          <div className="w-80 h-80 bg-blue-50 rounded-3xl shadow-2xl flex items-center justify-center transform -rotate-3 transition-all hover:rotate-0 duration-500">
            <div className="text-center p-6">
              <div className="relative inline-block">
                <div className="w-40 h-52 bg-white rounded-xl shadow-lg border-2 border-blue-100 flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-4 bg-primary rounded-full"></div>
                  <div className="w-24 h-4 bg-yellow-400 rounded-full"></div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-blue-200 rounded-full"
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="absolute -top-10 -right-6 w-20 h-20 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <Lock className="text-white w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex-1 max-w-sm">
          <h1 className="text-3xl font-bold mb-8 text-center">
            <span className="text-primary bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">
              Connexion
            </span>
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
