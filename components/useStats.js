import { useState, useEffect } from 'react';

export default function useStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);
  return stats;
}

export function fmtEur(n) {
  if (!n) return 'EUR 0';
  if (n >= 1000000) return 'EUR ' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return 'EUR ' + (n / 1000).toFixed(0) + 'K';
  return 'EUR ' + n;
}
