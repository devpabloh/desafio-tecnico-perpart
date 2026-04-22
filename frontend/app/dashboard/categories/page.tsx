'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

type Category = {
  id: string;
  name: string;
  createdAt: string;
};

type CategoriesResponse = {
  categories: Category[];
};

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function loadCategories(token: string, currentPage: number, currentQuery: string) {
    try {
      setLoading(true);
      setFeedback('');
      const data = await apiFetch<CategoriesResponse>(
        `/categories?page=${currentPage}&query=${encodeURIComponent(currentQuery)}`,
        undefined,
        token,
      );
      setItems(data.categories ?? []);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Failed to load categories.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories(token, page, query);
  }, [page, query]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  }

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    const token = getAuthToken();
    if (!token) return;

    if (newCategoryName.trim().length < 3) {
      setFeedback('Category name must have at least 3 characters.');
      return;
    }

    try {
      setCreating(true);
      setFeedback('');
      await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: newCategoryName.trim() }),
      }, token);
      setNewCategoryName('');
      setFeedback('Category created successfully.');
      await loadCategories(token, 1, query);
      setPage(1);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Failed to create category.');
    } finally {
      setCreating(false);
    }
  }

  const hasItems = useMemo(() => items.length > 0, [items]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <article className="rounded-lg border border-[#c3c6d2] bg-white p-5">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
            <input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Buscar categoria por nome..."
              className="h-11 rounded border border-[#c3c6d2] px-3 focus:outline-none focus:ring-2 focus:ring-[#abc7ff] focus:border-[#0c458b]"
            />
            <button type="submit" className="h-11 rounded bg-[#004085] text-white font-semibold px-5">
              Buscar
            </button>
          </form>

          {feedback ? (
            <div className="mt-4 rounded border border-[#d7e3ff] bg-[#d7e3ff] px-4 py-3 text-[#0c458b] text-sm">
              {feedback}
            </div>
          ) : null}

          <div className="mt-5">
            {loading ? (
              <p className="text-[#434751]">Loading categories...</p>
            ) : hasItems ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((category) => (
                  <article key={category.id} className="rounded border border-[#c3c6d2] bg-[#f7f9ff] p-4">
                    <h3 className="text-lg font-semibold text-[#181c20]">{category.name}</h3>
                    <p className="text-xs text-[#737782] mt-3">
                      {new Date(category.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-[#434751]">No categories found.</p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2">
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
        </article>

        <article className="rounded-lg border border-[#c3c6d2] bg-white p-5 h-fit">
          <h2 className="text-2xl font-bold text-[#002a5c]">Nova Categoria</h2>
          <p className="text-sm text-[#434751] mt-1">Crie categorias para organizar os produtos institucionais.</p>

          <form onSubmit={handleCreate} className="mt-4 space-y-3">
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Ex.: Tecnologia"
              className="w-full h-11 rounded border border-[#c3c6d2] px-3"
            />
            <button
              type="submit"
              disabled={creating}
              className="w-full h-11 rounded bg-[#fdc003] text-[#6c5000] font-semibold disabled:opacity-60"
            >
              {creating ? 'Criando...' : 'Criar categoria'}
            </button>
          </form>
        </article>
      </section>
    </div>
  );
}
