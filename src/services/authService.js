import { AUTH_TOKEN_EXPIRES_IN_DAYS } from "../config/env.js";
import { AuthSession } from "../models/AuthSession.js";
import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { generateAuthToken, hashToken } from "../utils/token.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function getExpiryDate() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + AUTH_TOKEN_EXPIRES_IN_DAYS);
  return expiresAt;
}

export async function registerUser({
  firstName,
  lastName,
  email,
  password,
}) {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    passwordHash: hashPassword(password),
  });

  return createUserSession(user);
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Email is not registered");
    error.statusCode = 404;
    throw error;
  }

  const isValidPassword = verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return createUserSession(user);
}

export async function createUserSession(user) {
  const token = generateAuthToken();
  const tokenHash = hashToken(token);
  const expiresAt = getExpiryDate();

  await AuthSession.create({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    user: sanitizeUser(user),
    expiresAt,
  };
}

export async function getUserFromToken(token) {
  const tokenHash = hashToken(token);
  const session = await AuthSession.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).populate("userId");

  if (!session || !session.userId) {
    return null;
  }

  return {
    session,
    user: sanitizeUser(session.userId),
  };
}

export async function deleteSessionByToken(token) {
  const tokenHash = hashToken(token);
  await AuthSession.deleteOne({ tokenHash });
}
