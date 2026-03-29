import { connectDB } from '../../../lib/mongodb';
import Employee from '../../../lib/models/Employee';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

async function verifyAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET);
    const emp = await Employee.findById(decoded.id || decoded.employeeId);
    if (!emp || !emp.isActive) return null;
    return emp;
  } catch { return null; }
}

export default async function handler(req, res) {
  await connectDB();
  const admin = await verifyAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Unauthorized' });
  if (admin.role !== 'super_admin') return res.status(403).json({ error: 'Only Super Admins can manage employees' });

  if (req.method === 'GET') {
    const employees = await Employee.find().select('-password').sort({ createdAt: -1 }).lean();
    return res.json({ employees });
  }

  if (req.method === 'POST') {
    const { firstName, lastName, email, password, role, department, phone } = req.body;
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 8) return res.status(400).json({ error: 'Password min 8 chars' });
    const existing = await Employee.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    if (role === 'super_admin') {
      const c = await Employee.countDocuments({ role: 'super_admin', isActive: true });
      if (c >= 2) return res.status(400).json({ error: 'Max 2 Super Admins' });
    }
    const hash = await bcrypt.hash(password, 12);
    const emp = await Employee.create({ firstName, lastName, email: email.toLowerCase(), password: hash, role: role || 'support', department, phone, isActive: true, createdBy: admin._id });
    const { password: _, ...safe } = emp.toObject();
    return res.json({ success: true, employee: safe });
  }

  if (req.method === 'PUT') {
    const { employeeId, firstName, lastName, password, role, department, phone, isActive } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' });
    const target = await Employee.findById(employeeId);
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (target._id.toString() === admin._id.toString() && role && role !== 'super_admin') return res.status(400).json({ error: 'Cannot change own role' });
    if (target._id.toString() === admin._id.toString() && isActive === false) return res.status(400).json({ error: 'Cannot deactivate yourself' });
    const update = { updatedAt: new Date() };
    if (firstName) update.firstName = firstName;
    if (lastName) update.lastName = lastName;
    if (role) update.role = role;
    if (department !== undefined) update.department = department;
    if (phone !== undefined) update.phone = phone;
    if (isActive !== undefined) update.isActive = isActive;
    if (password && password.length >= 8) update.password = await bcrypt.hash(password, 12);
    await Employee.findByIdAndUpdate(employeeId, { $set: update });
    return res.json({ success: true, message: 'Employee updated' });
  }

  if (req.method === 'DELETE') {
    const { employeeId } = req.body;
    if (!employeeId) return res.status(400).json({ error: 'employeeId required' });
    const target = await Employee.findById(employeeId);
    if (!target) return res.status(404).json({ error: 'Not found' });
    if (target._id.toString() === admin._id.toString()) return res.status(400).json({ error: 'Cannot delete yourself' });
    if (target.role === 'super_admin') return res.status(400).json({ error: 'Change role first' });
    await Employee.findByIdAndDelete(employeeId);
    return res.json({ success: true, message: 'Deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}// v2
