// pages/api/upload/document.js
// Uploads files to Cloudinary and returns URL
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";

export const config = { api: { bodyParser: false } };

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  await connectDB();
  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const form = formidable({ maxFileSize: 20 * 1024 * 1024 }); // 20MB max

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "File upload failed: " + err.message });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    try {
      const result = await cloudinary.uploader.upload(file.filepath || file.path, {
        folder: `nextoken/assets/${user.sub || user.id}`,
        resource_type: "auto",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"],
      });

      res.status(200).json({
        success: true,
        url:      result.secure_url,
        publicId: result.public_id,
        format:   result.format,
        size:     result.bytes,
        name:     fields.name?.[0] || fields.name || file.originalFilename || "document",
      });
    } catch (e) {
      res.status(500).json({ error: "Upload failed: " + e.message });
    }
  });
}
