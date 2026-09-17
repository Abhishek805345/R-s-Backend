import { createServer } from "node:http";
import { createApp } from "./src/app.js";
import { connectDatabase } from "./src/config/database.js";
import { createSocketServer } from "./src/socket/registerSocketHandlers.js";
import { PORT } from "./src/config/env.js";

async function startServer() {
  await connectDatabase();

  const app = createApp();
  const httpServer = createServer(app);

  createSocketServer(httpServer);

  httpServer.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("failed to start backend", error);
  process.exit(1);
});
