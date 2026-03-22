
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = "Nextoken Capital <noreply@nextokencapital.com>";

export async function sendWelcomeEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Welcome to Nextoken Capital",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
            <span style="font-size:13px;font-weight:800;letter-spacing:3px;color:#F0B90B;margin-left:10px">NEXTOKEN CAPITAL</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#e8e8f0;margin:0 0 12px">Welcome, ${firstName}! 🎉</h1>
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
      `,
    });
  } catch (e) { console.error("Welcome email error:", e); }
}

export async function sendKycApprovedEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "KYC Approved — You can now invest on Nextoken Capital",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
            <span style="font-size:13px;font-weight:800;letter-spacing:3px;color:#F0B90B;margin-left:10px">NEXTOKEN CAPITAL</span>
          </div>
          <div style="font-size:48px;margin-bottom:16px">✅</div>
          <h1 style="font-size:26px;font-weight:800;color:#22c55e;margin:0 0 12px">KYC Approved, ${firstName}!</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Your identity verification has been approved. You now have full access to invest in tokenized bonds, equity, real estate, and energy assets on Nextoken Capital.
          </p>
          <a href="https://nextokencapital.com/markets" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Start Investing →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania · Regulated by Bank of Lithuania</p>
        </div>
      `,
    });
  } catch (e) { console.error("KYC approved email error:", e); }
}

export async function sendKycRejectedEmail({ email, firstName }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "KYC Verification — Action Required",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#ef4444;margin:0 0 12px">Verification Needs Attention</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Hi ${firstName}, we were unable to verify your identity with the documents provided. Please resubmit with clearer photos or a different document.
          </p>
          <a href="https://nextokencapital.com/register" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Retry Verification →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania</p>
        </div>
      `,
    });
  } catch (e) { console.error("KYC rejected email error:", e); }
}

export async function sendPasswordResetEmail({ email, firstName, resetUrl }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Reset Your Nextoken Capital Password",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#e8e8f0;margin:0 0 12px">Password Reset Request</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">
            Hi ${firstName}, we received a request to reset your password. Click below to set a new password. This link expires in 30 minutes.
          </p>
          <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            Reset Password →
          </a>
          <p style="font-size:13px;color:#8a9bb8;margin-top:20px">If you did not request this, ignore this email. Your password will not change.</p>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania</p>
        </div>
      `,
    });
  } catch (e) { console.error("Password reset email error:", e); }
}

export async function sendInvestmentConfirmationEmail({ email, firstName, assetName, amount, tokens }) {
  try {
    await resend.emails.send({
      from:    FROM,
      to:      email,
      subject: "Investment Confirmed — " + assetName,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#05060a;color:#e8e8f0;border-radius:16px">
          <div style="margin-bottom:28px">
            <span style="font-size:22px;font-weight:900;color:#F0B90B;letter-spacing:2px">NXT</span>
          </div>
          <h1 style="font-size:26px;font-weight:800;color:#22c55e;margin:0 0 12px">Investment Confirmed ✅</h1>
          <p style="font-size:15px;color:#8a9bb8;line-height:1.7;margin:0 0 20px">Hi ${firstName}, your investment in <strong style="color:#F0B90B">${assetName}</strong> has been confirmed.</p>
          <div style="background:#0d0d14;border:1px solid rgba(240,185,11,0.2);border-radius:12px;padding:20px;margin-bottom:24px">
            <p style="font-size:13px;color:#8a9bb8;margin:0 0 8px">Amount Invested: <strong style="color:#e8e8f0">EUR ${amount}</strong></p>
            <p style="font-size:13px;color:#8a9bb8;margin:0">Tokens Received: <strong style="color:#F0B90B">${tokens} tokens</strong></p>
          </div>
          <a href="https://nextokencapital.com/dashboard" style="display:inline-block;padding:14px 28px;background:#F0B90B;color:#000;font-weight:800;font-size:14px;text-decoration:none;border-radius:10px">
            View Portfolio →
          </a>
          <p style="font-size:11px;color:#8a9bb8;margin-top:28px">Nextoken Capital UAB · Vilnius, Lithuania · Regulated by Bank of Lithuania</p>
        </div>
      `,
    });
  } catch (e) { console.error("Investment email error:", e); }
}
