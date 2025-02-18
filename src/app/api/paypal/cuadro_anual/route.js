import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export async function GET() {
  const { data } = supabase.storage.from("anual").getPublicUrl("premium.xlsx");

  return Response.json({ fileURL: data.publicUrl });
}
