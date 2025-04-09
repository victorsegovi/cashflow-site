import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return NextResponse.json(
      { error: "Server configuration error: Missing Supabase environment variables." },
      { status: 500 }
    );
  }

  // Initialize Supabase client here, now that we know the vars exist
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Obtener la URL pública del archivo
    const { data } = await supabase.storage.from("anual").getPublicUrl("premium.xlsx");

    // Verificar si hay datos
    if (!data || !data.publicUrl) {
      return NextResponse.json(
        { error: "No se pudo obtener la URL del archivo." },
        { status: 404 } // Use 404 for "Not Found"
      );
    }

    return NextResponse.json({ fileURL: data.publicUrl });
  } catch (error) {
    console.error("Error al obtener el archivo:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
}