const fs = require("fs");
const path = require("path");

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
  console.log("Created: " + filePath);
}

// ── 1. MONGOOSE USER MODEL ──────────────────────────────────
write("lib/models/User.js", `
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String },
  accountType:  { type: String, enum: ["investor","issuer"], default: "investor" },
  country:      { type: String },
  phone:        { type: String },
  dob:          { type: String },
  kycStatus:    { type: String, enum: ["none","pending","approved","rejected"], default: "none" },
  kycApplicantId: { type: String },
  role:         { type: String, enum: ["user","admin"], default: "user" },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now },
  lastLogin:    { type: Date },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
`);

// ── 2. INVESTMENT MODEL ──────────────────────────────────────
write("lib/models/Investment.js", `
import mongoose from "mongoose";

const InvestmentSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assetName:    { type: String, required: true },
  assetType:    { type: String },
  ticker:       { type: String },
  amount:       { type: Number, required: true },
  tokens:       { type: Number },
  tokenPrice:   { type: Number },
  currency:     { type: String, default: "EUR" },
  paymentMethod:{ type: String, enum: ["card","sepa","crypto"] },
  stripePaymentId: { type: String },
  status:       { type: String, enum: ["pending","confirmed","failed","refunded"], default: "pending" },
  createdAt:    { type: Date, default: Date.now },
});

export default mongoose.models.Investment || mongoose.model("Investment", InvestmentSchema);
`);

// ── 3. MONGODB CONNECTION ────────────────────────────────────
write("lib/mongodb.js", `
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}
`);

// ── 4. NEXTAUTH CONFIG ───────────────────────────────────────
write("pages/api/auth/[...nextauth].js", `
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) throw new Error("No account found with this email.");
        if (!user.password) throw new Error("Please sign in with Google.");
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error("Invalid password.");
        if (!user.isActive) throw new Error("Account suspended. Contact support.");
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });
        return {
          id:          user._id.toString(),
          email:       user.email,
          name:        user.firstName + " " + user.lastName,
          firstName:   user.firstName,
          accountType: user.accountType,
          kycStatus:   user.kycStatus,
          role:        user.role,
        };
      },
    }),
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id          = user.id;
        token.firstName   = user.firstName;
        token.accountType = user.accountType;
        token.kycStatus   = user.kycStatus;
        token.role        = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id          = token.id;
      session.user.firstName   = token.firstName;
      session.user.accountType = token.accountType;
      session.user.kycStatus   = token.kycStatus;
      session.user.role        = token.role;
      return session;
    },
  },
  pages: {
    signIn:  "/login",
    error:   "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret:  process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
`);

// ── 5. REGISTER API ──────────────────────────────────────────
write("pages/api/auth/register.js", `
import bcrypt from "bcryptjs";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { sendWelcomeEmail } from "../../../lib/email";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstName, lastName, email, password, accountType, country, phone, dob } = req.body;

  if (!firstName || !lastName || !email || !password || !accountType) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }

  try {
    await connectDB();
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName, lastName,
      email: email.toLowerCase(),
      password: hashed,
      accountType, country, phone, dob,
    });

    await sendWelcomeEmail({ email: user.email, firstName: user.firstName });

    return res.status(201).json({
      success: true,
      userId: user._id.toString(),
      message: "Account created successfully.",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed. Please try again." });
  }
}
`);

