"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Category {
  id: number;
  name: string;
}

export default function NewProductPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Busca as categorias ao carregar a página
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Erro ao buscar categorias', err));
  }, []);

  const handleCategoryToggle = (id: number) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCategoryIds.length === 0) {
      setError('Por favor, selecione ao menos uma categoria.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Como tem arquivo (imagem), precisamos usar FormData
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);

      // Envia os IDs como string separada por vírgula (o backend trata isso no DTO)
      formData.append('categoryIds', selectedCategoryIds.join(','));

      if (image) {
        formData.append('image', image);
      }

      await api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redireciona de volta pro dashboard após criar
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar produto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gov-darkBlue mb-1">Novo Produto</h2>
            <p className="text-gray-600 text-sm">Preencha os dados para cadastrar um item.</p>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Voltar
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gov-border rounded p-6 shadow-sm space-y-6">

          <Input
            label="Título do Produto"
            placeholder="Ex: Notebook Corporativo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-semibold text-gov-text">Descrição</label>
            <textarea
              rows={4}
              placeholder="Descreva o produto"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gov-border rounded bg-white transition-colors focus:border-gov-blue focus:ring-1 focus:ring-gov-blue placeholder:italic placeholder:text-gray-400 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Preço (R$)"
              type="number"
              step="0.01"
              placeholder="Ex: 1500.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <div className="flex flex-col mb-4 relative">
              <label className="mb-1 text-sm font-semibold text-gov-text">Categorias vinculadas</label>
              
              {/* GATILHO DO DROPDOWN */}
              <div 
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`min-h-[42px] px-3 py-1.5 border rounded bg-white flex flex-wrap gap-1.5 items-center cursor-pointer transition-all ${isCategoryDropdownOpen ? 'border-gov-blue ring-1 ring-gov-blue' : 'border-gov-border hover:border-gov-blue'}`}
              >
                {selectedCategoryIds.length === 0 ? (
                  <span className="text-gray-400 text-sm italic">Selecione as categorias...</span>
                ) : (
                  categories.filter(c => selectedCategoryIds.includes(c.id)).map(cat => (
                    <span key={cat.id} className="bg-gov-lightBlue text-gov-blue text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5 animate-in fade-in scale-95 duration-200">
                      {cat.name}
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); handleCategoryToggle(cat.id); }}
                        className="hover:text-red-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))
                )}
                <i className={`fas fa-chevron-down ml-auto text-gray-400 text-[10px] transition-transform duration-300 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}></i>
              </div>

              {/* LISTA SUSPENSA */}
              {isCategoryDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gov-border rounded shadow-xl z-20 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                    {categories.length === 0 ? (
                      <p className="p-4 text-xs text-gray-500 italic text-center">Nenhuma categoria disponível.</p>
                    ) : categories.map(cat => (
                      <div 
                        key={cat.id}
                        onClick={() => handleCategoryToggle(cat.id)}
                        className="flex items-center px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors border-b last:border-0 border-gray-100"
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 transition-colors ${selectedCategoryIds.includes(cat.id) ? 'bg-gov-blue border-gov-blue' : 'border-gray-300 bg-white'}`}>
                          {selectedCategoryIds.includes(cat.id) && <i className="fas fa-check text-[8px] text-white"></i>}
                        </div>
                        <span className={`text-sm ${selectedCategoryIds.includes(cat.id) ? 'font-bold text-gov-blue' : 'text-gray-700'}`}>
                          {cat.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col mb-4">
            <label className="mb-1 text-sm font-semibold text-gov-text">Imagem do Produto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gov-lightBlue file:text-gov-blue hover:file:bg-gov-blue hover:file:text-white transition-colors cursor-pointer"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-gov-red border border-gov-red p-3 rounded text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Produto'}
            </Button>
          </div>

        </form>
      </main>
    </div>
  );
}
