import { useState } from "react";
import { MessageSquare, Users, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onLogin: (
    userId: string,
    userName: string,
    password: string,
    isRegistering: boolean,
  ) => Promise<void>;
  isConnecting: boolean;
}

export function LoginScreen({ onLogin, isConnecting }: LoginScreenProps) {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = () => {
    if (userId.trim() && password.trim()) {
      onLogin(userId, userName || userId, password, isRegistering);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-8">
      <div className="glass-card p-8 rounded-3xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] shadow-xl shadow-[hsl(var(--ai-glow)/0.3)] mb-4">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isRegistering
              ? "Join Promptly to start chatting"
              : "Login to your account"}
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block px-1">
              User ID
            </label>
            <input
              type="text"
              placeholder="Unique username"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/40 input-glow transition-all focus:outline-none text-sm"
            />
          </div>

          {isRegistering && (
            <div className="animate-fade-in">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block px-1">
                Display Name
              </label>
              <input
                type="text"
                placeholder="How others see you"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/40 input-glow transition-all focus:outline-none text-sm"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block px-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/20 text-foreground placeholder:text-muted-foreground/40 input-glow transition-all focus:outline-none text-sm"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!userId.trim() || !password.trim() || isConnecting}
            className={cn(
              "w-full py-6 rounded-xl font-bold text-sm transition-all duration-300 mt-2",
              "bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]",
              "hover:shadow-xl hover:shadow-[hsl(var(--ai-glow)/0.3)] hover:scale-[1.02]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            )}
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Authentication...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isRegistering ? (
                  <Sparkles className="h-4 w-4 text-white" />
                ) : (
                  <Users className="h-4 w-4 text-white" />
                )}
                <span>{isRegistering ? "Register" : "Login"}</span>
              </div>
            )}
          </Button>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {isRegistering
                ? "Already have an account? Login here"
                : "Don't have an account? Register here"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Secure Enterprise Protocol
        </p>
      </div>
    </div>
  );
}
