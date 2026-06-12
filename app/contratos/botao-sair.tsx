"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BotaoSair() {
  const router = useRouter();

  async function sair() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={sair} className="text-gray-500 hover:text-red-600">
      Sair
    </button>
  );
}
