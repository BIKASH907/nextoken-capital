import crypto from 'crypto';

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateSecret(length = 20) {
  const bytes = crypto.randomBytes(length);
  let secret = '';
  for (let i = 0; i < bytes.length; i++) {
    secret += BASE32[bytes[i] % 32];
  }
  return secret;
}

function base32Decode(str) {
  let bits = '';
  for (const c of str.toUpperCase()) {
    const idx = BASE32.indexOf(c);
    if (idx === -1) continue;
    bits += idx.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

export function generateTOTP(secret, time = null) {
  const epoch = time || Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(epoch / 30);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeBigUInt64BE(BigInt(timeStep));
  const decodedSecret = base32Decode(secret);
  const hmac = crypto.createHmac('sha1', decodedSecret).update(timeBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = ((hmac[offset] & 0x7f) << 24 | (hmac[offset + 1] & 0xff) << 16 | (hmac[offset + 2] & 0xff) << 8 | (hmac[offset + 3] & 0xff)) % 1000000;
  return code.toString().padStart(6, '0');
}

export function verifyTOTP(secret, token, window = 1) {
  const epoch = Math.floor(Date.now() / 1000);
  for (let i = -window; i <= window; i++) {
    const check = generateTOTP(secret, epoch + (i * 30));
    if (check === token) return true;
  }
  return false;
}

export function generateQRUri(secret, email, issuer = 'Nextoken Capital') {
  return 'otpauth://totp/' + encodeURIComponent(issuer) + ':' + encodeURIComponent(email) + '?secret=' + secret + '&issuer=' + encodeURIComponent(issuer);
}
