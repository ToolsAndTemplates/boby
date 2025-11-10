import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from './db'
import * as bcrypt from 'bcrypt'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            branch: true,
          },
        })

        if (!user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!passwordMatch) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: user.branchId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.branchId = user.branchId
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.branchId = token.branchId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
})
