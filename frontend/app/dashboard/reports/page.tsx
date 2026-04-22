import Link from 'next/link';

export default function ReportsPage() {
  return (
    <section className="rounded-lg border border-[#c3c6d2] bg-white p-6">
      <h1 className="text-4xl font-extrabold text-[#002a5c]">Relatorios</h1>
      <p className="mt-2 text-[#434751]">
        Centralize exportacao e acompanhamento de dados consolidados de produtos, usuarios, categorias e auditoria.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <article className="rounded border border-[#c3c6d2] p-4 bg-[#f7f9ff]">
          <h2 className="font-bold text-[#181c20]">Relatorio de Auditoria</h2>
          <p className="text-sm text-[#434751] mt-1">Eventos por periodo, usuario e acao.</p>
          <Link href="/dashboard/audits" className="inline-flex mt-4 text-[#0c458b] text-sm font-semibold hover:underline">
            Abrir painel
          </Link>
        </article>
        <article className="rounded border border-[#c3c6d2] p-4 bg-[#f7f9ff]">
          <h2 className="font-bold text-[#181c20]">Relatorio de Produtos</h2>
          <p className="text-sm text-[#434751] mt-1">Status de estoque, categorias e tendencia de cadastro.</p>
        </article>
        <article className="rounded border border-[#c3c6d2] p-4 bg-[#f7f9ff]">
          <h2 className="font-bold text-[#181c20]">Relatorio de Usuarios</h2>
          <p className="text-sm text-[#434751] mt-1">Perfis ativos e distribuicao por permissao.</p>
        </article>
      </div>
    </section>
  );
}
