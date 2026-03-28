export function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object') return obj;
  const clean = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (key.startsWith('$')) continue;
    const val = obj[key];
    if (typeof val === 'object' && val !== null) {
      clean[key] = sanitize(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
}

export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[$]/g, '').trim().slice(0, 1000);
}
