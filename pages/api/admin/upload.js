import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const config = { api: { bodyParser: false } };
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });
    const file = files.file?.[0] || files.file;
    if (!file) return res.status(400).json({ error: "No file" });
    try {
      const result = await cloudinary.uploader.upload(file.filepath || file.path, {
        folder: "nextoken-assets",
        transformation: [{ width: 1200, height: 800, crop: "fill" }],
      });
      res.json({ url: result.secure_url, publicId: result.public_id });
    } catch(e) {
      res.status(500).json({ error: e.message });
    }
  });
}
