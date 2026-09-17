import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log("database connected");

  return mongoose.connection;
}
