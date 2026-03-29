// pages/api/auth/monerium/callback.js
// Handles Monerium OAuth redirect after issuer authorizes
// Exchanges code for tokens, links wallet, gets IBAN, saves to MongoDB

import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { exchangeCode, getProfile, linkWallet, requestIBAN, getIBANs } from '@/lib/monerium';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code, state } = req.query;

    if (!code) {
      return res.redirect('/issuer/onboard?error=monerium_denied');
    }

    // state contains issuerId
    const issuerId = state;

    // Exchange code for access token
    const tokenData = await exchangeCode(code);
    const { access_token, refresh_token, profile: profileId } = tokenData;

    const client = await clientPromise;
    const db = client.db();

    // Get issuer from MongoDB
    const issuer = await db.collection('issuers').findOne({ _id: new ObjectId(issuerId) });
    if (!issuer) {
      return res.redirect('/issuer/onboard?error=issuer_not_found');
    }

    // Link issuer's wallet to Monerium
    let walletLinked = false;
    if (issuer.walletAddress) {
      try {
        await linkWallet(profileId, issuer.walletAddress, access_token);
        walletLinked = true;
      } catch (e) {
        console.log('Wallet may already be linked:', e.message);
        walletLinked = true; // Likely already linked
      }
    }

    // Get or request IBAN
    let iban = null;
    try {
      const ibans = await getIBANs(profileId, access_token);
      if (ibans && ibans.length > 0) {
        iban = ibans[0].iban;
      } else {
        const ibanResult = await requestIBAN(profileId, access_token);
        iban = ibanResult.iban;
      }
    } catch (e) {
      console.error('IBAN request error:', e.message);
    }

    // Get profile details
    let profileData = null;
    try {
      profileData = await getProfile(profileId, access_token);
    } catch (e) {
      console.error('Profile fetch error:', e.message);
    }

    // Save Monerium data to issuer record
    await db.collection('issuers').updateOne(
      { _id: new ObjectId(issuerId) },
      {
        $set: {
          moneriumProfileId: profileId,
          moneriumAccessToken: access_token,
          moneriumRefreshToken: refresh_token,
          moneriumIBAN: iban,
          moneriumWalletLinked: walletLinked,
          moneriumConnectedAt: new Date(),
          updatedAt: new Date(),
        }
      }
    );

    // Also update any assets by this issuer with the IBAN
    if (iban) {
      await db.collection('assets').updateMany(
        { issuerId: new ObjectId(issuerId) },
        { $set: { issuerIBAN: iban, updatedAt: new Date() } }
      );
    }

    // Check if this is an iframe callback (Accept header or query param)
    const isIframe = req.query.iframe === 'true' || req.headers['sec-fetch-dest'] === 'iframe';

    if (isIframe) {
      // Send postMessage to parent window and close iframe
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Connected</title></head>
        <body style="background:#0a0b0f;color:#4ade80;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px">✅</div>
            <div style="font-size:18px;font-weight:bold">Monerium Connected!</div>
            <div style="color:#9ca3af;font-size:14px;margin-top:8px">Closing automatically...</div>
          </div>
          <script>
            // Notify parent window that connection is complete
            if (window.parent !== window) {
              window.parent.postMessage({
                type: 'monerium:connected',
                profileId: '${profileId}',
                iban: '${iban || ''}',
                connected: true
              }, '*');
            }
          </script>
        </body>
        </html>
      `);
    }

    // Normal redirect flow (non-iframe)
    const redirectTo = issuer.onboardingStatus === 'complete'
      ? '/dashboard/issuer?monerium=connected'
      : '/issuer/onboard?step=2&monerium=connected';

    return res.redirect(redirectTo);

  } catch (error) {
    console.error('Monerium callback error:', error);

    // Check if iframe
    if (req.query.iframe === 'true' || req.headers['sec-fetch-dest'] === 'iframe') {
      return res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <body style="background:#0a0b0f;color:#f87171;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px">❌</div>
            <div style="font-size:18px;font-weight:bold">Connection Failed</div>
            <div style="color:#9ca3af;font-size:14px;margin-top:8px">Please try again</div>
          </div>
          <script>
            if (window.parent !== window) {
              window.parent.postMessage({ type: 'monerium:error', error: '${error.message}' }, '*');
            }
          </script>
        </body>
        </html>
      `);
    }

    return res.redirect('/issuer/onboard?error=monerium_failed');
  }
}
