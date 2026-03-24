import { connectDB } from "../../../../lib/mongodb";
import SupportTicket from "../../../../lib/models/SupportTicket";
import { requireAdmin } from "../../../../lib/adminAuth";
export default requireAdmin(async function handler(req, res) {
  await connectDB();
  if (req.method === "GET") {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 });
    return res.json({ tickets });
  }
  if (req.method === "POST") {
    const ticket = await SupportTicket.create(req.body);
    return res.status(201).json({ ticket });
  }
  res.status(405).end();
});
