import { requireAdmin } from "../../../../lib/adminAuth";
import dbConnect from "../../../../lib/db";
import Order from "../../../../models/Order";
import Investment from "../../../../models/Investment";
import AuditLog from "../../../../models/AuditLog";
import RiskAlert from "../../../../models/RiskAlert";

async function handler(req, res) {
  await dbConnect();
  const { type, from, to } = req.query;
  const start = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 3));
  const end = to ? new Date(to) : new Date();
  const filter = { createdAt: { $gte: start, $lte: end } };

  if (type === "sar") {
    const alerts = await RiskAlert.find({ ...filter, severity: { $in: ["high","critical"] } }).lean();
    return res.json({ type: "Suspicious Activity Report", period: { from: start, to: end }, alerts, count: alerts.length });
  }
  if (type === "transaction_summary") {
    const orders = await Order.find({ ...filter, status: "completed" }).lean();
    const total = orders.reduce((s,o) => s + o.totalAmount, 0);
    return res.json({ type: "Transaction Summary", period: { from: start, to: end }, totalTransactions: orders.length, totalVolume: total, orders: orders.slice(0,100) });
  }
  if (type === "aml") {
    const logs = await AuditLog.find({ ...filter, category: { $in: ["compliance","financial"] } }).lean();
    return res.json({ type: "AML Compliance Report", period: { from: start, to: end }, entries: logs.length, logs: logs.slice(0,100) });
  }
  if (type === "casp_quarterly") {
    const [orders, investments, alerts] = await Promise.all([
      Order.find({ ...filter, status: "completed" }).lean(),
      Investment.find(filter).lean(),
      RiskAlert.find(filter).lean(),
    ]);
    return res.json({
      type: "CASP Quarterly Return (MiCA)", period: { from: start, to: end },
      transactions: { count: orders.length, volume: orders.reduce((s,o) => s + o.totalAmount, 0) },
      investments: { count: investments.length, volume: investments.reduce((s,i) => s + i.totalInvested, 0) },
      riskAlerts: { count: alerts.length, high: alerts.filter(a => a.severity === "high").length, critical: alerts.filter(a => a.severity === "critical").length },
    });
  }

  return res.json({ types: ["sar","transaction_summary","aml","casp_quarterly"] });
}
export default requireAdmin(handler);
