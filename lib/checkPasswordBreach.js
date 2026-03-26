// k-anonymity: Only sends first 5 chars of SHA1 hash
// NEVER sends full password or full hash to any external service
import crypto from "crypto";

export async function isPasswordBreached(password) {
  try {
    const sha1 = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
    const prefix = sha1.substring(0, 5);   // Only this goes to the API
    const suffix = sha1.substring(5);       // This stays local

    const res = await fetch("https://api.pwnedpasswords.com/range/" + prefix, {
      headers: { "Add-Padding": "true", "User-Agent": "Nextoken-Capital-Security" },
    });
    const text = await res.text();

    for (const line of text.split("\n")) {
      const parts = line.split(":");
      if (parts[0].trim() === suffix) {
        return { breached: true, count: parseInt(parts[1].trim(), 10) };
      }
    }
    return { breached: false, count: 0 };
  } catch (err) {
    // If API is down, don't block the user — fail open
    console.error("Breach check failed:", err.message);
    return { breached: false, count: 0 };
  }
}
