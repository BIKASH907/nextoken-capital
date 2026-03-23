import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../lib/mongodb';
import User from '../../../lib/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user) throw new Error('No account found with this email.');
        if (!user.password) throw new Error('Please sign in with Google.');
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error('Invalid password.');
        return { id: user._id.toString(), email: user.email, name: user.firstName + ' ' + user.lastName, firstName: user.firstName, kycStatus: user.kycStatus, role: user.role };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.kycStatus = user.kycStatus;
        token.role = user.role;
      }
      if (account?.provider === 'google' && profile) {
        try {
          await connectDB();
          let dbUser = await User.findOne({ email: token.email });
          if (!dbUser) {
            const nameParts = (profile.name || '').split(' ');
            dbUser = await User.create({
              email: token.email,
              firstName: nameParts[0] || 'User',
              lastName: nameParts.slice(1).join(' ') || '',
              password: null,
              isActive: true,
              kycStatus: 'none',
              role: 'user',
            });
          }
          token.id = dbUser._id.toString();
          token.firstName = dbUser.firstName;
          token.kycStatus = dbUser.kycStatus;
          token.role = dbUser.role;
        } catch(e) { console.error('JWT error:', e.message); }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.kycStatus = token.kycStatus;
      session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "SET" : "MISSING");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "SET" : "MISSING");
export default NextAuth(authOptions);
