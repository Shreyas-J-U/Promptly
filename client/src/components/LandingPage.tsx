import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Shield,
  ArrowRight,
  X,
  Lock,
  User,
  Cpu,
  Sparkles,
  Loader2,
} from "lucide-react";

interface LandingPageProps {
  onLogin: (
    userId: string,
    userName: string,
    password: string,
    isRegistering: boolean,
  ) => Promise<void>;
  isConnecting: boolean;
}

export default function LandingPage({
  onLogin,
  isConnecting,
}: LandingPageProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Auth Form State
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim() && password.trim()) {
      await onLogin(
        userId,
        authMode === "register" ? userName || userId : userId,
        password,
        authMode === "register",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans overflow-hidden relative selection:bg-blue-500/30">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Promptly</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => openAuth("login")}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Log in
          </button>
          <button
            onClick={() => openAuth("register")}
            className="px-4 py-2 text-sm font-medium bg-white/10 hover:bg-white/20 border border-white/10 rounded-full backdrop-blur-md transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-32 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-3 py-1 text-xs font-semibold tracking-wide text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full mb-6 inline-block">
            Powered by Gemini 2.0 & Tavily AI
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
            The Intelligence Workspace for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              High-Performance Thinking.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Don't just chat with AI. Command the live web. Promptly transforms
            traditional chat into an agentic workflow with real-time discovery
            and deep response insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => openAuth("register")}
              className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]"
            >
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full text-left">
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-blue-400" />}
            title="State-of-the-Art Intelligence"
            description="Dual-Core Engine powered by Google Gemini provides human-level reasoning, advanced coding, and creative writing."
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-purple-400" />}
            title="Deep Discovery Search"
            description="Unlike static AI, Promptly uses Tavily AI to crawl the live web in real-time. It doesn't guess—it knows."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-emerald-400" />}
            title="Secure & Sovereign"
            description="Custom persistence node with JWT session management and Bcrypt encryption ensures your data stays yours."
          />
        </div>
      </main>

      {/* Auth Modal (Glassmorphism) */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm p-8 bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-2xl"
            >
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {authMode === "login"
                    ? "Welcome back"
                    : "Create your workspace"}
                </h2>
                <p className="text-sm text-slate-400">
                  {authMode === "login"
                    ? "Enter your credentials to access your intelligence feed."
                    : "Join Promptly to command the live web."}
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleAuthSubmit}>
                <div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Workspace ID (unique ID)"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-white"
                    />
                  </div>
                </div>

                {authMode === "register" && (
                  <div>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Display Name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-white"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Access Token"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isConnecting}
                  className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : authMode === "login" ? (
                    "Sign In"
                  ) : (
                    "Initialize Workspace"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-400">
                {authMode === "login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {authMode === "login" ? "Sign up" : "Log in"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-component for Feature Cards
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
    >
      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
    </motion.div>
  );
}
