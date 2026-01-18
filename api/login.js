export const config = {
  runtime: "nodejs",
};

export default function handler(req, res) {
  console.log("=== LOGIN DEBUG ===");
  console.log("HEADERS:", req.headers);
  console.log("ADMIN_PASSWORD ENV:", process.env.ADMIN_PASSWORD);

  const password = req.headers["x-admin-password"];

  console.log("RECEIVED PASSWORD:", password);

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