// ── 6. KYC API (Sumsub) ──────────────────────────────────────
write("pages/api/kyc/token.js", `
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

function sumsubSign(secret, ts, method, path, body = "") {
  const data = ts + method.toUpperCase() + path + body;
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  const userId    = session.user.id;
  const appToken  = process.env.SUMSUB_APP_TOKEN;
  const secretKey = process.env.SUMSUB_SECRET_KEY;

  if (!appToken || !secretKey) {
    return res.status(500).json({ error: "Sumsub not configured" });
  }

  const ts   = Math.floor(Date.now() / 1000).toString();
  const path = "/resources/accessTokens?userId=" + userId + "&levelName=basic-kyc-level";
  const sig  = sumsubSign(secretKey, ts, "POST", path);

  try {
    const response = await fetch("https://api.sumsub.com" + path, {
      method: "POST",
      headers: {
        "X-App-Token":    appToken,
        "X-App-Access-Ts":sig,
        "X-App-Access-Sig":sig,
        "Content-Type":   "application/json",
      },
    });
    const data = await response.json();

    await connectDB();
    await User.findByIdAndUpdate(userId, {
      kycStatus:      "pending",
      kycApplicantId: userId,
    });

    return res.status(200).json({ token: data.token });
  } catch (err) {
    console.error("Sumsub token error:", err);
    return res.status(500).json({ error: "Failed to get KYC token" });
  }
}
`);

// ── 7. KYC WEBHOOK ───────────────────────────────────────────
write("pages/api/kyc/webhook.js", `
import crypto from "crypto";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import { sendKycApprovedEmail, sendKycRejectedEmail } from "../../../lib/email";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end",  () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody  = await getRawBody(req);
  const secret   = process.env.SUMSUB_SECRET_KEY || "";
  const digest   = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = req.headers["x-payload-digest"];

  if (digest !== received) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  const payload = JSON.parse(rawBody);
  const { applicantId, reviewStatus, reviewResult } = payload;

  await connectDB();
  const user = await User.findOne({ kycApplicantId: applicantId });
  if (!user) return res.status(200).end();

  if (reviewStatus === "completed" && reviewResult?.reviewAnswer === "GREEN") {
    await User.findByIdAndUpdate(user._id, { kycStatus: "approved" });
    await sendKycApprovedEmail({ email: user.email, firstName: user.firstName });
  } else if (reviewStatus === "completed" && reviewResult?.reviewAnswer === "RED") {
    await User.findByIdAndUpdate(user._id, { kycStatus: "rejected" });
    await sendKycRejectedEmail({ email: user.email, firstName: user.firstName });
  }

  return res.status(200).end();
}
`);

