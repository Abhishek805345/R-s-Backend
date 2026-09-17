import mongoose from "mongoose";
import { MONGODB_URI } from "./env.js";

export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGODB_URI);
  console.log("database connected");
}
