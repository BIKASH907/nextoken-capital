// pages/api/issuer/onboard.js
// Registers new issuer + asset in MongoDB
// Monerium connection happens separately via OAuth

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ error: 'Unauthorized' });

    const {
      companyName, registrationNumber, country, companyAddress,
      contactName, contactEmail, contactPhone,
      walletAddress, payoutMethod,
      assetName, assetType, assetDescription,
      targetAmount, tokenSupply, pricePerToken, minInvestment,
      expectedReturn, deadline,
    } = req.body;

    // Validation
    if (!companyName || !contactName || !contactEmail || !walletAddress) {
      return res.status(400).json({ error: 'Missing required company/contact fields' });
    }
    if (!assetName || !tokenSupply || !pricePerToken || !targetAmount) {
      return res.status(400).json({ error: 'Missing required asset fields' });
    }

    const { ethers } = require('ethers');
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const client = await clientPromise;
    const db = client.db();

    // Check if issuer already exists for this user
    const existingIssuer = await db.collection('issuers').findOne({ userId: session.user.id });

    let issuerId;

    if (existingIssuer) {
      // Update existing issuer
      await db.collection('issuers').updateOne(
        { _id: existingIssuer._id },
        {
          $set: {
            companyName, registrationNumber, country, companyAddress,
            contactName, contactEmail, contactPhone,
            walletAddress: walletAddress.toLowerCase(),
            payoutMethod: payoutMethod || 'wallet_monerium',
            updatedAt: new Date(),
          }
        }
      );
      issuerId = existingIssuer._id;
    } else {
      // Create new issuer
      const result = await db.collection('issuers').insertOne({
        userId: session.user.id,
        companyName, registrationNumber, country, companyAddress,
        contactName, contactEmail, contactPhone,
        walletAddress: walletAddress.toLowerCase(),
        payoutMethod: payoutMethod || 'wallet_monerium',
        moneriumProfileId: null,
        moneriumAccessToken: null,
        moneriumRefreshToken: null,
        moneriumIBAN: null,
        moneriumWalletLinked: false,
        kybStatus: 'pending',
        onboardingStatus: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      issuerId = result.insertedId;
    }

    // Create the asset
    const asset = await db.collection('assets').insertOne({
      issuerId,
      issuerUserId: session.user.id,
      name: assetName,
      type: assetType || 'real_estate',
      description: assetDescription || '',
      issuerCompany: companyName,
      issuerWallet: walletAddress.toLowerCase(),
      issuerIBAN: '',
      targetAmount: parseFloat(targetAmount),
      tokenSupply: parseInt(tokenSupply),
      pricePerToken: parseFloat(pricePerToken),
      minInvestment: parseFloat(minInvestment) || 100,
      expectedReturn: expectedReturn || '',
      deadline: deadline ? new Date(deadline) : null,
      commissionBps: 25,
      status: 'pending_review',
      contractAssetId: null,
      contractTxHash: null,
      totalRaised: 0,
      tokensSold: 0,
      totalInvestors: 0,
      documents: [],
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      issuerId: issuerId.toString(),
      assetId: asset.insertedId.toString(),
      nextSteps: [
        'Connect Monerium for free EUR payouts',
        'Upload required documents',
        'Wait for compliance review (24-48 hours)',
      ],
    });

  } catch (error) {
    console.error('Issuer onboard error:', error);
    return res.status(500).json({ error: error.message });
  }
}
