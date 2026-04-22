"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/ui/Pagination';

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

  // Paginação e Filtros
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Busca Categorias para o filtro
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products', {
        params: {
          page,
          limit: 8, // 8 produtos por página (2 linhas de 4)
          search: search || undefined,
          category: categoryId || undefined
        }
      });
      // Como o backend agora retorna { data, meta }
      setProducts(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, categoryId]); // Recarrega ao mudar página ou categoria

  // Para o campo de busca (debounce manual no botão ou no form)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Volta pra primeira página ao buscar
    fetchProducts();
  };

  const handleFavorite = async (id: number) => {
    try {
      await api.post(`/products/${id}/favorite`);
      alert('Produto favoritado com sucesso! O dono foi notificado via evento.');
    } catch (error) {
      alert('Erro ao favoritar o produto. Verifique se você já o favoritou.');
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gov-darkBlue mb-2">Catálogo de Produtos</h2>
          <p className="text-gray-600 mb-6">Explore os itens disponíveis no sistema.</p>

          {/* BARRA DE PESQUISA E FILTROS */}
          <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded border border-gov-border shadow-sm flex flex-col md:flex-row gap-4 items-end mb-8">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pesquisar</label>
              <input 
                type="text" 
                placeholder="Título ou descrição..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 border border-gov-border rounded focus:ring-1 focus:ring-gov-blue outline-none"
              />
            </div>
            
            <div className="w-full md:w-64">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
              <select 
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gov-border rounded focus:ring-1 focus:ring-gov-blue outline-none bg-white"
              >
                <option value="">Todas as Categorias</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button type="submit" className="bg-gov-darkBlue text-white font-bold px-6 py-2 rounded hover:bg-gov-blue transition-colors">
              Filtrar
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold">
            Carregando produtos...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gov-border rounded p-12 text-center text-gray-500">
            Nenhum produto encontrado para este filtro.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onFavorite={handleFavorite}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
