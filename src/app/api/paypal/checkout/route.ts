import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { NextResponse } from "next/server";

// Ensure environment variables exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(): Promise<NextResponse> {
  // Obtener la sesión del usuario autenticado
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener pedidos solo del usuario autenticado
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", session.user.email); // Filtrar por email

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
