import { useState } from "react";
import { MessageSquare, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onLogin: (userId: string, userName: string) => Promise<void>;
  isConnecting: boolean;
}

export function LoginScreen({ onLogin, isConnecting }: LoginScreenProps) {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");

  const handleLogin = () => {
    if (userId.trim()) {
      onLogin(userId, userName || userId);
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
            Welcome to Promptly
          </h1>
          <p className="text-muted-foreground">
            AI-powered chat and writing assistant
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 input-glow transition-all focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Enter your display name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 rounded-xl border border-border/50 bg-muted/30 text-foreground placeholder:text-muted-foreground/50 input-glow transition-all focus:outline-none"
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={!userId.trim() || isConnecting}
            className={cn(
              "w-full py-6 rounded-xl font-semibold text-base transition-all duration-300",
              "bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]",
              "hover:shadow-xl hover:shadow-[hsl(var(--ai-glow)/0.3)] hover:scale-[1.02]",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            )}
          >
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Join Chat</span>
              </div>
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure • Real-time • AI-Powered
        </p>
      </div>
    </div>
  );
}
