import mongoose from "mongoose";
import { getDefaultRoomState } from "../constants/defaultRoomState.js";

const collaborationStateSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      default: getDefaultRoomState().language,
    },
    code: {
      type: String,
      default: getDefaultRoomState().code,
    },
    codeEnabled: {
      type: Boolean,
      default: getDefaultRoomState().codeEnabled,
    },
    codeShared: {
      type: Boolean,
      default: getDefaultRoomState().codeShared,
    },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    collaborationState: {
      type: collaborationStateSchema,
      default: () => getDefaultRoomState(),
    },
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model("Room", roomSchema);
