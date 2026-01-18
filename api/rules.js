import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "rules.json");

export default function handler(req, res) {
  if (req.method === "GET") {
    const data = fs.readFileSync(filePath, "utf8");
    return res.status(200).json(JSON.parse(data));
  }

  if (req.method === "POST") {
    const newData = req.body;
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
