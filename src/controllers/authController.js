import {
  deleteSessionByToken,
  getUserFromToken,
  loginUser,
  registerUser,
} from "../services/authService.js";
import { isValidEmail } from "../utils/validation.js";

function extractBearerToken(req) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.replace("Bearer ", "").trim();
}

export async function signup(req, res, next) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "All fields are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        ok: false,
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        ok: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      ok: true,
      message: "Account created successfully",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: "Please enter a valid email address",
      });
    }

    const result = await loginUser({ email, password });

    res.json({
      ok: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Authorization token is required",
      });
    }

    const auth = await getUserFromToken(token);

    if (!auth) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or expired session",
      });
    }

    res.json({
      ok: true,
      user: auth.user,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Authorization token is required",
      });
    }

    await deleteSessionByToken(token);

    res.json({
      ok: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
}
