import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getConvexClient } from "./convex";
import { api } from "@/convex/_generated/api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Mangler e-post eller passord");
        }

        const convex = getConvexClient();
        
        // Hent bruker fra Convex basert på e-post
        const user = await convex.query(api.users.getUserByEmail, {
          email: credentials.email,
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Ugyldig e-post eller passord");
        }

        // Verifiser passord
        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          throw new Error("Ugyldig e-post eller passord");
        }

        // Returner bruker-objektet som NextAuth bruker
        return {
          id: user.userId, // Bruk userId, ikke _id
          email: user.email,
          name: user.name,
          isOrganizer: user.isOrganizer || false,
          organizationNumber: user.organizationNumber,
          organizerName: user.organizerName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Første gang JWT opprettes (ved innlogging)
      if (user) {
        token.id = user.id;
        token.isOrganizer = user.isOrganizer;
        token.organizationNumber = user.organizationNumber;
        token.organizerName = user.organizerName;
      }
      return token;
    },
    async session({ session, token }) {
      // Legg til custom felter i session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isOrganizer = token.isOrganizer as boolean;
        session.user.organizationNumber = token.organizationNumber as string;
        session.user.organizerName = token.organizerName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dager
  },
  secret: process.env.NEXTAUTH_SECRET,
};
