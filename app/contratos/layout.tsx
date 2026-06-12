import Link from "next/link";
import { BotaoSair } from "./botao-sair";

export default function ContratosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/contratos" className="font-bold">
            CRM Contratos{" "}
            <span className="font-normal text-gray-400">· Arte Final</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/contratos" className="hover:text-blue-600">
              Contratos
            </Link>
            <Link
              href="/contratos/novo"
              className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white hover:bg-blue-700"
            >
              + Novo contrato
            </Link>
            <BotaoSair />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
