import { useEffect, useState, type ReactNode } from "react";
import { ShieldCheck, LogOut } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "deere-admin-unlocked";
const ADMIN_PASSWORD = "Admin@2026"; // Senha de acesso ao painel ADM

interface AdminGateProps {
  children: ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {}
    setChecking(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setUnlocked(true);
      toast.success("Acesso ADM liberado.");
    } else {
      toast.error("Senha incorreta.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    setUnlocked(false);
    setPassword("");
  };

  if (checking) return null;

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-card border border-border rounded-xl p-6 shadow-lg space-y-5"
        >
          <div className="flex flex-col items-center text-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Acesso Restrito</h1>
            <p className="text-sm text-muted-foreground">
              Esta área é exclusiva do administrador. Informe a senha para continuar.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Senha de ADM</label>
            <input
              type="password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 font-semibold transition-colors"
          >
            Entrar como ADM
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Senha padrão pode ser alterada em <code className="px-1 bg-secondary rounded">src/components/AdminGate.tsx</code>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleLogout}
        title="Sair do modo ADM"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-full text-xs font-semibold shadow-lg border border-destructive/20"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sair ADM
      </button>
      {children}
    </div>
  );
}