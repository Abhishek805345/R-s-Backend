import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    ts: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
