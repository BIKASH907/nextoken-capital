import Notification from "../models/Notification";
import dbConnect from "./db";

export async function notify(userId, type, title, message, link, metadata) {
  try {
    await dbConnect();
    await Notification.create({ userId, type, title, message, link, metadata });
    // Send email notification for critical events
    if (["distribution_received","kyc_approved","suspicious_activity"].includes(type)) {
      try {
        const User = (await import("../lib/models/User")).default;
        const user = await User.findById(userId);
        if (user?.email && process.env.RESEND_API_KEY) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
            body: JSON.stringify({ from: "Nextoken Capital <noreply@nextokencapital.com>", to: user.email, subject: title, html: "<div style='font-family:system-ui;max-width:500px;margin:0 auto;padding:20px'><h2 style='color:#F0B90B'>Nextoken Capital</h2><p>" + message + "</p></div>" }),
          });
        }
      } catch(e) { console.error("Email notify error:", e.message); }
    }
  } catch(e) { console.error("Notify error:", e.message); }
}
