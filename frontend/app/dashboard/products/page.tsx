'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';

type Product = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  categories?: { id: string; name: string }[];
  user?: { name: string };
};

type FetchProductsResponse = {
  products: Product[];
};

const productImage = [
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1200&auto=format&fit=crop',
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    async function loadProducts() {
      try {
        setLoading(true);
        setFeedback('');
        const data = await apiFetch<FetchProductsResponse>(
          `/products?page=${page}&query=${encodeURIComponent(query)}`,
          undefined,
          token ?? undefined,
        );
        setProducts(data.products ?? []);
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Failed to load products.');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [page, query]);

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setQuery(queryInput.trim());
  }

  const hasProducts = useMemo(() => products.length > 0, [products]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#c3c6d2] bg-white p-5">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end" onSubmit={handleSearch}>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#434751] mb-2">Search Products</label>
            <input
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
              placeholder="Product name, SKU or ID..."
              className="w-full h-11 rounded border border-[#c3c6d2] px-3 focus:outline-none focus:ring-2 focus:ring-[#abc7ff] focus:border-[#0c458b]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#434751] mb-2">Category</label>
            <select className="w-full h-11 rounded border border-[#c3c6d2] px-3">
              <option>All Categories</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#434751] mb-2">Registry Date</label>
            <input type="date" className="w-full h-11 rounded border border-[#c3c6d2] px-3" />
          </div>
          <button
            type="submit"
            className="h-11 rounded bg-[#fdc003] text-[#6c5000] font-semibold hover:opacity-90"
          >
            Apply
          </button>
        </form>
      </section>

      {feedback ? (
        <div className="rounded border border-[#ffdad6] bg-[#ffdad6] text-[#93000a] px-4 py-3 text-sm">
          {feedback}
        </div>
      ) : null}

      <section>
        {loading ? (
          <p className="text-[#434751]">Loading products...</p>
        ) : hasProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product, index) => (
              <article key={product.id} className="rounded border border-[#c3c6d2] bg-white overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-44 relative">
                  <img
                    src={productImage[index % productImage.length]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-[#004085] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wide">
                    In stock
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wider text-[#785900] font-semibold mb-1">
                    {product.categories?.[0]?.name ?? 'General'}
                  </p>
                  <h3 className="text-lg font-bold text-[#181c20] line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-[#434751] mt-2 line-clamp-2">{product.description}</p>
                  <div className="border-t border-[#e0e3e8] mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-[#737782]">{new Date(product.createdAt).toLocaleDateString('pt-BR')}</span>
                    <button className="p-2 rounded hover:bg-[#f1f4f9]" aria-label="actions">
                      <span className="material-symbols-outlined text-[#0c458b]">more_vert</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded border border-[#c3c6d2] bg-white p-6 text-[#434751]">No products found.</div>
        )}
      </section>

      <section className="flex items-center justify-center gap-2 pb-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded border border-[#c3c6d2] text-[#0c458b] disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="w-10 h-10 rounded bg-[#002a5c] text-white inline-flex items-center justify-center font-bold">
          {page}
        </span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 rounded border border-[#c3c6d2] text-[#0c458b]"
        >
          Proxima
        </button>
      </section>
    </div>
  );
}
