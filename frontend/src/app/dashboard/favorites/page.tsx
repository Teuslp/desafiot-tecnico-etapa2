"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';

export default function FavoritesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    fetchFavorites();
  }, []);

  const handleFavorite = async (id: number) => {
    try {
      await api.delete(`/products/${id}/favorite`);
      alert('Produto removido dos favoritos!');
      fetchFavorites(); 
    } catch (error) {
      alert('Erro ao desfavoritar.');
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gov-darkBlue mb-2">Meus Favoritos</h2>
          <p className="text-gray-600">Listagem dos produtos que você marcou com estrela.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold">
            Buscando seus favoritos...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gov-border rounded p-12 text-center text-gray-500">
            Você ainda não favoritou nenhum produto. Volte ao catálogo e escolha os seus favoritos!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onFavorite={handleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
