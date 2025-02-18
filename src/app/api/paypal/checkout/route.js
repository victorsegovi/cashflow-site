import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  // Obtener la sesión del usuario autenticado
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  // Obtener pedidos solo del usuario autenticado
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("email", session.user.email); // Filtrar por email

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 200 });
}
