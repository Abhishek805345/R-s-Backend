import mongoose from "mongoose";
import { connectDatabase } from "../config/database.js";

export async function getHealth(_req, res) {
  try {
    await connectDatabase();
  } catch (error) {
    return res.status(503).json({
      ok: false,
      service: "codesphere-backend",
      database: "disconnected",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    ok: true,
    service: "codesphere-backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}
