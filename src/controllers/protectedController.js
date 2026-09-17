export function getProtectedProfile(req, res) {
  res.json({
    ok: true,
    message: "Protected route accessed successfully",
    user: req.user,
  });
}
