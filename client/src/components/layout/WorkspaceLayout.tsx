import { useState } from "react";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkspaceLayoutProps {
  sidebar: React.ReactNode;
  main: React.ReactNode;
  assistant: React.ReactNode;
}

export function WorkspaceLayout({
  sidebar,
  main,
  assistant,
}: WorkspaceLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [assistantCollapsed, setAssistantCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Left Sidebar */}
      <div
        className={cn(
          "relative flex flex-col border-r border-border/50 bg-[hsl(var(--sidebar-bg))] backdrop-blur-xl transition-all duration-300 ease-out",
          sidebarCollapsed ? "w-[72px]" : "w-72",
        )}
      >
        {sidebar}

        {/* Collapse Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-3.5 top-6 z-20 h-7 w-7 rounded-full border border-border/50 bg-background shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Main Content - Chat */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-muted/10 pointer-events-none" />
        {main}
      </div>

      {/* Right Panel - AI Assistant */}
      <div
        className={cn(
          "relative flex flex-col border-l border-border/50 bg-gradient-to-b from-background to-muted/20 backdrop-blur-xl transition-all duration-300 ease-out",
          assistantCollapsed ? "w-0 opacity-0" : "w-[420px]",
        )}
      >
        {!assistantCollapsed && assistant}

        {/* Collapse Button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute -left-3.5 top-6 z-20 h-7 w-7 rounded-full border border-border/50 bg-background shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          onClick={() => setAssistantCollapsed(!assistantCollapsed)}
        >
          {assistantCollapsed ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Floating button to reopen assistant when collapsed */}
      {assistantCollapsed && (
        <Button
          className="fixed right-6 bottom-6 h-14 w-14 rounded-2xl shadow-2xl btn-primary-glow bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] hover:scale-105 transition-all duration-200 animate-scale-in"
          onClick={() => setAssistantCollapsed(false)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
}
