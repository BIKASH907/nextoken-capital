import { requireAdmin } from "../../../lib/adminAuth";
import dbConnect from "../../../lib/db";
import Wallet from "../../../models/Wallet";
import Fee from "../../../models/Fee";
import Investment from "../../../models/Investment";
async function handler(req, res) {
  await dbConnect();
  const wallets = await Wallet.find().lean();
  const fees = await Fee.find().lean();
  const investments = await Investment.find({ status: "active" }).lean();
  const totalDeposits = wallets.reduce((s,w) => s + w.transactions.filter(t=>t.type==="deposit").reduce((ts,t)=>ts+Math.abs(t.amount),0), 0);
  const totalWithdrawals = wallets.reduce((s,w) => s + w.transactions.filter(t=>t.type==="withdrawal").reduce((ts,t)=>ts+Math.abs(t.amount),0), 0);
  return res.json({
    totalBalance: wallets.reduce((s,w) => s + w.availableBalance + w.lockedBalance, 0),
    availableBalance: wallets.reduce((s,w) => s + w.availableBalance, 0),
    lockedBalance: wallets.reduce((s,w) => s + w.lockedBalance, 0),
    totalEarnings: wallets.reduce((s,w) => s + w.totalEarnings, 0),
    totalDeposits, totalWithdrawals,
    totalFeeRevenue: fees.reduce((s,f) => s + f.amount, 0),
    feeBreakdown: { trading: fees.filter(f=>f.type==="trading").reduce((s,f)=>s+f.amount,0), listing: fees.filter(f=>f.type==="listing").reduce((s,f)=>s+f.amount,0), management: fees.filter(f=>f.type==="management").reduce((s,f)=>s+f.amount,0) },
    aum: investments.reduce((s,i) => s + i.totalInvested, 0),
    walletCount: wallets.length,
  });
}
export default requireAdmin(handler);
