import { connectDB } from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import bcrypt from 'bcryptjs';
const { createToken, setSessionCookie } = require('../../../lib/session');
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, firstName, lastName, country, countryCode, phone, dob } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashed,
      firstName,
      lastName,
      country: country || '',
      countryCode: countryCode || '',
      phone: phone || '',
      dateOfBirth: dob || null,
      kycStatus: 'none',
      role: 'user',
      isActive: true,
    });
    const token = createToken({ userId: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName, kycStatus: user.kycStatus, role: user.role });
    setSessionCookie(res, token);
    return res.status(201).json({ success: true, user: { userId: user._id.toString(), email: user.email, firstName: user.firstName, lastName: user.lastName } });
  } catch(e) {
    return res.status(500).json({ error: 'Registration failed: ' + e.message });
  }
}
