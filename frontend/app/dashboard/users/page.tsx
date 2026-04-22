'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getAuthToken, getAuthUser } from '@/lib/auth';

type UserItem = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
};

type FetchUsersResponse = {
  users: UserItem[];
};

export default function UsersPage() {
  const [items, setItems] = useState<UserItem[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const isAdmin = useMemo(() => getAuthUser()?.role === 'ADMIN', []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !isAdmin) return;

    async function loadUsers() {
      try {
        setLoading(true);
        setFeedback('');

        const data = await apiFetch<FetchUsersResponse>(
          `/users?page=${page}&query=${encodeURIComponent(query)}`,
          undefined,
          token ?? undefined,
        );
        setItems(data.users ?? []);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [page, query, isAdmin]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  }

  if (!isAdmin) {
    return (
      <div className="rounded border border-[#ffdad6] bg-[#ffdad6] p-5 text-[#93000a]">
        Apenas administradores podem acessar a tela de usuarios.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-[#c3c6d2] bg-white p-5">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Buscar por nome ou email..."
            className="h-11 rounded border border-[#c3c6d2] px-3"
          />
          <button className="h-11 rounded bg-[#004085] text-white px-5 font-semibold" type="submit">
            Buscar
          </button>
        </form>

        {feedback ? (
          <div className="mt-4 rounded border border-[#d7e3ff] bg-[#d7e3ff] p-3 text-[#0c458b] text-sm">
            {feedback}
          </div>
        ) : null}

        <div className="mt-5 rounded border border-[#c3c6d2] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#004085] text-white text-sm">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Perfil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e8] bg-white">
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-[#434751]" colSpan={3}>
                    Loading users...
                  </td>
                </tr>
              ) : items.length ? (
                items.map((user) => (
                  <tr key={user.id} className="hover:bg-[#f1f4f9]">
                    <td className="px-4 py-3 font-medium text-[#181c20]">{user.name}</td>
                    <td className="px-4 py-3 text-[#434751]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                          user.role === 'ADMIN'
                            ? 'bg-[#d7e3ff] text-[#0c458b]'
                            : 'bg-[#ebeef3] text-[#434751]',
                        ].join(' ')}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-4 text-[#434751]" colSpan={3}>
                    Nenhum usuario encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded border border-[#c3c6d2] text-sm disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-[#434751]">Pagina {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1.5 rounded border border-[#c3c6d2] text-sm"
          >
            Proxima
          </button>
        </div>
      </section>
    </div>
  );
}
