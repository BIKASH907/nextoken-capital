import { connectDB } from '../../../lib/mongodb';
import User from '../../../lib/models/User';
import bcrypt from 'bcryptjs';
import { isPasswordBreached } from '../../../lib/checkPasswordBreach';
const { createToken, setSessionCookie } = require('../../../lib/session');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password, firstName, lastName, country, countryCode, phone, dob } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Password strength check
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }

  // Check password against HaveIBeenPwned (k-anonymity — safe)
  const breach = await isPasswordBreached(password);
  if (breach.breached) {
    return res.status(400).json({
      error: 'This password has appeared in ' + breach.count.toLocaleString() + ' data breaches. Please choose a different, unique password.'
    });
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
      dob: dob || '',
      role: 'investor',
      kycStatus: 'pending',
    });

    const token = createToken(user);
    setSessionCookie(res, token);
    return res.status(201).json({ user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
}
