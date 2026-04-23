"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Message } from '@uigovpe/components';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categories: { id: number; name: string }[];
}

interface Category {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data))
      .catch(() => console.error('Falha ao carregar categorias.'));
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/products', {
        params: {
          page,
          limit: 12,
          search: search || undefined,
          category: categoryId || undefined,
        },
      });
      setProducts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
      setTotalItems(response.data.meta.totalItems || 0);
    } catch {
      setError('Nao foi possivel carregar o catalogo.');
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchProducts();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleFavorite = async (id: number) => {
    try {
      await api.post(`/products/${id}/favorite`);
    } catch (error) {
      console.error('Falha ao favoritar:', error);
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <main className="main-content">
        <section className="page-hero rounded-[1.5rem] px-5 py-8 text-white sm:px-8 sm:py-10 md:px-10 md:py-12">
          <span className="eyebrow mb-4 flex w-fit items-center gap-2 border-white/20 bg-white/10 text-white">
            <i className="pi pi-box"></i>
            Catálogo Institucional
          </span>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-3xl text-center lg:text-left">
              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                Produtos com navegação clara e linguagem GovPE
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                Consulte, filtre e acompanhe os itens ativos do sistema com uma interface mais consistente e institucional.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-[28rem]">
              {[
                { label: 'Itens', value: totalItems || products.length },
                { label: 'Categorias', value: categories.length },
                { label: 'Página', value: page },
              ].map((item, idx) => (
                <div key={item.label} className={`rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur-md ${idx === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{item.label}</p>
                  <p className="mt-1 text-2xl font-black sm:text-3xl">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-card mx-auto mt-6 rounded-[1.5rem] p-4 sm:p-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gov-blue">Buscar Produto</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 transition-all focus-within:border-gov-blue/30 focus-within:ring-4 focus-within:ring-gov-blue/5">
                <i className="pi pi-search text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou descrição"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-gov-darkBlue outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2 lg:w-64">
              <span className="text-[10px] font-black uppercase tracking-widest text-gov-blue">Categoria</span>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setPage(1);
                  }}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-100 bg-slate-50/50 px-4 pr-10 text-sm font-bold text-gov-darkBlue outline-none transition-all focus:border-gov-blue/30 focus:ring-4 focus:ring-gov-blue/5"
                >
                  <option value="">Todas as categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
                <i className="pi pi-chevron-down absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"></i>
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 rounded-xl px-8 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/10 lg:w-auto"
            >
              Aplicar Filtros
            </Button>
          </form>
        </section>

        <section className="mt-8 w-full">
          {error ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-[1.5rem] bg-white p-8 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                <i className="pi pi-exclamation-triangle text-3xl"></i>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gov-darkBlue">Ops! Algo deu errado</h3>
                <p className="text-sm font-medium text-slate-500">{error}</p>
              </div>
              <Button onClick={fetchProducts} variant="outline" className="h-11 rounded-xl px-8 text-[11px] font-black uppercase tracking-widest">
                Tentar Novamente
              </Button>
            </div>
          ) : loading ? (
            <div className="grid-cards">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="surface-card flex h-96 flex-col rounded-[1.5rem] p-5 animate-pulse">
                  <div className="mb-6 aspect-video w-full rounded-2xl bg-slate-100"></div>
                  <div className="mb-4 h-6 w-3/4 rounded-lg bg-slate-100"></div>
                  <div className="h-4 w-1/2 rounded-lg bg-slate-50"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[1.5rem] bg-white p-10 text-center shadow-sm sm:p-16">
              <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                <i className="pi pi-inbox text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gov-darkBlue">Nenhum item encontrado</h3>
              <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-500">
                Ajuste os filtros ou limpe a busca para explorar novamente o catálogo completo de produtos.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('');
                  setCategoryId('');
                  setPage(1);
                }}
                className="mt-8 h-12 rounded-xl px-10 text-[11px] font-black uppercase tracking-widest"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-10">
              <div className="grid-cards w-full">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onFavorite={handleFavorite} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex w-full justify-center pb-10">
                  <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
