import mongoose from "mongoose";

export function getHealth(_req, res) {
  res.json({
    ok: true,
    service: "codesphere-backend",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
}
