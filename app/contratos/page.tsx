import { createClient } from "@/lib/supabase/server";
import { formatarValor, formatarData } from "@/lib/contrato/formatadores";
import { AcoesContrato } from "./acoes";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { rotulo: string; cor: string }> = {
  pendente: { rotulo: "Pendente", cor: "bg-gray-100 text-gray-700" },
  gerado: { rotulo: "PDF gerado", cor: "bg-yellow-100 text-yellow-800" },
  enviado: { rotulo: "Enviado", cor: "bg-green-100 text-green-800" },
  erro: { rotulo: "Erro", cor: "bg-red-100 text-red-700" },
};

export default async function ContratosPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; aviso?: string }>;
}) {
  const { ok, aviso } = await searchParams;
  const supabase = await createClient();
  const { data: contratos } = await supabase
    .from("contratos")
    .select(
      "id, contratante, cidade, valor_total, data_assinatura, status_envio, erro_envio, pdf_path, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Contratos</h1>

      {ok && (
        <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">
          Contrato salvo e processado com sucesso.
        </p>
      )}
      {aviso === "geracao" && (
        <p className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
          Contrato salvo, mas houve um problema ao gerar/enviar o PDF. Use
          “Gerar/Reenviar” para tentar novamente.
        </p>
      )}

      {!contratos?.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          Nenhum contrato cadastrado ainda.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                <th className="px-4 py-3">Contratante</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Total mensal</th>
                <th className="px-4 py-3">Assinatura</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => {
                const s = STATUS[c.status_envio] ?? STATUS.pendente;
                return (
                  <tr key={c.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-medium">{c.contratante}</td>
                    <td className="px-4 py-3">{c.cidade}</td>
                    <td className="px-4 py-3">R$ {formatarValor(Number(c.valor_total))}</td>
                    <td className="px-4 py-3">{formatarData(c.data_assinatura)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.cor}`}
                        title={c.erro_envio ?? undefined}
                      >
                        {s.rotulo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <AcoesContrato id={c.id} temPdf={!!c.pdf_path} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
