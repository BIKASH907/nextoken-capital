import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";
import User from "../../../lib/models/User";

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const session = await getUserFromRequest(req);
    if (!session) return res.status(401).json({ error: "Not authenticated" });

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return res.status(401).json({ error: "User not found" });

    const form = new IncomingForm({ maxFileSize: 20 * 1024 * 1024 });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(file.filepath || file.path, {
      folder: `nextoken/assets/${user._id}`,
      resource_type: "auto",
      allowed_formats: ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"],
    });

    return res.status(200).json({
      success: true,
      url:  result.secure_url,
      name: file.originalFilename || file.name || "document",
      type: result.format || "unknown",
      size: result.bytes,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
