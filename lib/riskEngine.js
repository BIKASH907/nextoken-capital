import dbConnect from "./db";
import RiskAlert from "../models/RiskAlert";
import Order from "../models/Order";

export async function checkRisk(userId, action, metadata) {
  await dbConnect();
  const alerts = [];

  // Velocity check: >10 orders in 1 hour
  if (action === "order") {
    const oneHourAgo = new Date(Date.now() - 60*60*1000);
    const recentOrders = await Order.countDocuments({ userId, createdAt: { $gte: oneHourAgo } });
    if (recentOrders > 10) {
      alerts.push(await RiskAlert.create({ userId, type: "velocity", severity: "high", title: "High velocity trading", description: recentOrders + " orders in last hour", metadata }));
    }
  }

  // Large transaction check: >EUR 25,000
  if (metadata?.amount > 25000) {
    alerts.push(await RiskAlert.create({ userId, type: "large_transaction", severity: "high", title: "Large transaction: EUR " + metadata.amount, description: "Transaction exceeds EUR 25,000 threshold", metadata }));
  }

  // New country check
  if (metadata?.country && metadata?.previousCountry && metadata.country !== metadata.previousCountry) {
    alerts.push(await RiskAlert.create({ userId, type: "new_country", severity: "medium", title: "Login from new country: " + metadata.country, description: "Previous: " + metadata.previousCountry, metadata }));
  }

  return alerts;
}
