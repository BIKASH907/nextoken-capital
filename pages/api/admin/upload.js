import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
import { requireAdmin } from "../../../lib/adminAuth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const form = new IncomingForm({ maxFileSize: MAX_BYTES });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });
    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file" });

    const mime = file.mimetype || file.type;
    if (mime && !ALLOWED_MIME.has(mime)) {
      return res.status(400).json({ error: "Unsupported file type" });
    }
    if (file.size && file.size > MAX_BYTES) {
      return res.status(413).json({ error: "File too large" });
    }

    try {
      const result = await cloudinary.uploader.upload(file.filepath || file.path, {
        folder: "nextoken-assets",
        resource_type: "image",
        transformation: [{ width: 1200, height: 800, crop: "fill" }],
      });
      res.json({ url: result.secure_url, publicId: result.public_id });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
}

export default requireAdmin(handler);