// ── 8. EMAIL SYSTEM (Resend) ─────────────────────────────────
write("lib/email.js", `
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = "Nextoken Capital <noreply@nextokencapital.com>";

export async function sendWelcomeEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Welcome to Nextoken Capital",
      html: \`
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
            <span style="font-size:13px;font-weight:800;letter-spacing:3px;color:#F0B90B;margin-left:10px">NEXTOKEN CAPITAL</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#e8e8f0;margin:0 0 12px">Welcome, \${firstName}! 🎉</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Your Nextoken Capital account has been created successfully. You are now part of a regulated platform connecting investors across 180+ countries to tokenized real-world assets.
          </p>
          <div style="background:#0d0d14;border:1px solid rgba(240,185,11,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="font-size:13px;font-weight:700;color:#F0B90B;margin:0 0 10px">Next steps:</p>
            <p style="font-size:13px;color:#8a9bb8;margin:0 0 6px">✅ Account created</p>
            <p style="font-size:13px;color:#f59e0b;margin:0 0 6px">⏳ Complete KYC identity verification</p>
            <p style="font-size:13px;color:#8a9bb8;margin:0">🔒 Start investing (after KYC approval)</p>
          </div>
          <a href="https://nextokencapital.com/register" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Complete KYC Verification →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania · Regulated by Bank of Lithuania</p>
        </div>
      \`,
    });
  } catch (e) { console.error("Welcome email error:", e); }
}

export async function sendKycApprovedEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "KYC Approved — You can now invest on Nextoken Capital",
      html: \`
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
            <span style="font-size:13px;font-weight:800;letter-spacing:3px;color:#F0B90B;margin-left:10px">NEXTOKEN CAPITAL</span>
          </div>
          <div style="font-size:48px;margin-bottom:16px">✅</div>
          <h1 style="font-size:26px;font-weight:800;color:#22c55e;margin:0 0 12px">KYC Approved, \${firstName}!</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Your identity verification has been approved. You now have full access to invest in tokenized bonds, equity, real estate, and energy assets on Nextoken Capital.
          </p>
          <a href="https://nextokencapital.com/markets" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Start Investing →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania · Regulated by Bank of Lithuania</p>
        </div>
      \`,
    });
  } catch (e) { console.error("KYC approved email error:", e); }
}

export async function sendKycRejectedEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "KYC Verification — Action Required",
      html: \`
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#ef4444;margin:0 0 12px">Verification Needs Attention</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Hi \${firstName}, we were unable to verify your identity with the documents provided. Please resubmit with clearer photos or a different document.
          </p>
          <a href="https://nextokencapital.com/register" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Retry Verification →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania</p>
        </div>
      \`,
    });
  } catch (e) { console.error("KYC rejected email error:", e); }
}

export async function sendPasswordResetEmail({ email, firstName, resetUrl }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Reset Your Nextoken Capital Password",
      html: \`
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#e8e8f0;margin:0 0 12px">Password Reset Request</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Hi \${firstName}, we received a request to reset your password. Click below to set a new password. This link expires in 30 minutes.
          </p>
          <a href="\${resetUrl}" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Reset Password →
          </a>
          <p style="font-size:13px;color:#8a9bb8;margin-top:20px">If you did not request this, ignore this email. Your password will not change.</p>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania</p>
        </div>
      \`,
    });
  } catch (e) { console.error("Password reset email error:", e); }
}

export async function sendInvestmentConfirmationEmail({ email, firstName, assetName, amount, tokens }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Investment Confirmed — " + assetName,
      html: \`
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#22c55e;margin:0 0 12px">Investment Confirmed ✅</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">Hi \${firstName}, your investment in <strong style="color:#F0B90B">\${assetName}</strong> has been confirmed.</p>
          <div style="background:#0d0d14;border:1px solid rgba(240,185,11,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="font-size:13px;color:#8a9bb8;margin:0 0 8px">Amount Invested: <strong style="color:#e8e8f0">EUR \${amount}</strong></p>
            <p style="font-size:13px;color:#8a9bb8;margin:0">Tokens Received: <strong style="color:#F0B90B">\${tokens} tokens</strong></p>
          </div>
          <a href="https://nextokencapital.com/dashboard" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            View Portfolio →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania · Regulated by Bank of Lithuania</p>
        </div>
      \`,
    });
  } catch (e) { console.error("Investment email error:", e); }
}
`);

// ── 9. STRIPE PAYMENT INTENT API ─────────────────────────────
write("pages/api/payments/create-intent.js", `
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not authenticated" });

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  if (user.kycStatus !== "approved") {
    return res.status(403).json({ error: "KYC verification required before investing" });
  }

  const { amount, currency = "eur", assetName, paymentMethod = "card" } = req.body;
  if (!amount || amount < 100) {
    return res.status(400).json({ error: "Minimum investment is EUR 100" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100),
      currency,
      payment_method_types: paymentMethod === "sepa" ? ["sepa_debit"] : ["card"],
      metadata: {
        userId:    session.user.id,
        assetName,
        userEmail: session.user.email,
      },
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Payment setup failed" });
  }
}
`);

// ── 10. STRIPE WEBHOOK ───────────────────────────────────────
write("pages/api/payments/webhook.js", `
import Stripe from "stripe";
import { connectDB } from "../../../lib/mongodb";
import Investment from "../../../lib/models/Investment";
import { sendInvestmentConfirmationEmail } from "../../../lib/email";
import User from "../../../lib/models/User";

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = Buffer.alloc(0);
    req.on("data", chunk => { data = Buffer.concat([data, chunk]); });
    req.on("end",  () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig     = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: "Webhook signature invalid" });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const { userId, assetName, userEmail } = pi.metadata;
    const amount = pi.amount / 100;
    const tokens = Math.floor(amount / 1.5);

    await connectDB();
    await Investment.create({
      userId,
      assetName,
      amount,
      tokens,
      tokenPrice: 1.5,
      currency:   pi.currency.toUpperCase(),
      paymentMethod: pi.payment_method_types[0] === "sepa_debit" ? "sepa" : "card",
      stripePaymentId: pi.id,
      status: "confirmed",
    });

    const user = await User.findById(userId);
    if (user) {
      await sendInvestmentConfirmationEmail({
        email:     userEmail,
        firstName: user.firstName,
        assetName,
        amount,
        tokens,
      });
    }
  }

  return res.status(200).json({ received: true });
}
`);

