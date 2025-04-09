import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Ensure environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string;
const paypalSecret = process.env.NEXT_PUBLIC_PAYPAL_SECRET as string;

if (!supabaseUrl || !supabaseKey || !paypalClientId || !paypalSecret) {
  throw new Error("Missing required environment variables");
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    console.log("Usuario autenticado:", session.user.email);

    // Encode PayPal credentials
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString("base64");

    // Fetch PayPal order creation API
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

    const data: { id?: string; error?: string } = await response.json();
    console.log("Orden creada:", data);

    if (!data.id) {
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
    }

    // Store order in Supabase
    const { error } = await supabase.from("orders").insert([
      { order_id: data.id, email: session.user.email },
    ]);

    if (error) {
      console.error("Error al insertar en Supabase:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Orden guardada en Supabase con éxito");

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    console.error("Error en el handler:", (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
