"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AcoesContrato({ id, temPdf }: { id: string; temPdf: boolean }) {
  const router = useRouter();
  const [processando, setProcessando] = useState(false);

  async function gerarEEnviar() {
    setProcessando(true);
    try {
      const resp = await fetch(`/api/contratos/${id}/gerar`, { method: "POST" });
      if (!resp.ok) {
        const corpo = await resp.json().catch(() => null);
        alert(corpo?.erro ?? "Falha ao gerar/enviar o contrato.");
      }
    } finally {
      setProcessando(false);
      router.refresh();
    }
  }

  return (
    <span className="inline-flex gap-2">
      {temPdf && (
        <a
          href={`/api/contratos/${id}/pdf`}
          target="_blank"
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
        >
          Baixar PDF
        </a>
      )}
      <button
        onClick={gerarEEnviar}
        disabled={processando}
        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {processando ? "Processando…" : temPdf ? "Reenviar" : "Gerar/Enviar"}
      </button>
    </span>
  );
}
