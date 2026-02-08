import { ThemeProvider } from "./components/ThemeProvider";
import { WorkspaceLayout } from "./components/layout/WorkspaceLayout";
import { Sidebar } from "./components/layout/Sidebar";
import ChatInterface from "./components/ChatInterface";
import AIAssistantPanel from "./components/AIAssistantPanel";
import { LoginScreen } from "./components/LoginScreen";
import { useState, useCallback } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";

const apiKey = import.meta.env.VITE_STREAM_API_KEY || "your_api_key";

function App() {
  const [client, setClient] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const handleLogin = useCallback(async (userId: string, userName: string) => {
    setIsConnecting(true);
    try {
      const chatClient = StreamChat.getInstance(apiKey);
      const response = await fetch("http://localhost:3000/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName }),
      });

      const { token, user } = await response.json();
      await chatClient.connectUser({ id: userId, name: userName }, token);

      setClient(chatClient);
      setUserProfile(user);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Check your server.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (client) {
      await client.disconnectUser();
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
          main={<ChatInterface />}
          assistant={<AIAssistantPanel />}
        />
      </Chat>
    </ThemeProvider>
  );
}

export default App;
