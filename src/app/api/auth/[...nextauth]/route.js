import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const authOptions = NextAuth({
  providers: [
    // Proveedor de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // Proveedor de credenciales (email y contraseña)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Verificar si el usuario existe en la base de datos
        const { data, error } = await supabase
          .from("cashflow-db")
          .select("email, password")
          .eq("email", credentials.email)
          .single();

          console.log(credentials)

          if (error || !data) return null; // Usuario no encontrado

          const passwordMatch = await bcrypt.compare(credentials.password, data.password);
          if (!passwordMatch) return null; // Contraseña incorrecta
  
          return { email: data.email }; // Usuario autenticado
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // Este callback se ejecuta después de iniciar sesión con Google
    async jwt({ token, account, profile }) {
      // Si estamos usando Google para iniciar sesión
      if (account?.provider === "google") {
        // Verificar si el usuario existe en la base de datos
        const { data, error } = await supabase
          .from("cashflow-db")
          .select("email")
          .eq("email", profile.email)
          .single();

        // Si el usuario no existe, lo insertamos
        if (!data) {
          const { error: insertError } = await supabase
            .from("cashflow-db")
            .insert([{ email: profile.email, password: null }]); // Agregar otros datos si es necesario

          if (insertError) {
            console.error("Error inserting user:", insertError.message);
          }
        }

        // Añadir los datos del usuario al token
        token.email = profile.email;
      }

      return token;
    },

    async session({ session, token }) {
      // Añadir el email del token a la sesión
      session.user.email = token.email;
      return session;
    },
  },
});

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
