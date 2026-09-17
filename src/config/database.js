import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

let connectionPromise = null;

export async function connectDatabase() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && connectionPromise) {
    await connectionPromise;
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  connectionPromise = mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  await connectionPromise;
  console.log("database connected");

  return mongoose.connection;
}
