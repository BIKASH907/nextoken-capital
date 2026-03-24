import { connectDB } from "../../../lib/mongodb";
import SupportTicket from "../../../lib/models/SupportTicket";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, subject, message } = req.body;
  if (!email || !subject || !message) return res.status(400).json({ error: "Email, subject and message are required." });
  try {
    await connectDB();
    const ticket = await SupportTicket.create({ userEmail: email, userName: name || "", subject, message, status: "open" });
    res.status(201).json({ success: true, ticketId: ticket._id.toString() });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
