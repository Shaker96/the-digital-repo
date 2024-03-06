import { sql } from '@vercel/postgres';
import { compare } from 'bcrypt';
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/'
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('token', token, user);

      user && (token.user = user);
      return token;
    },
    async session({ session, token }: any) {
      // console.log('session', session, token);
      
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { },
        password: { }
      },
      async authorize(credentials, req) {

        const response = await sql`
          SELECT u.*, su.*, s.name, s.downloads as total_downloads, s.uploads as total_uploads 
          FROM users u
          LEFT JOIN subscribed_users su ON u.id = su.user_id 
          LEFT JOIN subscriptions s ON su.subscription_id = s.id 
          WHERE u.email=${credentials?.email}`;
        const user = response.rows[0]

        console.log('next-auth', {response, credentials, user });

        const passCorrect = await compare(
          credentials?.password || '',
          user.password
        )


        if (passCorrect) {
          return {
            id: user.id,
            email: user.email,
            firstname: user?.firstname,
            lastname: user?.lastname,
            expiryDate: user?.expiry_date,
            downloads: user?.downloads,
            uploads: user?.uploads,
            totalDownloads: user?.total_downloads,
            totalUploads: user?.total_uploads,
            subName: user?.name,
            isSub: user?.is_subscribed
          }
        }

        return null;
      }
    })
  ]
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
