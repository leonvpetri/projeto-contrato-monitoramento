import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });
  }

  const { data: c } = await supabase
    .from("contratos")
    .select("pdf_path")
    .eq("id", id)
    .single();
  if (!c?.pdf_path) {
    return NextResponse.json({ erro: "PDF ainda não gerado" }, { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("contratos-pdf")
    .createSignedUrl(c.pdf_path, 60);
  if (error || !data) {
    return NextResponse.json({ erro: "Falha ao acessar o PDF" }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
