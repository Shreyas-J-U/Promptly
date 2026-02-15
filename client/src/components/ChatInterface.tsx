import "stream-chat-react/dist/css/v2/index.css";
import {
  Zap,
  Search,
  Link,
  ExternalLink,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";
import type { IChatMetadata } from "@/types/chat";

export default function ChatInterface({
  metadata,
}: {
  metadata: IChatMetadata | null;
}) {
  if (!metadata) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center space-y-4 bg-background/50 backdrop-blur-md">
        <div className="p-4 rounded-full bg-muted/20 border border-border/50">
          <Inbox className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground/80">
            No Insights Yet
          </h3>
          <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
            Generate a response to see AI insights and source breakdown.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background/50 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-muted/10">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <Zap className="h-4 w-4 fill-primary" />
          Response Insights
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Resources Used */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Link className="h-3.5 w-3.5" />
            Key Resources
          </div>
          <div className="space-y-2">
            {metadata.sources.length > 0 ? (
              metadata.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-muted/30 border border-border/50 text-xs font-medium flex items-center justify-between hover:bg-muted/50 transition-colors group"
                >
                  <span className="truncate pr-4 group-hover:text-primary transition-colors">
                    {source.title}
                  </span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </a>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground italic px-1">
                No external resources used.
              </p>
            )}
          </div>
        </section>

        {/* Websites Searched */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Search className="h-3.5 w-3.5" />
            Websites Searched
          </div>
          <div className="flex flex-wrap gap-2">
            {metadata.domains.length > 0 ? (
              metadata.domains.map((domain, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[10px] font-semibold text-primary"
                >
                  {domain}
                </span>
              ))
            ) : (
              <p className="text-[10px] text-muted-foreground italic px-1">
                No web search performed.
              </p>
            )}
          </div>
        </section>

        {/* Processing Time */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" />
            Processing Time
          </div>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <span className="text-lg font-bold text-primary">
              {metadata.processingTime}s
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              Generation Speed
            </span>
          </div>
        </section>

        {/* Highlights */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Key Highlights
          </div>
          <div className="space-y-2">
            {metadata.highlights.map((highlight, i) => (
              <div
                key={i}
                className="relative pl-4 text-xs leading-relaxed text-foreground/80 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:bg-primary before:rounded-full"
              >
                {highlight}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 bg-muted/5 border-t border-border/50 text-center">
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
          AI Realtime Analysis
        </p>
      </div>
    </div>
  );
}
