const RATES = { EUR: 1, USD: 1.08, GBP: 0.86, USDC: 1.08, EURC: 1 };
const SYMBOLS = { EUR: "€", USD: "$", GBP: "£", USDC: "USDC", EURC: "EURC" };

export function convert(amount, from, to) {
  const inEUR = amount / (RATES[from] || 1);
  return Math.round(inEUR * (RATES[to] || 1) * 100) / 100;
}

export function format(amount, currency) {
  return (SYMBOLS[currency] || currency) + " " + amount.toLocaleString();
}

export function getSupportedCurrencies() {
  return Object.keys(RATES).map(c => ({ code: c, symbol: SYMBOLS[c], rate: RATES[c] }));
}
