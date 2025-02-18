import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Solo para backend
);

export async function POST(req) {
  try {
    const { phone, email } = await req.json(); // Recibe también el email

    if (!email || !phone) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Actualizar solo la fila donde el email coincide
    const { error } = await supabase
      .from("cashflow-db") // Cambia esto si el nombre de la tabla es diferente
      .update({ phone: phone })
      .eq("email", email); // Filtra por el email del usuario

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
