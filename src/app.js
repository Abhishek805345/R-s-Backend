import express from "express";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }

    next();
  });

  app.get("/", (_req, res) => {
    res.json({
      ok: true,
      name: "Code Sphere Backend",
      endpoints: ["/api/health", "/api/rooms/:roomId"],
    });
  });

  app.use("/api", healthRoutes);
  app.use("/api", authRoutes);
  app.use("/api", protectedRoutes);
  app.use("/api", roomRoutes);

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || "Internal server error",
    });
  });

  return app;
}
