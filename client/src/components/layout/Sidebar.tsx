import { Hash, Plus, Sparkles, LogOut } from "lucide-react";
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
import { ChannelList, useChatContext } from "stream-chat-react";
import { useMemo } from "react";

interface SidebarProps {
  collapsed: boolean;
  userProfile?: any;
  onLogout: () => void;
  onCreateChannel: () => void;
}

export function Sidebar({
  collapsed,
  userProfile,
  onLogout,
  onCreateChannel,
}: SidebarProps) {
  const { client } = useChatContext();

  const filters = useMemo(
    () => ({
      type: "messaging",
      members: { $in: [client.userID || ""] },
    }),
    [client.userID],
  );

  const sort = { last_message_at: -1 } as const;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">Promptly</h1>
          </div>
        ) : (
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] mx-auto">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        )}
        {!collapsed && <ThemeToggle />}
      </div>

      {/* Channels */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Create Channel Button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  "w-full mb-4 rounded-xl font-semibold transition-all duration-200",
                  "bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]",
                  "hover:shadow-lg hover:shadow-[hsl(var(--ai-glow)/0.2)] hover:scale-[1.02]",
                  collapsed && "px-0",
                )}
                onClick={onCreateChannel}
              >
                <Plus className="h-4 w-4" />
                {!collapsed && (
                  <span className="ml-2 text-white">New Channel</span>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>New Channel</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Channel List */}
        <div className="space-y-1">
          {!collapsed && (
            <h2 className="mb-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
              Channels
            </h2>
          )}

          <ChannelList
            filters={filters}
            sort={sort}
            Preview={(props) => (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => props.setActiveChannel?.(props.channel)}
                      className={cn(
                        "sidebar-item w-full group transition-all duration-200 flex items-center gap-3 px-3 py-2 rounded-xl mb-1",
                        props.active ? "active shadow-sm" : "hover:bg-muted/50",
                        collapsed && "justify-center px-2",
                      )}
                    >
                      <Hash
                        className={cn(
                          "h-4 w-4 transition-colors",
                          props.active
                            ? "text-white"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {!collapsed && (
                        <>
                          <span
                            className={cn(
                              "flex-1 truncate text-left font-medium",
                              props.active ? "text-white" : "text-foreground",
                            )}
                          >
                            {(props.channel.data as any)?.name || "Untitled"}
                          </span>
                          {props.unread && props.unread > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-bold text-primary">
                              {props.unread}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="font-medium">
                      <p>{(props.channel.data as any)?.name || "Untitled"}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          />
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-border/50 p-3">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-all cursor-pointer",
                  collapsed && "justify-center",
                )}
              >
                <div className="relative">
                  <Avatar className="h-9 w-9 ring-2 ring-background shadow-md border-2 border-primary/10">
                    <AvatarImage src={userProfile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] text-white font-semibold">
                      {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background shadow-sm" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {userProfile?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                )}
                {!collapsed && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onLogout}
                      className="h-8 w-8 rounded-lg hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>{userProfile?.name || "User"} - Online</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Stats on hover or expanded */}
        {!collapsed && userProfile?.metadata && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-muted/30 p-2 rounded-lg text-center backdrop-blur-sm">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">
                Sessions
              </p>
              <p className="text-xs font-bold">
                {userProfile.metadata.totalSessions}
              </p>
            </div>
            <div className="bg-muted/30 p-2 rounded-lg text-center backdrop-blur-sm">
              <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-tighter">
                Channels
              </p>
              <p className="text-xs font-bold">
                {userProfile.metadata.totalChannels || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
