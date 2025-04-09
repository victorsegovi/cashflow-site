import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { prompt: "select_account" } },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const { data, error } = await supabase
          .from("cashflow-db")
          .select("email, password")
          .eq("email", credentials.email)
          .single();

        if (error) {
          console.error("Supabase error:", error.message);
          return null;
        }

        if (!data) return null;

        const passwordMatch = await bcrypt.compare(credentials.password, data.password);
        if (!passwordMatch) return null;

        return { id: data.email, email: data.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const { data} = await supabase
          .from("cashflow-db")
          .select("email")
          .eq("email", profile.email)
          .single();

        if (!data) {
          const { error: insertError } = await supabase
            .from("cashflow-db")
            .insert([{ email: profile.email, password: null }]);

          if (insertError) {
            console.error("Error inserting user:", insertError.message);
          }
        }

        token.email = profile.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
};
