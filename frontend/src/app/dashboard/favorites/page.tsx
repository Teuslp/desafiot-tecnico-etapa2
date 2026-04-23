"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/components/ui/ProductCard';

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/favorites');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchFavorites();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const handleFavorite = async (id: number) => {
    try {
      await api.delete(`/products/${id}/favorite`);
      fetchFavorites();
    } catch (error) {
      console.error('Erro ao desfavoritar:', error);
    }
  };

  return (
    <div className="page-shell">
      <Header />

      <main className="main-content">
        <section className="page-hero rounded-[1rem] px-4 py-6 text-white sm:px-5 sm:py-7 md:px-7 md:py-8">
          <span className="eyebrow text-white">
            <i className="pi pi-heart-fill"></i>
            Selecao pessoal
          </span>
          <div className="mt-5 flex flex-col items-center gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <div className="max-w-3xl">
              <h1 className="section-title text-white">Favoritos salvos para acesso rapido</h1>
              <p className="section-subtitle mt-4">
                Mantenha por perto os produtos mais relevantes para o seu dia a dia e volte a eles com facilidade.
              </p>
            </div>
            <div className="w-full max-w-[15rem] rounded-[0.9rem] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <p className="text-[0.68rem] font-black uppercase tracking-[0.2em] text-white/70">Itens favoritados</p>
              <p className="mt-2 text-2xl font-black sm:text-3xl">{products.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 w-full">
          {loading ? (
            <div className="grid-cards">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="surface-card flex h-88 flex-col rounded-[1rem] p-4 animate-pulse sm:h-96 sm:p-5">
                  <div className="mb-5 h-44 w-full rounded-[0.9rem] bg-slate-100 sm:h-48"></div>
                  <div className="mb-3 h-6 w-3/4 rounded-md bg-slate-100"></div>
                  <div className="h-4 w-1/2 rounded-md bg-slate-50"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-[1rem] bg-white px-5 py-10 text-center shadow-sm sm:px-8 sm:py-14">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-300 sm:h-20 sm:w-20">
                <i className="pi pi-heart text-4xl"></i>
              </div>
              <h3 className="text-2xl font-black text-gov-darkBlue">Sua lista ainda esta vazia</h3>
              <p className="mb-10 mt-3 max-w-sm text-sm leading-7 text-slate-500">
                Favorite produtos no catalogo principal para montar sua area de acesso rapido.
              </p>
              <Button onClick={() => router.push('/dashboard')} className="h-11 rounded-xl px-8 text-[11px] font-black uppercase tracking-[0.16em] shadow-lg sm:h-12">
                Ver catalogo
              </Button>
            </div>
          ) : (
            <div className="grid-cards">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
