import { getUserFromToken } from "../services/authService.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        ok: false,
        message: "Authorization token is required",
      });
    }

    const token = header.replace("Bearer ", "").trim();
    const auth = await getUserFromToken(token);

    if (!auth) {
      return res.status(401).json({
        ok: false,
        message: "Invalid or expired session",
      });
    }

    req.user = auth.user;
    req.authSession = auth.session;
    next();
  } catch (error) {
    next(error);
  }
}
