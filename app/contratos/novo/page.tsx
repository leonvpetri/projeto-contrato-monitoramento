"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { contratoSchema } from "@/lib/contrato/schema";
import {
  formatarValor,
  valorPorExtenso,
  diaPorExtenso,
} from "@/lib/contrato/formatadores";
import { mascaraCnpj, mascaraCpf, mascaraCep, mascaraFone } from "@/lib/mascaras";

const vazio = {
  contratante: "",
  cidade: "",
  endereco: "",
  numero: "",
  bairro: "",
  cep: "",
  fone: "",
  email: "",
  cnpj: "",
  cpf: "",
  contatos: [
    { nome: "", numero: "" },
    { nome: "", numero: "" },
    { nome: "", numero: "" },
  ],
  enderecoServico: "",
  numeroServico: "",
  bairroServico: "",
  cepServico: "",
  cidadeServico: "",
  dataInicio: "",
  valorContrato: "",
  valorChip: "",
  diaVencimento: "",
  dataAssinatura: "",
};

type Form = typeof vazio;

function Campo({
  label,
  erro,
  children,
  className = "",
}: {
  label: string;
  erro?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {erro && <p className="mt-1 text-xs text-red-600">{erro}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

export default function NovoContratoPage() {
  const router = useRouter();
  const [f, setF] = useState<Form>(vazio);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [salvando, setSalvando] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  function setContato(i: number, campo: "nome" | "numero", v: string) {
    setF((prev) => {
      const contatos = prev.contatos.map((c, j) =>
        j === i ? { ...c, [campo]: v } : c
      );
      return { ...prev, contatos };
    });
  }

  const previa = useMemo(() => {
    const vc = parseFloat(f.valorContrato) || 0;
    const vch = parseFloat(f.valorChip) || 0;
    const total = vc + vch;
    const dia = parseInt(f.diaVencimento) || 0;
    return {
      total,
      totalFmt: formatarValor(total),
      totalExtenso: total > 0 ? valorPorExtenso(total) : "—",
      diaExtenso: dia >= 1 && dia <= 31 ? diaPorExtenso(dia) : "—",
    };
  }, [f.valorContrato, f.valorChip, f.diaVencimento]);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErroGeral(null);
    const parsed = contratoSchema.safeParse(f);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path.join(".")] = issue.message;
      }
      setErros(map);
      setErroGeral("Corrija os campos destacados.");
      return;
    }
    setErros({});
    setSalvando(true);

    const d = parsed.data;
    const supabase = createClient();
    const { data: linha, error } = await supabase
      .from("contratos")
      .insert({
        contratante: d.contratante,
        cidade: d.cidade,
        endereco: d.endereco,
        numero: d.numero,
        bairro: d.bairro,
        cep: d.cep,
        fone: d.fone,
        email: d.email,
        cnpj: d.cnpj,
        cpf: d.cpf,
        contatos: d.contatos,
        endereco_servico: d.enderecoServico,
        numero_servico: d.numeroServico,
        bairro_servico: d.bairroServico,
        cep_servico: d.cepServico,
        cidade_servico: d.cidadeServico,
        data_inicio: d.dataInicio,
        valor_contrato: d.valorContrato,
        valor_chip: d.valorChip,
        dia_vencimento: d.diaVencimento,
        data_assinatura: d.dataAssinatura,
      })
      .select("id")
      .single();

    if (error || !linha) {
      setErroGeral("Erro ao salvar o contrato: " + (error?.message ?? ""));
      setSalvando(false);
      return;
    }

    const resp = await fetch(`/api/contratos/${linha.id}/gerar`, {
      method: "POST",
    });
    if (!resp.ok) {
      // contrato salvo, mas geração falhou — a lista permite tentar de novo
      router.push("/contratos?aviso=geracao");
      return;
    }
    router.push("/contratos?ok=1");
  }

  return (
    <form onSubmit={salvar} className="space-y-6">
      <h1 className="text-xl font-bold">Novo contrato</h1>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Dados do contratante</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <Campo label="Contratante (nome/razão social)" erro={erros.contratante} className="sm:col-span-4">
            <input className={inputCls} value={f.contratante} onChange={(e) => set("contratante", e.target.value)} />
          </Campo>
          <Campo label="Cidade, Estado" erro={erros.cidade} className="sm:col-span-2">
            <input className={inputCls} placeholder="Uberlândia-MG" value={f.cidade} onChange={(e) => set("cidade", e.target.value)} />
          </Campo>
          <Campo label="Endereço" erro={erros.endereco} className="sm:col-span-3">
            <input className={inputCls} value={f.endereco} onChange={(e) => set("endereco", e.target.value)} />
          </Campo>
          <Campo label="Número" erro={erros.numero}>
            <input className={inputCls} value={f.numero} onChange={(e) => set("numero", e.target.value)} />
          </Campo>
          <Campo label="Bairro" erro={erros.bairro} className="sm:col-span-2">
            <input className={inputCls} value={f.bairro} onChange={(e) => set("bairro", e.target.value)} />
          </Campo>
          <Campo label="CEP" erro={erros.cep}>
            <input className={inputCls} value={f.cep} onChange={(e) => set("cep", mascaraCep(e.target.value))} />
          </Campo>
          <Campo label="Fone" erro={erros.fone} className="sm:col-span-2">
            <input className={inputCls} value={f.fone} onChange={(e) => set("fone", mascaraFone(e.target.value))} />
          </Campo>
          <Campo label="E-mail" erro={erros.email} className="sm:col-span-3">
            <input className={inputCls} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} />
          </Campo>
          <Campo label="CNPJ" erro={erros.cnpj} className="sm:col-span-3">
            <input className={inputCls} value={f.cnpj} onChange={(e) => set("cnpj", mascaraCnpj(e.target.value))} />
          </Campo>
          <Campo label="CPF" erro={erros.cpf} className="sm:col-span-3">
            <input className={inputCls} value={f.cpf} onChange={(e) => set("cpf", mascaraCpf(e.target.value))} />
          </Campo>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-1 font-semibold">Contatos para notificação</h2>
        <p className="mb-4 text-sm text-gray-500">
          Pessoas avisadas em caso de disparo do alarme (entram na tabela do contrato).
        </p>
        <div className="space-y-3">
          {f.contatos.map((c, i) => (
            <div key={i} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                className={inputCls}
                placeholder={`Nome do contato ${i + 1}`}
                value={c.nome}
                onChange={(e) => setContato(i, "nome", e.target.value)}
              />
              <input
                className={inputCls}
                placeholder="Número"
                value={c.numero}
                onChange={(e) => setContato(i, "numero", mascaraFone(e.target.value))}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Local de prestação do serviço</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          <Campo label="Endereço" erro={erros.enderecoServico} className="sm:col-span-3">
            <input className={inputCls} value={f.enderecoServico} onChange={(e) => set("enderecoServico", e.target.value)} />
          </Campo>
          <Campo label="Número" erro={erros.numeroServico}>
            <input className={inputCls} value={f.numeroServico} onChange={(e) => set("numeroServico", e.target.value)} />
          </Campo>
          <Campo label="Bairro" erro={erros.bairroServico} className="sm:col-span-2">
            <input className={inputCls} value={f.bairroServico} onChange={(e) => set("bairroServico", e.target.value)} />
          </Campo>
          <Campo label="CEP" erro={erros.cepServico}>
            <input className={inputCls} value={f.cepServico} onChange={(e) => set("cepServico", mascaraCep(e.target.value))} />
          </Campo>
          <Campo label="Cidade, Estado" erro={erros.cidadeServico} className="sm:col-span-2">
            <input className={inputCls} value={f.cidadeServico} onChange={(e) => set("cidadeServico", e.target.value)} />
          </Campo>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Valores e datas</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <Campo label="Valor mensal (R$)" erro={erros.valorContrato}>
            <input className={inputCls} type="number" step="0.01" min="0" value={f.valorContrato} onChange={(e) => set("valorContrato", e.target.value)} />
          </Campo>
          <Campo label="Valor do chip (R$)" erro={erros.valorChip}>
            <input className={inputCls} type="number" step="0.01" min="0" value={f.valorChip} onChange={(e) => set("valorChip", e.target.value)} />
          </Campo>
          <Campo label="Dia de vencimento" erro={erros.diaVencimento}>
            <input className={inputCls} type="number" min="1" max="31" value={f.diaVencimento} onChange={(e) => set("diaVencimento", e.target.value)} />
          </Campo>
          <Campo label="Início do contrato" erro={erros.dataInicio}>
            <input className={inputCls} type="date" value={f.dataInicio} onChange={(e) => set("dataInicio", e.target.value)} />
          </Campo>
          <Campo label="Data de assinatura" erro={erros.dataAssinatura}>
            <input className={inputCls} type="date" value={f.dataAssinatura} onChange={(e) => set("dataAssinatura", e.target.value)} />
          </Campo>
        </div>

        <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm">
          <p>
            <b>Total mensal:</b> R$ {previa.totalFmt}{" "}
            <span className="text-gray-600">({previa.totalExtenso})</span>
          </p>
          <p>
            <b>Dia por extenso:</b>{" "}
            <span className="text-gray-600">{previa.diaExtenso}</span>
          </p>
        </div>
      </section>

      {erroGeral && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{erroGeral}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={salvando}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {salvando ? "Salvando e gerando PDF…" : "Salvar e gerar contrato"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/contratos")}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm hover:bg-gray-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