// ── 11. ADMIN API ─────────────────────────────────────────────
write("pages/api/admin/stats.js", `
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { connectDB } from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Investment from "../../../lib/models/Investment";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  await connectDB();
  const [totalUsers, kycPending, kycApproved, totalInvestments, investments] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ kycStatus: "pending"  }),
    User.countDocuments({ kycStatus: "approved" }),
    Investment.countDocuments({ status: "confirmed" }),
    Investment.aggregate([{ \$group: { _id: null, total: { \$sum: "\$amount" } } }]),
  ]);
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select("-password");
  return res.status(200).json({
    totalUsers,
    kycPending,
    kycApproved,
    totalInvestments,
    totalVolume: investments[0]?.total || 0,
    recentUsers,
  });
}
`);

// ── 12. ADMIN DASHBOARD PAGE ──────────────────────────────────
write("pages/admin/index.js", `
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const S = {
  page: { minHeight:"100vh", background:"#05060a", color:"#e8e8f0", fontFamily:"'DM Sans',system-ui,sans-serif" },
  card: { background:"#0d0d14", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:24 },
  lbl:  { fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#8a9bb8" },
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status === "authenticated") {
      if (session.user.role !== "admin") { router.push("/dashboard"); return; }
      fetch("/api/admin/stats")
        .then(r => r.json())
        .then(d => { setStats(d); setLoading(false); });
    }
  }, [status, session]);

  if (loading) return (
    <div style={{ ...S.page, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, border:"3px solid rgba(240,185,11,0.2)", borderTop:"3px solid #F0B90B", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px" }} />
        <p style={{ color:"#8a9bb8" }}>Loading admin panel...</p>
      </div>
      <style>{\`@keyframes spin { to { transform:rotate(360deg); } }\`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{\`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} body{margin:0} @keyframes spin{to{transform:rotate(360deg)}}\`}</style>
      <div style={{ maxWidth:1300, margin:"0 auto", padding:"32px 24px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:12 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F0B90B", marginBottom:4 }}>Admin Panel</p>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:28, fontWeight:800, color:"#e8e8f0", margin:0 }}>Nextoken Admin Dashboard</h1>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Link href="/admin/users" style={{ padding:"9px 18px", borderRadius:9, border:"1px solid rgba(255,255,255,0.1)", color:"#b0b0c8", textDecoration:"none", fontSize:13 }}>Manage Users</Link>
            <Link href="/admin/kyc" style={{ padding:"9px 18px", borderRadius:9, background:"rgba(245,158,11,0.12)", border:"1px solid rgba(245,158,11,0.3)", color:"#f59e0b", textDecoration:"none", fontSize:13, fontWeight:700 }}>
              KYC Queue {stats?.kycPending > 0 && <span style={{ marginLeft:6, background:"#f59e0b", color:"#000", borderRadius:10, padding:"1px 7px", fontSize:11, fontWeight:800 }}>{stats.kycPending}</span>}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
          {[
            { icon:"👥", l:"Total Users",       v:stats?.totalUsers       || 0, color:"#F0B90B"  },
            { icon:"⏳", l:"KYC Pending",       v:stats?.kycPending       || 0, color:"#f59e0b"  },
            { icon:"✅", l:"KYC Approved",      v:stats?.kycApproved      || 0, color:"#22c55e"  },
            { icon:"💰", l:"Total Investments", v:stats?.totalInvestments || 0, color:"#818cf8"  },
            { icon:"💶", l:"Total Volume",      v:"EUR "+(stats?.totalVolume||0).toLocaleString(), color:"#38bdf8" },
          ].map(s => (
            <div key={s.l} style={S.card}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontSize:11, color:"#8a9bb8", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:5 }}>{s.l}</div>
              <div style={{ fontFamily:"Syne,sans-serif", fontSize:26, fontWeight:800, color:s.color }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        <div style={S.card}>
          <p style={{ ...S.lbl, marginBottom:20 }}>Recent Registrations</p>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#12121c" }}>
                  {["Name","Email","Type","KYC Status","Country","Joined","Actions"].map(h => (
                    <th key={h} style={{ padding:"12px 16px", fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", color:"#8a9bb8", borderBottom:"1px solid rgba(255,255,255,0.07)", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(stats?.recentUsers || []).map(u => (
                  <tr key={u._id} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 16px", fontWeight:600, color:"#e8e8f0" }}>{u.firstName} {u.lastName}</td>
                    <td style={{ padding:"13px 16px", fontSize:13, color:"#8a9bb8" }}>{u.email}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ padding:"2px 8px", borderRadius:6, fontSize:11, background:"rgba(255,255,255,0.05)", color:"#8a9bb8", border:"1px solid rgba(255,255,255,0.08)" }}>{u.accountType}</span>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                        background: u.kycStatus==="approved"?"rgba(34,197,94,0.1)":u.kycStatus==="pending"?"rgba(245,158,11,0.1)":u.kycStatus==="rejected"?"rgba(239,68,68,0.1)":"rgba(255,255,255,0.05)",
                        color:      u.kycStatus==="approved"?"#22c55e":u.kycStatus==="pending"?"#f59e0b":u.kycStatus==="rejected"?"#ef4444":"#8a9bb8",
                        border:     "1px solid "+(u.kycStatus==="approved"?"rgba(34,197,94,0.25)":u.kycStatus==="pending"?"rgba(245,158,11,0.25)":"rgba(255,255,255,0.08)"),
                      }}>{u.kycStatus || "none"}</span>
                    </td>
                    <td style={{ padding:"13px 16px", fontSize:13, color:"#8a9bb8" }}>{u.country || "—"}</td>
                    <td style={{ padding:"13px 16px", fontSize:12, color:"#8a9bb8" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <Link href={"/admin/users/"+u._id} style={{ padding:"5px 12px", borderRadius:7, border:"1px solid rgba(240,185,11,0.3)", color:"#F0B90B", fontSize:12, fontWeight:600, textDecoration:"none" }}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
`);

// ── 13. UPDATE _app.js to include SessionProvider ─────────────
write("lib/session-note.txt", `
IMPORTANT: Add SessionProvider to _app.js

In pages/_app.js, add at the top:
  import { SessionProvider } from "next-auth/react";

Wrap your app:
  <SessionProvider session={pageProps.session}>
    ... existing providers ...
  </SessionProvider>
`);

console.log("\n✅ All backend files created!");
console.log("\nFiles created:");
console.log("  lib/models/User.js          — User schema");
console.log("  lib/models/Investment.js    — Investment schema");
console.log("  lib/mongodb.js              — DB connection");
console.log("  lib/email.js                — Email templates (Resend)");
console.log("  pages/api/auth/[...nextauth].js — Auth");
console.log("  pages/api/auth/register.js  — Register API");
console.log("  pages/api/kyc/token.js      — Sumsub KYC token");
console.log("  pages/api/kyc/webhook.js    — KYC status webhook");
console.log("  pages/api/payments/create-intent.js — Stripe");
console.log("  pages/api/payments/webhook.js       — Stripe webhook");
console.log("  pages/api/admin/stats.js    — Admin stats API");
console.log("  pages/admin/index.js        — Admin dashboard");
console.log("\nNext: Add SessionProvider to _app.js!");