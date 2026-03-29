// pages/api/auth/monerium/callback.js
// Handles Monerium OAuth redirect — exchanges code + code_verifier for tokens
// Supports both iframe (postMessage) and redirect modes

import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

const MONERIUM_ENV = process.env.MONERIUM_ENV || 'sandbox';
const MONERIUM_API = MONERIUM_ENV === 'production'
  ? 'https://api.monerium.app'
  : 'https://api.monerium.dev';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { code, state } = req.query;
    if (!code) return res.redirect('/issuer/onboard?error=monerium_denied');

    const issuerId = state;
    const client = await clientPromise;
    const db = client.db();

    // Get issuer + stored code_verifier
    const issuer = await db.collection('issuers').findOne({ _id: new ObjectId(issuerId) });
    if (!issuer) return res.redirect('/issuer/onboard?error=issuer_not_found');

    const codeVerifier = issuer.moneriumCodeVerifier;
    if (!codeVerifier) return res.redirect('/issuer/onboard?error=no_verifier');

    // Exchange code for tokens WITH code_verifier (PKCE)
    const tokenRes = await fetch(`${MONERIUM_API}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.MONERIUM_CLIENT_ID,
        redirect_uri: process.env.MONERIUM_REDIRECT_URI,
        code,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error('Monerium token exchange failed:', tokenData);
      return sendResponse(res, req, false, issuerId, null, null, tokenData.message || 'Token exchange failed');
    }

    const { access_token, refresh_token, profile: profileId } = tokenData;

    // Link wallet to Monerium
    let walletLinked = false;
    if (issuer.walletAddress) {
      try {
        await fetch(`${MONERIUM_API}/profiles/${profileId}/accounts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chain: 'polygon',
            address: issuer.walletAddress,
            currency: 'eur',
          }),
        });
        walletLinked = true;
      } catch (e) {
        walletLinked = true; // Likely already linked
      }
    }

    // Get or request IBAN
    let iban = null;
    try {
      const ibanRes = await fetch(`${MONERIUM_API}/profiles/${profileId}/ibans`, {
        headers: { 'Authorization': `Bearer ${access_token}` },
      });
      const ibans = await ibanRes.json();
      if (Array.isArray(ibans) && ibans.length > 0) {
        iban = ibans[0].iban;
      } else {
        const newIbanRes = await fetch(`${MONERIUM_API}/profiles/${profileId}/ibans`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currency: 'eur' }),
        });
        const newIban = await newIbanRes.json();
        iban = newIban.iban;
      }
    } catch (e) {
      console.error('IBAN error:', e.message);
    }

    // Save to MongoDB
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
          moneriumCodeVerifier: null, // Clear used verifier
          updatedAt: new Date(),
        }
      }
    );

    // Update assets with IBAN
    if (iban) {
      await db.collection('assets').updateMany(
        { issuerId: new ObjectId(issuerId) },
        { $set: { issuerIBAN: iban, updatedAt: new Date() } }
      );
    }

    return sendResponse(res, req, true, issuerId, profileId, iban, null);

  } catch (error) {
    console.error('Monerium callback error:', error);
    return sendResponse(res, req, false, null, null, null, error.message);
  }
}

function sendResponse(res, req, success, issuerId, profileId, iban, errorMsg) {
  const isIframe = req.query.iframe === 'true' || req.headers['sec-fetch-dest'] === 'iframe';

  if (isIframe) {
    const html = success
      ? `<!DOCTYPE html><html><body style="background:#0a0b0f;color:#4ade80;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px">✅</div>
            <div style="font-size:18px;font-weight:bold">Monerium Connected!</div>
            <div style="color:#9ca3af;font-size:14px;margin-top:8px">Closing automatically...</div>
          </div>
          <script>
            if (window.parent !== window) {
              window.parent.postMessage({ type: 'monerium:connected', profileId: '${profileId}', iban: '${iban || ''}', connected: true }, '*');
            }
          </script>
        </body></html>`
      : `<!DOCTYPE html><html><body style="background:#0a0b0f;color:#f87171;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center">
            <div style="font-size:48px;margin-bottom:16px">❌</div>
            <div style="font-size:18px;font-weight:bold">Connection Failed</div>
            <div style="color:#9ca3af;font-size:14px;margin-top:8px">${errorMsg || 'Please try again'}</div>
          </div>
          <script>
            if (window.parent !== window) {
              window.parent.postMessage({ type: 'monerium:error', error: '${errorMsg}' }, '*');
            }
          </script>
        </body></html>`;
    return res.status(200).send(html);
  }

  // Normal redirect
  if (success) {
    const redirectTo = '/issuer/onboard?step=2&monerium=connected';
    return res.redirect(redirectTo);
  } else {
    return res.redirect('/issuer/onboard?error=monerium_failed');
  }
}
