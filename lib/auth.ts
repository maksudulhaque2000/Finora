import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authSchema } from '@/lib/validators';
import { authSecret } from '@/lib/auth-secret';

const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: (() => {
        const isProd = process.env.NODE_ENV === 'production';
        const opts: Record<string, any> = {
          httpOnly: true,
          sameSite: isProd ? 'none' : 'lax',
          path: '/',
          secure: isProd
        };

        try {
          if (isProd && process.env.NEXTAUTH_URL) {
            const url = new URL(process.env.NEXTAUTH_URL);
            if (!/localhost|:\d+$/.test(url.hostname)) {
              opts.domain = url.hostname;
            }
          }
        } catch (e) {
          // ignore
        }

        return opts;
      })()
    }
  },
  pages: {
    signIn: '/login'
  },
  trustHost: true,
  secret: authSecret,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const parsed = authSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email.toLowerCase() }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await compare(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar ?? undefined
        };
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
          })
        ]
      : []),
    ...(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
      ? [
          Facebook({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true
          })
        ]
      : [])
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);