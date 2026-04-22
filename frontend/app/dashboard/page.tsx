"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { getAuthToken, getAuthUser } from '@/lib/auth';

type CategoryOption = {
  id: string;
  name: string;
};

const metrics = [
  { title: 'Total de Produtos', value: '1,284', icon: 'inventory_2', accent: 'border-[#002a5c]' },
  { title: 'Novas Categorias', value: '42', icon: 'category', accent: 'border-[#785900]' },
  { title: 'Usuarios Ativos', value: '318', icon: 'group', accent: 'border-[#0c458b]' },
  { title: 'Alertas de Auditoria', value: '07', icon: 'warning', accent: 'border-[#ba1a1a]' },
];

export default function DashboardPage() {
  const router = useRouter();
  const user = getAuthUser();
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createUserError, setCreateUserError] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'ADMIN' | 'USER'>('USER');
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [createProductError, setCreateProductError] = useState('');
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductCategoryIds, setNewProductCategoryIds] = useState<string[]>([]);

  const isAdmin = user?.role === 'ADMIN';

  async function handleCreateUser() {
    const token = getAuthToken();
    if (!token) {
      setCreateUserError('Sessao expirada. Faca login novamente.');
      return;
    }

    if (newUserName.trim().length < 3) {
      setCreateUserError('Nome deve ter no minimo 3 caracteres.');
      return;
    }

    if (!newUserEmail.includes('@')) {
      setCreateUserError('Informe um e-mail valido.');
      return;
    }

    if (newUserPassword.length < 6) {
      setCreateUserError('Senha deve ter no minimo 6 caracteres.');
      return;
    }

    try {
      setIsCreatingUser(true);
      setCreateUserError('');

      await apiFetch(
        '/users',
        {
          method: 'POST',
          body: JSON.stringify({
            name: newUserName.trim(),
            email: newUserEmail.trim(),
            password: newUserPassword,
            role: newUserRole,
          }),
        },
        token,
      );

      setIsCreateUserModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('USER');
      router.push('/dashboard/users');
    } catch (error) {
      setCreateUserError(error instanceof Error ? error.message : 'Falha ao criar usuario.');
    } finally {
      setIsCreatingUser(false);
    }
  }

  async function handleOpenCreateProductModal() {
    const token = getAuthToken();
    if (!token) {
      setCreateProductError('Sessao expirada. Faca login novamente.');
      return;
    }

    try {
      setCreateProductError('');
      setIsLoadingCategories(true);
      const data = await apiFetch<{ categories: CategoryOption[] }>(
        '/categories?page=1',
        undefined,
        token,
      );
      setCategoryOptions(data.categories ?? []);
      setIsCreateProductModalOpen(true);
    } catch (error) {
      setCreateProductError(
        error instanceof Error ? error.message : 'Falha ao carregar categorias.',
      );
    } finally {
      setIsLoadingCategories(false);
    }
  }

  function toggleCategory(categoryId: string) {
    setNewProductCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  }

  async function handleCreateProduct() {
    const token = getAuthToken();
    if (!token) {
      setCreateProductError('Sessao expirada. Faca login novamente.');
      return;
    }

    if (newProductTitle.trim().length < 3) {
      setCreateProductError('Titulo deve ter no minimo 3 caracteres.');
      return;
    }

    if (newProductDescription.trim().length < 10) {
      setCreateProductError('Descricao deve ter no minimo 10 caracteres.');
      return;
    }

    if (newProductCategoryIds.length === 0) {
      setCreateProductError('Selecione ao menos uma categoria.');
      return;
    }

    try {
      setIsCreatingProduct(true);
      setCreateProductError('');

      await apiFetch(
        '/products',
        {
          method: 'POST',
          body: JSON.stringify({
            title: newProductTitle.trim(),
            description: newProductDescription.trim(),
            categoryIds: newProductCategoryIds,
          }),
        },
        token,
      );

      setIsCreateProductModalOpen(false);
      setNewProductTitle('');
      setNewProductDescription('');
      setNewProductCategoryIds([]);
      router.push('/dashboard/products');
    } catch (error) {
      setCreateProductError(error instanceof Error ? error.message : 'Falha ao criar produto.');
    } finally {
      setIsCreatingProduct(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#002a5c]">Visao Geral do Sistema</h1>
          <p className="mt-2 text-[#434751] text-lg">Resumo das atividades governamentais e operacionais.</p>
        </div>
        <div className="flex gap-3">
          {isAdmin ? (
            <button
              type="button"
              onClick={() => {
                setCreateUserError('');
                setIsCreateUserModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded bg-[#004085] text-white px-4 py-2 font-semibold hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Novo Usuario
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleOpenCreateProductModal}
            className="inline-flex items-center gap-2 rounded bg-[#fdc003] text-[#6c5000] px-4 py-2 font-semibold hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Novo Produto
          </button>
          <Link
            href="/dashboard/audits"
            className="inline-flex items-center gap-2 rounded bg-[#004085] text-white px-4 py-2 font-semibold hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[20px]">policy</span>
            Auditoria
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <article
            key={metric.title}
            className={`rounded-lg border border-[#c3c6d2] bg-white p-5 min-h-[140px] border-l-4 ${metric.accent}`}
          >
            <span className="material-symbols-outlined text-[#004085]">{metric.icon}</span>
            <p className="mt-4 text-sm text-[#434751]">{metric.title}</p>
            <p className="text-4xl font-extrabold text-[#002a5c] mt-1">{metric.value}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <article className="xl:col-span-2 rounded-lg border border-[#c3c6d2] bg-white overflow-hidden">
          <header className="px-5 py-4 border-b border-[#e0e3e8] flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#002a5c]">Atividades Recentes</h2>
            <Link href="/dashboard/audits" className="text-[#0c458b] text-sm font-semibold hover:underline">
              Ver todas
            </Link>
          </header>
          <div className="divide-y divide-[#e0e3e8]">
            {[
              ['Ricardo Silva', 'Cadastrou Produto Notebook Dell', '14:23:45', 'Create'],
              ['Maria Oliveira', 'Excluiu Categoria Temporaria', '13:58:12', 'Delete'],
              ['Joao Ferreira', 'Atualizou estoque central', '12:15:00', 'Update'],
            ].map((item) => (
              <div key={`${item[0]}-${item[2]}`} className="px-5 py-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                <div>
                  <p className="font-semibold text-[#181c20]">{item[0]}</p>
                  <p className="text-sm text-[#434751]">{item[1]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#737782]">{item[2]}</p>
                  <span className="inline-flex mt-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-[#d7e3ff] text-[#0c458b]">
                    {item[3]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-[#c3c6d2] bg-[#004085] text-white p-5">
          <h3 className="text-xl font-bold">Transparencia Ativa</h3>
          <p className="mt-2 text-sm text-white">
            98.5% dos processos de auditoria foram concluidos dentro do prazo regulamentar neste mes.
          </p>
          <div className="mt-4 h-2 rounded-full bg-white">
            <div className="h-full rounded-full bg-[#fdc003] w-[98.5%]" />
          </div>
          <Link
            href="/dashboard/reports"
            className="inline-flex mt-5 rounded bg-white text-[#002a5c] px-4 py-2 font-semibold text-sm hover:bg-[#f1f4f9]"
          >
            Ver detalhes
          </Link>
        </article>
      </section>

      {isCreateUserModalOpen ? (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#c3c6d2] bg-white shadow-xl">
            <div className="px-6 py-4 border-b border-[#e0e3e8] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#002a5c]">Cadastrar novo usuario</h2>
              <button
                type="button"
                onClick={() => setIsCreateUserModalOpen(false)}
                className="text-[#737782] hover:text-[#181c20]"
                aria-label="Fechar modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Nome</label>
                <input
                  value={newUserName}
                  onChange={(event) => setNewUserName(event.target.value)}
                  placeholder="Nome completo"
                  className="w-full h-11 rounded border border-[#c3c6d2] px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">E-mail</label>
                <input
                  value={newUserEmail}
                  onChange={(event) => setNewUserEmail(event.target.value)}
                  placeholder="usuario@dominio.com"
                  type="email"
                  className="w-full h-11 rounded border border-[#c3c6d2] px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Senha</label>
                <input
                  value={newUserPassword}
                  onChange={(event) => setNewUserPassword(event.target.value)}
                  placeholder="Minimo 6 caracteres"
                  type="password"
                  className="w-full h-11 rounded border border-[#c3c6d2] px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Perfil</label>
                <select
                  value={newUserRole}
                  onChange={(event) => setNewUserRole(event.target.value as 'ADMIN' | 'USER')}
                  className="w-full h-11 rounded border border-[#c3c6d2] px-3"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {createUserError ? (
                <div className="rounded border border-[#ffdad6] bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]">
                  {createUserError}
                </div>
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-[#e0e3e8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateUserModalOpen(false)}
                className="h-10 rounded border border-[#c3c6d2] px-4 text-[#434751] font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateUser}
                disabled={isCreatingUser}
                className="h-10 rounded bg-[#004085] text-white px-4 font-semibold disabled:opacity-60"
              >
                {isCreatingUser ? 'Salvando...' : 'Criar usuario'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isCreateProductModalOpen ? (
        <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-lg border border-[#c3c6d2] bg-white shadow-xl max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b border-[#e0e3e8] flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#002a5c]">Cadastrar novo produto</h2>
              <button
                type="button"
                onClick={() => setIsCreateProductModalOpen(false)}
                className="text-[#737782] hover:text-[#181c20]"
                aria-label="Fechar modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Titulo</label>
                <input
                  value={newProductTitle}
                  onChange={(event) => setNewProductTitle(event.target.value)}
                  placeholder="Ex.: Notebook Dell i5"
                  className="w-full h-11 rounded border border-[#c3c6d2] px-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Descricao</label>
                <textarea
                  value={newProductDescription}
                  onChange={(event) => setNewProductDescription(event.target.value)}
                  placeholder="Descreva o produto"
                  rows={4}
                  className="w-full rounded border border-[#c3c6d2] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#434751] mb-2">Categorias</label>
                {isLoadingCategories ? (
                  <div className="text-sm text-[#737782]">Carregando categorias...</div>
                ) : categoryOptions.length ? (
                  <div className="rounded border border-[#c3c6d2] p-3 max-h-48 overflow-auto space-y-2">
                    {categoryOptions.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 text-sm text-[#181c20]">
                        <input
                          type="checkbox"
                          checked={newProductCategoryIds.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        {category.name}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-[#737782]">Nenhuma categoria encontrada.</div>
                )}
              </div>

              {createProductError ? (
                <div className="rounded border border-[#ffdad6] bg-[#ffdad6] px-3 py-2 text-sm text-[#93000a]">
                  {createProductError}
                </div>
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-[#e0e3e8] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateProductModalOpen(false)}
                className="h-10 rounded border border-[#c3c6d2] px-4 text-[#434751] font-semibold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateProduct}
                disabled={isCreatingProduct || isLoadingCategories}
                className="h-10 rounded bg-[#fdc003] text-[#6c5000] px-4 font-semibold disabled:opacity-60"
              >
                {isCreatingProduct ? 'Salvando...' : 'Criar produto'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
