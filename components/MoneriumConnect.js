// components/MoneriumConnect.js
// Embeds Monerium connection flow directly inside Nextoken Capital
// Issuer never leaves the site — everything happens in an iframe/modal
'use client';
import { useState, useEffect, useRef } from 'react';

const MONERIUM_ENV = process.env.NEXT_PUBLIC_MONERIUM_ENV || 'sandbox';
const MONERIUM_APP = MONERIUM_ENV === 'production'
  ? 'https://monerium.app'
  : 'https://sandbox.monerium.dev';

export default function MoneriumConnect({ 
  issuerId, 
  walletAddress, 
  onConnected,  // callback: ({ profileId, iban, accessToken }) => void
  onError,      // callback: (error) => void
}) {
  const [step, setStep] = useState('idle'); // idle | connecting | verifying | linked | error
  const [showModal, setShowModal] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [pollInterval, setPollInterval] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const iframeRef = useRef(null);

  // Step 1: Get OAuth URL from our API (but display in iframe, not redirect)
  const startConnection = async () => {
    setStep('connecting');
    setShowModal(true);
    setErrorMsg('');

    try {
      // Get the OAuth URL from our backend
      const res = await fetch(`/api/auth/monerium/start?issuerId=${issuerId}`);
      const data = await res.json();

      if (data.authUrl) {
        setAuthUrl(data.authUrl);
        // Start polling for completion
        startPolling();
      } else {
        throw new Error(data.error || 'Failed to start connection');
      }
    } catch (err) {
      setStep('error');
      setErrorMsg(err.message);
      onError?.(err.message);
    }
  };

  // Poll our backend to check if OAuth callback was received
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/monerium/status?issuerId=${issuerId}`);
        const data = await res.json();

        if (data.connected) {
          clearInterval(interval);
          setPollInterval(null);
          setStep('linked');
          setShowModal(false);
          onConnected?.({
            profileId: data.profileId,
            iban: data.iban,
            accessToken: data.accessToken,
          });
        }
      } catch (e) {
        // Keep polling
      }
    }, 2000); // Check every 2 seconds

    setPollInterval(interval);
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [pollInterval]);

  // Listen for message from iframe (Monerium sends postMessage on completion)
  useEffect(() => {
    const handleMessage = (event) => {
      // Accept messages from Monerium domain
      if (event.origin === MONERIUM_APP || event.origin.includes('monerium')) {
        if (event.data?.type === 'monerium:authorized' || event.data?.code) {
          // OAuth completed in iframe — send code to our callback
          fetch(`/api/auth/monerium/callback?code=${event.data.code}&state=${issuerId}`)
            .then(res => res.json())
            .then(data => {
              if (data.connected) {
                setStep('linked');
                setShowModal(false);
                onConnected?.(data);
              }
            })
            .catch(() => {});
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [issuerId]);

  return (
    <div>
      {/* ── IDLE / NOT CONNECTED ── */}
      {step === 'idle' && (
        <div className="space-y-3">
          <button
            onClick={startConnection}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 transition flex items-center justify-center gap-3"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="2"/>
              <path d="M2 10h20" stroke="white" strokeWidth="2"/>
              <circle cx="7" cy="15" r="1.5" fill="white"/>
            </svg>
            Connect Bank Account via Monerium
          </button>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              EU Regulated
            </span>
            <span>•</span>
            <span>0% conversion fee</span>
            <span>•</span>
            <span>SEPA payout</span>
            <span>•</span>
            <span>5 min setup</span>
          </div>
        </div>
      )}

      {/* ── CONNECTING (shows modal with iframe) ── */}
      {step === 'connecting' && !showModal && (
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 rounded-xl border border-blue-600 text-blue-400 font-bold hover:bg-blue-900/20 transition text-sm"
        >
          ⏳ Connection in progress — Click to continue
        </button>
      )}

      {/* ── LINKED ── */}
      {step === 'linked' && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">✓</div>
            <div>
              <div className="text-green-400 font-bold text-sm">Monerium Connected</div>
              <div className="text-gray-400 text-xs">EUR payouts active • 0% conversion fee</div>
            </div>
          </div>
        </div>
      )}

      {/* ── ERROR ── */}
      {step === 'error' && (
        <div className="space-y-3">
          <div className="p-3 bg-red-900/20 border border-red-700 rounded-xl text-sm text-red-400">
            {errorMsg || 'Connection failed'}
          </div>
          <button
            onClick={() => { setStep('idle'); setErrorMsg(''); }}
            className="w-full py-3 rounded-xl border border-gray-700 text-gray-400 font-bold hover:text-white transition text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── MODAL WITH IFRAME ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d0e12] border border-gray-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="white" strokeWidth="2"/>
                    <path d="M2 10h20" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Connect Monerium</div>
                  <div className="text-gray-500 text-xs">Secure bank connection</div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Iframe Content */}
            <div className="relative" style={{ height: '600px' }}>
              {authUrl ? (
                <iframe
                  ref={iframeRef}
                  src={authUrl}
                  className="w-full h-full border-0"
                  allow="camera;microphone"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full mx-auto mb-3"></div>
                    <div className="text-gray-400 text-sm">Loading Monerium...</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Secured by Monerium • EU Regulated EMI
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-gray-500 hover:text-white transition"
              >
                I'll do this later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
