import { ThemeProvider } from "./components/ThemeProvider";
import { WorkspaceLayout } from "./components/layout/WorkspaceLayout";
import { Sidebar } from "./components/layout/Sidebar";
import ChatInterface from "./components/ChatInterface";
import AIAssistantPanel from "./components/AIAssistantPanel";
import { LoginScreen } from "./components/LoginScreen";
import { useState, useCallback, useEffect } from "react";
import type { IChatMetadata } from "./types/chat";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

const apiKey = import.meta.env.VITE_STREAM_API_KEY || "your_api_key";

function App() {
  const [client, setClient] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [lastMetadata, setLastMetadata] = useState<IChatMetadata | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("promptly_token");
      const userId = localStorage.getItem("promptly_userId");

      if (token && userId) {
        try {
          setIsConnecting(true);
          const chatClient = StreamChat.getInstance(apiKey);

          // Fetch user profile from backend
          const res = await fetch(`http://localhost:3000/api/user/${userId}`);
          const user = await res.json();

          if (res.ok) {
            await chatClient.connectUser(
              { id: userId, name: user.name },
              token,
            );
            setClient(chatClient);
            setUserProfile(user);
          }
        } catch (error) {
          console.error("Restoring session failed:", error);
          localStorage.clear();
        } finally {
          setIsConnecting(false);
        }
      }
    };
    restoreSession();
  }, []);

  const handleLogin = useCallback(
    async (
      userId: string,
      userName: string,
      password: string,
      isRegistering: boolean,
    ) => {
      setIsConnecting(true);
      try {
        const chatClient = StreamChat.getInstance(apiKey);
        const endpoint = isRegistering ? "/api/register" : "/api/login";
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, userName, password }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Authentication failed");
        }

        const { token, jwt: jwtToken, user } = data;
        await chatClient.connectUser({ id: userId, name: userName }, token);

        localStorage.setItem("promptly_token", token);
        localStorage.setItem("promptly_jwt", jwtToken);
        localStorage.setItem("promptly_userId", userId);

        setClient(chatClient);
        setUserProfile(user);
      } catch (error: any) {
        console.error("Authentication failed:", error);
        alert(error.message || "Failed to authenticate. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    if (client) {
      await client.disconnectUser();
      localStorage.removeItem("promptly_token");
      localStorage.removeItem("promptly_jwt");
      localStorage.removeItem("promptly_userId");
      setClient(null);
      setUserProfile(null);
    }
  }, [client]);

  const handleCreateChannel = async () => {
    if (!client) return;
    const name = prompt("Enter channel name:");
    if (!name) return;

    const channelId = name.toLowerCase().replace(/\s+/g, "-");
    const channel = client.channel("messaging", channelId, {
      name,
      members: [client.userID!],
    });

    try {
      await channel.create();
      // Sync stats with backend
      await fetch(`http://localhost:3000/api/user/${client.userID}/stats`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field: "totalChannels", increment: 1 }),
      });
      // Optionally re-fetch profile to update stats UI
      const res = await fetch(
        `http://localhost:3000/api/user/${client.userID}`,
      );
      const updatedUser = await res.json();
      setUserProfile(updatedUser);
    } catch (err) {
      console.error("Failed to create channel:", err);
    }
  };

  if (!client) {
    return (
      <ThemeProvider defaultTheme="light">
        <LoginScreen onLogin={handleLogin} isConnecting={isConnecting} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <Chat client={client} theme="str-chat__theme-light">
        <WorkspaceLayout
          sidebar={
            <Sidebar
              collapsed={false}
              userProfile={userProfile}
              onLogout={handleLogout}
              onCreateChannel={handleCreateChannel}
            />
          }
          main={<AIAssistantPanel onMetadata={setLastMetadata} />}
          assistant={<ChatInterface metadata={lastMetadata} />}
        />
      </Chat>
    </ThemeProvider>
  );
}

export default App;
