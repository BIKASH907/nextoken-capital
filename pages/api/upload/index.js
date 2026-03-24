// POST /api/upload — Upload file to Cloudinary
// Returns { url, public_id, original_filename }
import { IncomingForm } from "formidable";
import cloudinary from "cloudinary";
import { getUserFromRequest } from "../../../lib/auth";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: "Not authenticated" });

  const form = new IncomingForm({ keepExtensions: true, maxFileSize: 20 * 1024 * 1024 });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: "Upload failed: " + err.message });

    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file provided" });

    try {
      const result = await cloudinary.v2.uploader.upload(file.filepath || file.path, {
        folder: "nextoken/assets",
        resource_type: "auto",
        allowed_formats: ["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"],
      });

      res.status(200).json({
        url:               result.secure_url,
        public_id:         result.public_id,
        original_filename: file.originalFilename || file.name,
        format:            result.format,
        size:              result.bytes,
      });
    } catch (e) {
      console.error("Cloudinary upload error:", e);
      res.status(500).json({ error: "Upload failed" });
    }
  });
}
