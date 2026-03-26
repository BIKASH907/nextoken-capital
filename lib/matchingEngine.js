import OrderBook from "../models/OrderBook";
import Trade from "../models/Trade";
import Wallet from "../models/Wallet";
import Investment from "../models/Investment";
import HoldingLot from "../models/HoldingLot";
import Fee from "../models/Fee";
import { notify } from "./notify";
import crypto from "crypto";

export async function matchOrder(order) {
  const oppSide = order.side === "bid" ? "ask" : "bid";
  const priceFilter = order.side === "bid"
    ? { pricePerUnit: { $lte: order.pricePerUnit } }
    : { pricePerUnit: { $gte: order.pricePerUnit } };
  const sort = order.side === "bid"
    ? { pricePerUnit: 1, createdAt: 1 }
    : { pricePerUnit: -1, createdAt: 1 };

  const matches = await OrderBook.find({
    assetId: order.assetId, side: oppSide,
    status: { $in: ["open", "partial"] },
    userId: { $ne: order.userId },
    ...priceFilter,
  }).sort(sort);

  const trades = [];
  let remaining = order.remainingUnits;

  for (const match of matches) {
    if (remaining <= 0) break;

    const fillUnits = Math.min(remaining, match.remainingUnits);
    const fillPrice = match.pricePerUnit; // price-time priority: taker gets maker's price
    const fillAmount = fillUnits * fillPrice;
    const buyerFee = Math.round(fillAmount * 0.005 * 100) / 100;
    const sellerFee = Math.round(fillAmount * 0.005 * 100) / 100;
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");

    const buyerId = order.side === "bid" ? order.userId : match.userId;
    const sellerId = order.side === "ask" ? order.userId : match.userId;

    // Execute trade
    const trade = await Trade.create({
      assetId: order.assetId, assetName: order.assetName,
      buyerId, sellerId, buyOrderId: order.side === "bid" ? order._id : match._id,
      sellOrderId: order.side === "ask" ? order._id : match._id,
      units: fillUnits, pricePerUnit: fillPrice, totalAmount: fillAmount,
      buyerFee, sellerFee, txHash,
    });

    // Transfer funds
    let buyerWallet = await Wallet.findOne({ userId: buyerId });
    if (!buyerWallet) buyerWallet = await Wallet.create({ userId: buyerId });

    // If buyer placed bid, funds were locked at order time
    // If buyer is taker (ask matched), deduct now
    if (order.side === "ask") {
      // match is the bid (buyer), funds already locked
    } else {
      // order is bid (buyer), funds already locked at place time
    }

    // Credit seller
    let sellerWallet = await Wallet.findOne({ userId: sellerId });
    if (!sellerWallet) sellerWallet = await Wallet.create({ userId: sellerId });
    const sellerCredit = fillAmount - sellerFee;
    sellerWallet.availableBalance += sellerCredit;
    sellerWallet.transactions.push({ type: "sell", amount: sellerCredit, assetName: order.assetName, txHash, status: "completed", description: "Sold " + fillUnits + " units @ EUR " + fillPrice });
    await sellerWallet.save();

    // Deduct from buyer locked (if bid) or available (if buying from ask)
    if (order.side === "bid") {
      // Buyer is order placer - locked funds used
      buyerWallet.lockedBalance -= (fillAmount + buyerFee);
    } else {
      // Buyer is match (bid placer) - locked funds used
      buyerWallet.lockedBalance -= (fillAmount + buyerFee);
    }
    buyerWallet.transactions.push({ type: "buy", amount: -(fillAmount + buyerFee), assetName: order.assetName, txHash, status: "completed", description: "Bought " + fillUnits + " units @ EUR " + fillPrice });
    await buyerWallet.save();

    // Transfer token ownership
    let sellerInv = await Investment.findOne({ userId: sellerId, assetId: order.assetId, status: "active" });
    if (sellerInv) {
      sellerInv.units -= fillUnits;
      if (sellerInv.units <= 0) sellerInv.status = "sold";
      sellerInv.totalInvested = Math.max(0, sellerInv.units * sellerInv.pricePerUnit);
      await sellerInv.save();
    }

    let buyerInv = await Investment.findOne({ userId: buyerId, assetId: order.assetId, status: "active" });
    if (buyerInv) {
      buyerInv.units += fillUnits;
      buyerInv.totalInvested += fillAmount;
      await buyerInv.save();
    } else {
      await Investment.create({ userId: buyerId, assetId: order.assetId, assetName: order.assetName, units: fillUnits, pricePerUnit: fillPrice, totalInvested: fillAmount, currentValue: fillAmount, status: "active", txHash });
    }

    // FIFO: deduct seller lots
    let sellRemain = fillUnits;
    const sellerLots = await HoldingLot.find({ userId: sellerId, assetId: order.assetId, remainingUnits: { $gt: 0 } }).sort({ purchaseDate: 1 });
    for (const lot of sellerLots) {
      if (sellRemain <= 0) break;
      const d = Math.min(sellRemain, lot.remainingUnits);
      lot.remainingUnits -= d;
      sellRemain -= d;
      await lot.save();
    }

    // New holding lot for buyer (30-day restart)
    await HoldingLot.create({ userId: buyerId, assetId: order.assetId, assetName: order.assetName, units: fillUnits, remainingUnits: fillUnits, purchaseDate: new Date(), pricePerUnit: fillPrice, source: "secondary", txHash });

    // Record fees
    await Fee.create({ type: "trading", amount: buyerFee + sellerFee, assetName: order.assetName, userId: buyerId.toString(), txHash });

    // Update both orders
    order.filledUnits += fillUnits;
    order.remainingUnits -= fillUnits;
    order.trades.push({ tradeId: trade._id.toString(), units: fillUnits, price: fillPrice, at: new Date() });
    order.status = order.remainingUnits <= 0 ? "filled" : "partial";

    match.filledUnits += fillUnits;
    match.remainingUnits -= fillUnits;
    match.trades.push({ tradeId: trade._id.toString(), units: fillUnits, price: fillPrice, at: new Date() });
    match.status = match.remainingUnits <= 0 ? "filled" : "partial";
    await match.save();

    remaining -= fillUnits;
    trades.push(trade);

    // Notify both
    await notify(buyerId, "buy_completed", "Trade Matched", "Bought " + fillUnits + " units of " + order.assetName + " @ EUR " + fillPrice, "/dashboard", { txHash });
    await notify(sellerId, "sell_completed", "Trade Matched", "Sold " + fillUnits + " units of " + order.assetName + " @ EUR " + fillPrice, "/dashboard", { txHash });
  }

  await order.save();

  // If bid not fully filled, return excess locked funds for unfilled portion
  if (order.side === "bid" && order.remainingUnits > 0 && order.status === "filled") {
    // All filled, nothing to return
  }

  return { order, trades, filled: order.filledUnits, remaining: order.remainingUnits };
}

export async function expireOrders() {
  const expired = await OrderBook.find({ status: { $in: ["open", "partial"] }, expiresAt: { $lt: new Date() } });
  for (const order of expired) {
    // Return locked funds for bids
    if (order.side === "bid" && order.remainingUnits > 0) {
      const refund = order.remainingUnits * order.pricePerUnit * 1.005;
      let wallet = await Wallet.findOne({ userId: order.userId });
      if (wallet) {
        wallet.lockedBalance -= refund;
        wallet.availableBalance += refund;
        wallet.transactions.push({ type: "refund", amount: refund, assetName: order.assetName, status: "completed", description: "Expired bid order refund" });
        await wallet.save();
      }
    }
    // Restore FIFO lots for asks
    if (order.side === "ask" && order.remainingUnits > 0) {
      const lots = await HoldingLot.find({ userId: order.userId, assetId: order.assetId }).sort({ purchaseDate: -1 }).limit(1);
      if (lots[0]) { lots[0].remainingUnits += order.remainingUnits; await lots[0].save(); }
    }
    order.status = "expired";
    await order.save();
  }
  return expired.length;
}
