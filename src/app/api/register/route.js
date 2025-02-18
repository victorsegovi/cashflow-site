import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use Service Role Key for inserts
);

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(email, password)
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from("cashflow-db")
      .insert([{ email, password: hashedPassword }]);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
