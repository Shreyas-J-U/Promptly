import { MessageSquare, Plus, Sparkles, LogOut, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface SidebarProps {
  collapsed: boolean;
  userProfile?: any;
  onLogout: () => void;
  onNewConversation: () => void;
  onSelectHistory: (data: any) => void;
}

export function Sidebar({
  collapsed,
  userProfile,
  onLogout,
  onNewConversation,
  onSelectHistory,
}: SidebarProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!userProfile?.userId) return;
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:3000"
          }/api/history/${userProfile.userId}`,
        );
        const data = await res.json();
        if (res.ok) setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000); // Polling for updates
    return () => clearInterval(interval);
  }, [userProfile?.userId]);

  return (
    <div className="flex h-full flex-col bg-background/80 backdrop-blur-xl border-r border-border/50">
      {/* Header & Logo */}
      <div className="p-6">
        <div
          className={cn(
            "flex items-center gap-3 mb-8",
            collapsed && "justify-center mb-6",
          )}
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] shadow-lg shadow-[hsl(var(--ai-glow)/0.2)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold gradient-text tracking-tight">
                Promptly
              </h1>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                AI Workspace
              </span>
            </div>
          )}
        </div>

        {/* New Conversation Button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onNewConversation}
                className={cn(
                  "w-full rounded-xl font-bold text-sm transition-all duration-300 group",
                  "bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]",
                  "hover:shadow-xl hover:shadow-[hsl(var(--ai-glow)/0.3)] hover:scale-[1.02]",
                  collapsed ? "px-0 h-12" : "py-6",
                )}
              >
                <Plus
                  className={cn("h-5 w-5 text-white", !collapsed && "mr-2")}
                />
                {!collapsed && <span>New Conversation</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="font-bold">
                New Conversation
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Navigation / History */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
        <div>
          {!collapsed && (
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Recent History
              </h2>
            </div>
          )}

          <div className="space-y-1">
            {history.map((item) => (
              <TooltipProvider key={item._id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onSelectHistory(item)}
                      className={cn(
                        "w-full group transition-all duration-200 flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1",
                        "hover:bg-muted/50 border border-transparent",
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <Clock
                        className={cn(
                          "h-4 w-4 transition-colors shrink-0 text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {!collapsed && (
                        <span
                          className={cn(
                            "flex-1 truncate text-left text-sm font-medium text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          {item.prompt}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="font-medium">
                      <p>{item.prompt}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Profile */}
      <div className="p-4 mt-auto border-t border-border/50 bg-muted/5">
        <div
          className={cn(
            "flex items-center gap-3 p-2 rounded-2xl transition-all",
            collapsed ? "justify-center" : "bg-muted/30",
          )}
        >
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 ring-2 ring-background border border-primary/10">
              <AvatarImage src={userProfile?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] text-white text-xs font-bold">
                {userProfile?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background shadow-sm" />
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">
                {userProfile?.name || "User"}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium">
                Pro Account
              </p>
            </div>
          )}

          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="h-8 w-8 rounded-lg hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!collapsed && (
          <div className="mt-4 flex items-center justify-between px-2">
            <ThemeToggle />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              v1.0.4
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
