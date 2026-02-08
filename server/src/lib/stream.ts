import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  // We can warn instead of throwing to allow server to start partially configured
  console.warn(
    "Stream API key and secret are missing. Chat features will not work.",
  );
}

// Initialize with safe defaults or throw if strict
export const streamClient = new StreamChat(
  apiKey || "placeholder",
  apiSecret || "placeholder",
);
