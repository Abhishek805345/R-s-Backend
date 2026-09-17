import { MAX_CHAT_HISTORY } from "../config/env.js";
import { getDefaultRoomState } from "../constants/defaultRoomState.js";
import { ChatMessage } from "../models/ChatMessage.js";
import { Room } from "../models/Room.js";

export async function getOrCreateRoom(roomId, initialState = {}) {
  let room = await Room.findOne({ roomId });

  if (!room) {
    room = await Room.create({
      roomId,
      collaborationState: {
        ...getDefaultRoomState(),
        ...initialState,
      },
    });
  }

  return room;
}

export async function updateRoomState(roomId, updates = {}) {
  const room = await getOrCreateRoom(roomId);

  room.collaborationState = {
    ...room.collaborationState.toObject(),
    ...updates,
  };

  await room.save();
  return room.collaborationState;
}

export async function getRoomSnapshot(roomId) {
  const room = await getOrCreateRoom(roomId);
  const chatHistory = await ChatMessage.find({ roomId })
    .sort({ ts: 1 })
    .limit(MAX_CHAT_HISTORY)
    .lean();

  return {
    roomId,
    collaborationState: room.collaborationState,
    chatHistory,
  };
}
