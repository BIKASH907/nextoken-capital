
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const { connectDB } = await import('../../../lib/mongodb');
          const User = (await import('../../../lib/models/User')).default;
          await connectDB();
          const existing = await User.findOne({ email: user.email });
          if (!existing) {
            const nameParts = (user.name || '').split(' ');
            await User.create({
              email: user.email,
              firstName: nameParts[0] || 'User',
              lastName: nameParts.slice(1).join(' ') || '',
              password: null,
              provider: 'google',
              isActive: true,
              kycStatus: 'none',
              role: 'investor',
            });
          }
        } catch(e) { console.error('Google signIn error:', e); }
      }
      return true;
    },
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const { connectDB } = await import('../../../lib/mongodb');
          const User = (await import('../../../lib/models/User')).default;
          await connectDB();
          const existing = await User.findOne({ email: user.email });
          if (!existing) {
            const nameParts = (user.name || '').split(' ');
            await User.create({
              email: user.email,
              firstName: nameParts[0] || 'User',
              lastName: nameParts.slice(1).join(' ') || '',
              password: null,
              provider: 'google',
              isActive: true,
              kycStatus: 'none',
              role: 'investor',
            });
          }
        } catch(e) { console.error('Google signIn error:', e); }
      }
      return true;
    },
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
