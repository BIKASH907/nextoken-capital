import dbConnect from "./db";
import LoginAttempt from "../models/LoginAttempt";
import SecurityAlert from "../models/SecurityAlert";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export async function checkLoginAllowed(email, ip) {
  await dbConnect();
  const since = new Date(Date.now() - LOCKOUT_MINUTES * 60 * 1000);

  const recentFails = await LoginAttempt.countDocuments({
    $or: [{ email }, { ip }],
    success: false,
    createdAt: { $gte: since },
  });

  if (recentFails >= MAX_ATTEMPTS) {
    return { allowed: false, reason: "Too many failed attempts. Locked for 15 minutes.", attemptsLeft: 0 };
  }

  return { allowed: true, attemptsLeft: MAX_ATTEMPTS - recentFails };
}

export async function recordLogin({ email, ip, userAgent, success, reason }) {
  await dbConnect();

  // Check if new device/country
  const prevLogins = await LoginAttempt.find({ email, success: true }).sort({ createdAt: -1 }).limit(20);
  const knownIPs = new Set(prevLogins.map(l => l.ip));
  const isNewDevice = !knownIPs.has(ip);

  await LoginAttempt.create({ email, ip, userAgent, success, reason, isNewDevice });

  // Create alert for suspicious activity
  if (!success && (await LoginAttempt.countDocuments({ email, success: false, createdAt: { $gte: new Date(Date.now() - 15 * 60000) } })) >= 3) {
    await SecurityAlert.create({
      type: "brute_force",
      severity: "high",
      title: "Multiple failed login attempts",
      description: email + " from IP " + ip,
      sourceIp: ip,
      metadata: { email, attempts: MAX_ATTEMPTS },
    });
  }

  if (success && isNewDevice) {
    await SecurityAlert.create({
      type: "new_device",
      severity: "medium",
      title: "Login from new device/IP",
      description: email + " logged in from new IP " + ip,
      sourceIp: ip,
      userName: email,
    });
  }
}
