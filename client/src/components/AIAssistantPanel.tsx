import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Copy,
  RotateCw,
  Search,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const WRITING_PROMPTS = [
  {
    id: 1,
    category: "Business",
    title: "Email Response",
    description: "Draft a professional email response",
    icon: "📧",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: 2,
    category: "Marketing",
    title: "Social Media Post",
    description: "Create engaging social content",
    icon: "📱",
    gradient: "from-pink-500/20 to-rose-500/20",
  },
  {
    id: 3,
    category: "Communication",
    title: "Meeting Summary",
    description: "Summarize key points from meetings",
    icon: "📋",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: 4,
    category: "Creative",
    title: "Blog Introduction",
    description: "Write an engaging blog intro",
    icon: "✍️",
    gradient: "from-violet-500/20 to-purple-500/20",
  },
  {
    id: 5,
    category: "Education",
    title: "Generate Study Plan",
    description: "Generate a study plan for a student with the time given",
    icon: "💻",
    gradient: "from-green-500/20 to-green-500/20",
  },
  {
    id: 6,
    category: "Research",
    title: "Reasearch on a topic",
    description: "Get a detailed research on any topic",
    icon: "🔍",
    gradient: "from-yellow-500/20 to-purple-500/20",
  },
];

import type { IChatMetadata } from "@/types/chat";

export default function AIAssistantPanel({
  onMetadata,
}: {
  onMetadata?: (metadata: IChatMetadata) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeSearch, setIncludeSearch] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;

    setLoading(true);
    setResponse("");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, includeSearch }),
        },
      );

      const data = await res.json();
      setResponse(data.text || "No response generated");
      if (data.metadata && onMetadata) {
        onMetadata(data.metadata);
      }
    } catch (error) {
      console.error(error);
      setResponse("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUsePrompt = (template: (typeof WRITING_PROMPTS)[0]) => {
    setPrompt(`${template.description}: `);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Premium Header */}
      <div className="relative p-5 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--ai-gradient-start)/0.05)] to-[hsl(var(--ai-gradient-end)/0.05)]" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] shadow-lg shadow-[hsl(var(--ai-glow)/0.3)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold gradient-text">
              AI Writing Assistant
            </h2>
            <p className="text-xs text-muted-foreground">
              Powered by Gemini 2.5
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Quick Prompts */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Prompts
          </h3>
          <div className="grid gap-3">
            {WRITING_PROMPTS.map((template, index) => (
              <div
                key={template.id}
                onClick={() => handleUsePrompt(template)}
                className={cn(
                  "prompt-card group animate-fade-up",
                  `bg-gradient-to-r ${template.gradient}`,
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">
                        {template.title}
                      </h4>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-background/80 text-muted-foreground font-medium">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {template.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Your Prompt
          </h3>
          <Textarea
            placeholder="What would you like me to write? Be specific for better results..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] resize-none rounded-xl border-border/50 bg-muted/30 input-glow transition-all duration-300 placeholder:text-muted-foreground/50"
          />

          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={cn(
                  "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                  includeSearch
                    ? "bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] border-transparent"
                    : "border-border group-hover:border-[hsl(var(--ai-primary)/0.5)]",
                )}
              >
                <input
                  type="checkbox"
                  checked={includeSearch}
                  onChange={(e) => setIncludeSearch(e.target.checked)}
                  className="sr-only"
                />
                {includeSearch && <Check className="h-3 w-3 text-white" />}
              </div>
              <div className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Include web search
                </span>
              </div>
            </label>

            <Button
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className={cn(
                "btn-primary-glow px-6 rounded-xl font-semibold transition-all duration-300",
                "bg-gradient-to-r from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))]",
                "hover:shadow-lg hover:shadow-[hsl(var(--ai-glow)/0.3)] hover:scale-[1.02]",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="thinking-dot w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="thinking-dot w-1.5 h-1.5 rounded-full bg-white" />
                    <div className="thinking-dot w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span>Generating</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Generate</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="ai-message ai-glow p-6 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--ai-gradient-start))] to-[hsl(var(--ai-gradient-end))] flex items-center justify-center animate-pulse-glow">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <p className="font-medium">AI is thinking...</p>
                <p className="text-sm text-muted-foreground">
                  {includeSearch
                    ? "Searching the web and generating response..."
                    : "Generating your content..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Response */}
        {response && !loading && (
          <div className="space-y-3 animate-fade-up">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Generated Content
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-lg text-xs hover:bg-muted/80 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1.5 text-green-500" />{" "}
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1.5" /> Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  className="rounded-lg text-xs hover:bg-muted/80 transition-all"
                >
                  <RotateCw className="h-3 w-3 mr-1.5" />
                  Regenerate
                </Button>
              </div>
            </div>

            <div className="ai-message p-5">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
