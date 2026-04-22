"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { ProductCard } from '@/components/ui/ProductCard';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categories: { id: number; name: string }[];
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gov-darkBlue mb-2">Catálogo de Produtos</h2>
          <p className="text-gray-600">Explore os itens disponíveis no sistema.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-semibold">
            Carregando produtos...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gov-border rounded p-12 text-center text-gray-500">
            Nenhum produto cadastrado ainda. Clique em "+ Novo Produto" no menu superior.
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
