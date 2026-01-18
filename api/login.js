export const runtime = "nodejs";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const password = req.headers["x-admin-password"];

  if (!password) {
    return res.status(401).json({ success: false });
  }

  if (password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
