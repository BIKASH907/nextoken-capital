export default function handler(req, res) {
  res.json({
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "SET: " + process.env.GOOGLE_CLIENT_ID.substring(0,20) : "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET: " + process.env.GOOGLE_CLIENT_SECRET.substring(0,10) : "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
  });
}
