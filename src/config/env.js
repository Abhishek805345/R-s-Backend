import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT || 4600);

export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

export const MAX_CHAT_HISTORY = 100;

export const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/codesphere";

export const AUTH_TOKEN_EXPIRES_IN_DAYS = Number(
  process.env.AUTH_TOKEN_EXPIRES_IN_DAYS || 7
);
