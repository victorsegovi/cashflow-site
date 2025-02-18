import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    console.log("Usuario autenticado:", session.user.email);

    const auth = Buffer.from(`${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.NEXT_PUBLIC_PAYPAL_SECRET}`).toString("base64");

    const response = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: "5.00" } }],
      }),
    });

    const data = await response.json();
    console.log("Orden creada:", data);

    if (data.id) {
      const { error } = await supabase.from("orders").insert([
        { order_id: data.id, email: session.user.email }
      ]);

      if (error) {
        console.error("Error al insertar en Supabase:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log("Orden guardada en Supabase con éxito");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en el handler:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
