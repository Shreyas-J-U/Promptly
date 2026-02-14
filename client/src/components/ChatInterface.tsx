import {
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export default function ChatInterface() {
  return (
    <div className="flex-1 flex flex-col bg-muted/5 h-full">
      <div className="flex-1 text-purple-500 text-2xl font-bold text-center mt-4">Resources Used</div>
      <div className="text-gray-600 fixed top-20 rounded-md justify-center ">
        <div className="text-sm font-semibold px-2 py-1 bg-background/80 rounded-full">Websites Searched: </div>
        <div className="text-sm font-semibold px-2 py-1 bg-background/80 rounded-full">Time Taken: </div>
        <div className="text-sm font-semibold px-2 py-1 bg-background/80 rounded-full">Highlights:</div>
      </div>
    </div>
  );
}
