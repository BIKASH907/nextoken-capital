// pages/api/issuer/redeem-eure.js
// Redeem EURe → EUR to bank via Monerium
// Manual: issuer clicks withdraw | Auto: Vercel cron hourly

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { redeemToEUR, refreshToken, getEUReBalance } from '@/lib/monerium';
import { ethers } from 'ethers';

const EURE_ADDRESS = '0x18ec0A6E18E5bc3784fDd3a3669906d2bfc5075d';
const EURE_ABI = ['function balanceOf(address) view returns (uint256)'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { issuerId, amount, mode } = req.body;

    // Auth: manual = session, auto = cron secret
    if (mode === 'auto') {
      if (req.headers['x-cron-secret'] !== process.env.CRON_SECRET) {
        return res.status(403).json({ error: 'Invalid cron secret' });
      }
    } else {
      const session = await getServerSession(req, res, authOptions);
      if (!session) return res.status(401).json({ error: 'Unauthorized' });
    }

    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = require('mongodb');

    // Get issuers to process
    let issuers;
    if (issuerId) {
      const issuer = await db.collection('issuers').findOne({ _id: new ObjectId(issuerId) });
      issuers = issuer ? [issuer] : [];
    } else {
      // Auto: all issuers with Monerium
      issuers = await db.collection('issuers').find({
        moneriumProfileId: { $ne: null },
        moneriumAccessToken: { $ne: null },
      }).toArray();
    }

    const results = [];
    const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC || 'https://polygon-rpc.com');
    const eureContract = new ethers.Contract(EURE_ADDRESS, EURE_ABI, provider);

    for (const issuer of issuers) {
      try {
        if (!issuer.moneriumProfileId || !issuer.walletAddress || !issuer.moneriumAccessToken) {
          results.push({ issuer: issuer.companyName, status: 'skipped', reason: 'Missing Monerium setup' });
          continue;
        }

        // Check on-chain EURe balance
        const balance = await eureContract.balanceOf(issuer.walletAddress);
        const balanceEUR = parseFloat(ethers.formatUnits(balance, 6));
        const redeemAmount = amount ? parseFloat(amount) : balanceEUR;

        if (redeemAmount < 1) {
          results.push({ issuer: issuer.companyName, status: 'skipped', reason: 'Balance below €1', balance: balanceEUR });
          continue;
        }

        const bankIBAN = issuer.moneriumIBAN || issuer.bankIBAN;
        const bankName = issuer.bankAccountHolder || issuer.companyName;
        if (!bankIBAN) {
          results.push({ issuer: issuer.companyName, status: 'skipped', reason: 'No IBAN' });
          continue;
        }

        // Refresh token if needed
        let accessToken = issuer.moneriumAccessToken;
        try {
          const newTokens = await refreshToken(issuer.moneriumRefreshToken);
          accessToken = newTokens.access_token;
          await db.collection('issuers').updateOne(
            { _id: issuer._id },
            { $set: { moneriumAccessToken: newTokens.access_token, moneriumRefreshToken: newTokens.refresh_token } }
          );
        } catch (e) {
          // Use existing token
        }

        // Redeem EURe → EUR
        const order = await redeemToEUR(
          issuer.moneriumProfileId,
          issuer.walletAddress,
          redeemAmount,
          bankIBAN,
          bankName,
          accessToken
        );

        // Log redemption
        await db.collection('redemptions').insertOne({
          issuerId: issuer._id,
          companyName: issuer.companyName,
          walletAddress: issuer.walletAddress,
          iban: bankIBAN,
          amountEURe: redeemAmount,
          moneriumOrderId: order.id || order.orderId,
          status: 'processing',
          mode: mode || 'manual',
          createdAt: new Date(),
        });

        results.push({
          issuer: issuer.companyName,
          status: 'success',
          amountEURe: redeemAmount,
          destinationIBAN: bankIBAN.replace(/(.{4})(.*)(.{4})/, '$1****$3'),
          message: `€${redeemAmount.toFixed(2)} arriving in 1-2 business days`,
        });
      } catch (err) {
        results.push({ issuer: issuer.companyName, status: 'error', error: err.message });
      }
    }

    return res.status(200).json({ processed: results.length, results });
  } catch (error) {
    console.error('Redeem error:', error);
    return res.status(500).json({ error: error.message });
  }
}
