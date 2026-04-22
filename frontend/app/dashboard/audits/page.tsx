'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getAuthToken, getAuthUser } from '@/lib/auth';

type AuditItem = {
  id: string;
  action: string;
  resource: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'USER';
  };
};

type AuditResponse = {
  page: number;
  perPage: number;
  total: number;
  items: AuditItem[];
};

export default function AuditsPage() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [total, setTotal] = useState(0);

  const isAdmin = useMemo(() => getAuthUser()?.role === 'ADMIN', []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !isAdmin) return;

    async function loadAudits() {
      try {
        setLoading(true);
        setFeedback('');

        const params = new URLSearchParams({ page: String(page) });
        if (query) params.set('action', query);
        if (fromDate) params.set('from', `${fromDate}T00:00:00.000Z`);
        if (toDate) params.set('to', `${toDate}T23:59:59.999Z`);

        const data = await apiFetch<AuditResponse>(
          `/reports/audits?${params.toString()}`,
          undefined,
          token ?? undefined,
        );

        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    }

    loadAudits();
  }, [page, query, fromDate, toDate, isAdmin]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  }

  if (!isAdmin) {
    return (
      <div className="rounded border border-[#ffdad6] bg-[#ffdad6] p-5 text-[#93000a]">
        Apenas administradores podem acessar o painel de auditoria.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="inline-flex rounded bg-[#d7e3ff] text-[#0c458b] px-2 py-1 text-xs font-bold uppercase tracking-wider">
            Admin Access Only
          </span>
          <h1 className="mt-2 text-4xl font-extrabold text-[#181c20]">Painel de Auditoria</h1>
          <p className="mt-1 text-[#434751]">Monitore e rastreie todas as atividades criticas do sistema.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <form onSubmit={handleSearch} className="md:col-span-2 rounded border border-[#c3c6d2] bg-white p-4">
          <label className="block text-sm font-semibold text-[#434751] mb-2">Pesquisa Global</label>
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Buscar por usuario, acao ou recurso..."
            className="w-full h-11 rounded border border-[#c3c6d2] px-3"
          />
        </form>

        <div className="rounded border border-[#c3c6d2] bg-white p-4">
          <label className="block text-sm font-semibold text-[#434751] mb-2">Periodo inicial</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full h-11 rounded border border-[#c3c6d2] px-3" />
        </div>

        <div className="rounded border border-[#c3c6d2] bg-white p-4">
          <label className="block text-sm font-semibold text-[#434751] mb-2">Periodo final</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full h-11 rounded border border-[#c3c6d2] px-3" />
        </div>
      </section>

      <div className="flex justify-end">
        <button onClick={() => setPage(1)} className="h-10 rounded bg-[#004085] text-white px-5 font-semibold">
          Aplicar filtros
        </button>
      </div>

      {feedback ? (
        <div className="rounded border border-[#ffdad6] bg-[#ffdad6] p-3 text-[#93000a] text-sm">{feedback}</div>
      ) : null}

      <section className="rounded border border-[#c3c6d2] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#004085] text-white text-sm">
                <th className="px-4 py-3">Data/Hora</th>
                <th className="px-4 py-3">Acao</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Recurso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e8]">
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-[#434751]" colSpan={4}>
                    Loading audit logs...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-[#f1f4f9]">
                    <td className="px-4 py-3 text-sm text-[#434751]">{new Date(item.timestamp).toLocaleString('pt-BR')}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#181c20]">{item.action}</td>
                    <td className="px-4 py-3 text-sm text-[#181c20]">{item.user.name}</td>
                    <td className="px-4 py-3 text-sm text-[#434751]">{item.resource}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-[#434751]" colSpan={4}>
                    Nenhum log encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-[#f1f4f9] px-4 py-3 border-t border-[#e0e3e8] flex items-center justify-between">
          <span className="text-sm text-[#434751]">Mostrando {items.length} de {total} registros</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-[#c3c6d2] text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="w-8 h-8 rounded bg-[#002a5c] text-white inline-flex items-center justify-center text-sm font-bold">
              {page}
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1.5 rounded border border-[#c3c6d2] text-sm"
            >
              Proxima
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
