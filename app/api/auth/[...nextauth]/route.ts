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
        SELECT * FROM users WHERE email=${credentials?.email}`;
        const user = response.rows[0]

        const passCorrect = await compare(
          credentials?.password || '',
          user.password
        )

        // console.log('next-auth', { passCorrect, user });

        if (passCorrect) {
          return {
            id: user.id,
            email: user.email,
            firstname: user?.firstname,
            lastname: user?.lastname,
            subscription: user?.subscription,
            renewal: user?.renewal,
            downloads: user?.downloads
          }
        }

        return null;
      }
    })
  ]
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
