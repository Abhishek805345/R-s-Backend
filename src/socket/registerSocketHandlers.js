import { Server } from "socket.io";
import { CLIENT_ORIGIN } from "../config/env.js";
import { getChatHistory, createChatMessage } from "../services/chatService.js";
import { getOrCreateRoom, updateRoomState } from "../services/roomService.js";

function emitVideoParticipants(io, roomId) {
  const roomKey = `video:${roomId}`;
  const room = io.sockets.adapter.rooms.get(roomKey);
  const peerIds = room ? [...room] : [];

  io.to(roomKey).emit("video-participants", { peerIds });
}

function registerChatHandlers(io, socket) {
  socket.on("join_chat_room", async (roomId) => {
    socket.join(`chat:${roomId}`);
    socket.emit("chat-history", {
      roomId,
      messages: await getChatHistory(roomId),
    });
  });

  socket.on("leave_chat_room", (roomId) => {
    socket.leave(`chat:${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const roomId = data.roomId || "global-room";
    const savedMessage = await createChatMessage({
      roomId,
      sender: data.sender,
      text: data.text,
      ts: data.ts,
    });

    io.to(`chat:${roomId}`).emit("receive_message", savedMessage);
  });
}

function registerCollaborationHandlers(socket) {
  socket.on("join-collaboration-room", async ({ roomId, initialState }) => {
    const roomKey = `collab:${roomId}`;
    socket.join(roomKey);

    const room = await getOrCreateRoom(roomId, initialState);
    socket.emit("collaboration-state", room.collaborationState);
  });

  socket.on("leave-collaboration-room", ({ roomId }) => {
    socket.leave(`collab:${roomId}`);
  });

  socket.on("sync-collaboration-state", async ({ roomId, updates }) => {
    const nextState = await updateRoomState(roomId, updates);
    socket.to(`collab:${roomId}`).emit("collaboration-state", nextState);
  });

  socket.on("code-edit-activity", ({ roomId, editorName }) => {
    socket.to(`collab:${roomId}`).emit("code-edit-activity", {
      editorId: socket.id,
      editorName: editorName || "Someone",
    });
  });
}

function registerVideoHandlers(io, socket) {
  socket.on("join-video-room", ({ roomId }) => {
    const roomKey = `video:${roomId}`;
    const room = io.sockets.adapter.rooms.get(roomKey);
    const peerIds = room ? [...room].filter((id) => id !== socket.id) : [];

    socket.join(roomKey);
    socket.data.videoRoomId = roomId;
    socket.emit("video-room-users", { peerIds, selfId: socket.id });
    socket.to(roomKey).emit("video-user-joined", { peerId: socket.id });
    emitVideoParticipants(io, roomId);
  });

  socket.on("video-offer", ({ target, offer }) => {
    io.to(target).emit("video-offer", {
      from: socket.id,
      offer,
    });
  });

  socket.on("video-answer", ({ target, answer }) => {
    io.to(target).emit("video-answer", {
      from: socket.id,
      answer,
    });
  });

  socket.on("video-ice-candidate", ({ target, candidate }) => {
    io.to(target).emit("video-ice-candidate", {
      from: socket.id,
      candidate,
    });
  });

  socket.on("leave-video-room", ({ roomId }) => {
    socket.leave(`video:${roomId}`);
    socket.to(`video:${roomId}`).emit("video-peer-left", {
      peerId: socket.id,
    });
    socket.data.videoRoomId = null;
    emitVideoParticipants(io, roomId);
  });
}

function registerDisconnectHandler(io, socket) {
  socket.on("disconnect", () => {
    if (socket.data.videoRoomId) {
      socket.to(`video:${socket.data.videoRoomId}`).emit("video-peer-left", {
        peerId: socket.id,
      });
      emitVideoParticipants(io, socket.data.videoRoomId);
    }

    console.log("user disconnected");
  });
}

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CLIENT_ORIGIN,
    },
  });

  io.on("connection", (socket) => {
    console.log("user connected");

    registerChatHandlers(io, socket);
    registerCollaborationHandlers(socket);
    registerVideoHandlers(io, socket);
    registerDisconnectHandler(io, socket);
  });

  return io;
}
