import React from 'react';

export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', color: '#fff' }}>
      <div style={{ 
        display: 'inline-block', 
        padding: '6px 16px', 
        borderRadius: '20px', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        border: '1px solid #333',
        fontSize: '12px',
        color: '#4ade80',
        marginBottom: '40px'
      }}>
        ● MICA LICENSED • EU REGULATED • DLT PILOT REGIME
      </div>
      
      <h1 style={{ fontSize: '64px', fontWeight: '800', maxWidth: '900px', margin: '0 auto 30px' }}>
        The Global Platform <br />
        <span style={{ color: '#f5c15a' }}>for Tokenized Capital Markets</span>
      </h1>
      
      <p style={{ fontSize: '18px', color: '#6e7686', maxWidth: '600px', margin: '0 auto 40px' }}>
        Access institutional-grade private equity, venture capital, and tokenized bonds on a fully regulated European infrastructure.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <button style={{ backgroundColor: '#f5c15a', color: '#000', padding: '15px 30px', borderRadius: '8px', fontWeight: '700', border: 'none' }}>
          Start Investing
        </button>
        <button style={{ backgroundColor: 'transparent', color: '#fff', padding: '15px 30px', borderRadius: '8px', fontWeight: '700', border: '1px solid #333' }}>
          Tokenize Assets
        </button>
      </div>
    </div>
  );
}