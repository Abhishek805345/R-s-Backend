import { MAX_CHAT_HISTORY } from "../config/env.js";
import { ChatMessage } from "../models/ChatMessage.js";

export async function createChatMessage(payload) {
  const message = await ChatMessage.create(payload);
  return message.toObject();
}

export async function getChatHistory(roomId) {
  return ChatMessage.find({ roomId })
    .sort({ ts: 1 })
    .limit(MAX_CHAT_HISTORY)
    .lean();
}
